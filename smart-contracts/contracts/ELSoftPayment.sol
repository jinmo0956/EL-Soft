// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ELSoftPayment
 * @dev Payment contract for EL SOFT software store
 * Handles USDT payments and records purchases on-chain
 * 
 * Security Features:
 * - On-chain price validation to prevent price manipulation
 * - Product registry with owner-only management
 * - ReentrancyGuard for safe token transfers
 */
contract ELSoftPayment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Payment token (USDT)
    IERC20 public immutable paymentToken;

    // Total revenue collected
    uint256 public totalRevenue;

    // ============================================
    // Product Registry (Security Fix #1)
    // ============================================
    
    // Product price mapping (productId => price in token's smallest unit)
    mapping(string => uint256) public productPrices;
    
    // Product existence check
    mapping(string => bool) public productExists;
    
    // Product active status
    mapping(string => bool) public productActive;

    // Purchase record
    struct Purchase {
        address buyer;
        string productId;
        uint256 amount;
        uint256 timestamp;
    }

    // All purchases
    Purchase[] public purchases;

    // Mapping: buyer address => their purchase indices
    mapping(address => uint256[]) public buyerPurchases;

    // Events
    event ProductPurchased(
        address indexed buyer,
        string productId,
        uint256 amount,
        uint256 timestamp,
        uint256 purchaseIndex
    );

    event FundsWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    event ProductRegistered(
        string productId,
        uint256 price,
        uint256 timestamp
    );

    event ProductUpdated(
        string productId,
        uint256 oldPrice,
        uint256 newPrice,
        bool active
    );

    event ProductDeactivated(
        string productId,
        uint256 timestamp
    );

    /**
     * @dev Constructor
     * @param _paymentToken Address of the payment token (USDT)
     * @param _initialOwner Address of the contract owner
     */
    constructor(
        address _paymentToken,
        address _initialOwner
    ) Ownable(_initialOwner) {
        require(_paymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_paymentToken);
    }

    // ============================================
    // Product Management (Owner Only)
    // ============================================

    /**
     * @dev Register a new product with price
     * @param productId The unique ID of the product
     * @param price The price in payment token's smallest unit (e.g., 6 decimals for USDT)
     */
    function registerProduct(
        string calldata productId,
        uint256 price
    ) external onlyOwner {
        require(bytes(productId).length > 0, "Invalid product ID");
        require(price > 0, "Price must be greater than 0");
        require(!productExists[productId], "Product already exists");

        productPrices[productId] = price;
        productExists[productId] = true;
        productActive[productId] = true;

        emit ProductRegistered(productId, price, block.timestamp);
    }

    /**
     * @dev Update product price
     * @param productId The ID of the product
     * @param newPrice The new price
     */
    function updateProductPrice(
        string calldata productId,
        uint256 newPrice
    ) external onlyOwner {
        require(productExists[productId], "Product does not exist");
        require(newPrice > 0, "Price must be greater than 0");

        uint256 oldPrice = productPrices[productId];
        productPrices[productId] = newPrice;

        emit ProductUpdated(productId, oldPrice, newPrice, productActive[productId]);
    }

    /**
     * @dev Activate or deactivate a product
     * @param productId The ID of the product
     * @param active Whether the product should be active
     */
    function setProductActive(
        string calldata productId,
        bool active
    ) external onlyOwner {
        require(productExists[productId], "Product does not exist");
        
        productActive[productId] = active;

        if (!active) {
            emit ProductDeactivated(productId, block.timestamp);
        } else {
            emit ProductUpdated(productId, productPrices[productId], productPrices[productId], true);
        }
    }

    /**
     * @dev Batch register multiple products
     * @param productIds Array of product IDs
     * @param prices Array of prices
     */
    function batchRegisterProducts(
        string[] calldata productIds,
        uint256[] calldata prices
    ) external onlyOwner {
        require(productIds.length == prices.length, "Arrays length mismatch");
        require(productIds.length > 0, "Empty arrays");

        for (uint256 i = 0; i < productIds.length; i++) {
            require(bytes(productIds[i]).length > 0, "Invalid product ID");
            require(prices[i] > 0, "Price must be greater than 0");
            require(!productExists[productIds[i]], "Product already exists");

            productPrices[productIds[i]] = prices[i];
            productExists[productIds[i]] = true;
            productActive[productIds[i]] = true;

            emit ProductRegistered(productIds[i], prices[i], block.timestamp);
        }
    }

    // ============================================
    // Purchase Functions
    // ============================================

    /**
     * @dev Purchase a product (with price validation)
     * @param productId The ID of the product being purchased
     * @param amount The amount in payment token (must be >= product price)
     */
    function buyProduct(
        string calldata productId,
        uint256 amount
    ) external nonReentrant {
        // Security Check #1: Product must exist
        require(productExists[productId], "Product does not exist");
        
        // Security Check #2: Product must be active
        require(productActive[productId], "Product is not available");
        
        // Security Check #3: Amount must be >= product price (CRITICAL)
        uint256 requiredPrice = productPrices[productId];
        require(amount >= requiredPrice, "Insufficient payment amount");

        // Transfer tokens from buyer to this contract
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        // Record purchase
        uint256 purchaseIndex = purchases.length;
        purchases.push(Purchase({
            buyer: msg.sender,
            productId: productId,
            amount: amount,
            timestamp: block.timestamp
        }));

        // Track buyer's purchases
        buyerPurchases[msg.sender].push(purchaseIndex);

        // Update total revenue
        totalRevenue += amount;

        // Emit event
        emit ProductPurchased(
            msg.sender,
            productId,
            amount,
            block.timestamp,
            purchaseIndex
        );
    }

    /**
     * @dev Get product info
     * @param productId The ID of the product
     */
    function getProduct(
        string calldata productId
    ) external view returns (
        uint256 price,
        bool exists,
        bool active
    ) {
        return (
            productPrices[productId],
            productExists[productId],
            productActive[productId]
        );
    }

    // ============================================
    // Withdrawal Functions
    // ============================================

    /**
     * @dev Withdraw all funds to owner
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");

        paymentToken.safeTransfer(owner(), balance);

        emit FundsWithdrawn(owner(), balance, block.timestamp);
    }

    /**
     * @dev Withdraw specific amount to owner
     * @param amount Amount to withdraw
     */
    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");

        paymentToken.safeTransfer(owner(), amount);

        emit FundsWithdrawn(owner(), amount, block.timestamp);
    }

    // ============================================
    // View Functions
    // ============================================

    /**
     * @dev Get total number of purchases
     */
    function getPurchaseCount() external view returns (uint256) {
        return purchases.length;
    }

    /**
     * @dev Get purchases by buyer
     * @param buyer Address of the buyer
     */
    function getPurchasesByBuyer(
        address buyer
    ) external view returns (uint256[] memory) {
        return buyerPurchases[buyer];
    }

    /**
     * @dev Get purchase details
     * @param index Index of the purchase
     */
    function getPurchase(
        uint256 index
    ) external view returns (
        address buyer,
        string memory productId,
        uint256 amount,
        uint256 timestamp
    ) {
        require(index < purchases.length, "Invalid purchase index");
        Purchase storage p = purchases[index];
        return (p.buyer, p.productId, p.amount, p.timestamp);
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }

    /**
     * @dev Emergency withdraw any ERC20 token (owner only)
     * @param token Address of the token to withdraw
     */
    function emergencyWithdraw(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        tokenContract.safeTransfer(owner(), balance);
    }
}
