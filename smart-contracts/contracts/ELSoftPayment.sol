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
 */
contract ELSoftPayment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Payment token (USDT)
    IERC20 public immutable paymentToken;

    // Total revenue collected
    uint256 public totalRevenue;

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

    event PaymentTokenUpdated(
        address indexed oldToken,
        address indexed newToken
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

    /**
     * @dev Purchase a product
     * @param productId The ID of the product being purchased
     * @param amount The amount in payment token (with decimals)
     */
    function buyProduct(
        string calldata productId,
        uint256 amount
    ) external nonReentrant {
        require(bytes(productId).length > 0, "Invalid product ID");
        require(amount > 0, "Amount must be greater than 0");

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
