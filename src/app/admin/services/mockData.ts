// EL-Soft Schema based Mock Data

// User Type
export interface User {
    wallet_address: string;
    nickname: string;
    email: string;
    role: 'admin' | 'user';
    is_banned: boolean;
    created_at: string;
    last_login: string;
}

// Product Type
export interface Product {
    id: string;
    name: string;
    name_ko: string;
    price: number;
    category: string;
    description_ko: string;
    is_active: boolean;
    created_at: string;
}

// Order Type
export interface Order {
    id: string;
    wallet_address: string;
    product_name: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    created_at: string;
    paid_at: string | null;
}

// Inquiry Type
export interface Inquiry {
    id: string;
    user_wallet: string;
    contact_info: string;
    message: string;
    status: 'resolved' | 'pending' | 'spam';
    created_at: string;
    resolved_at: string | null;
}

// Users Data
export const usersData: User[] = [
    {
        wallet_address: '0x123abc...def456',
        nickname: 'CryptoKing',
        email: 'crypto@example.com',
        role: 'admin',
        is_banned: false,
        created_at: '2023-10-15T12:00:00Z',
        last_login: '2023-11-20T09:30:00Z',
    },
    {
        wallet_address: '0x789xyz...123abc',
        nickname: 'NewbieTrader',
        email: 'newbie@example.com',
        role: 'user',
        is_banned: false,
        created_at: '2023-11-01T15:20:00Z',
        last_login: '2023-11-19T18:45:00Z',
    },
    {
        wallet_address: '0xbadguy...999aaa',
        nickname: 'ScamBot',
        email: 'scam@fake.com',
        role: 'user',
        is_banned: true,
        created_at: '2023-11-05T08:10:00Z',
        last_login: '2023-11-05T08:15:00Z',
    },
    {
        wallet_address: '0xuser04...abcdef',
        nickname: 'InvestorKim',
        email: 'invest@korea.com',
        role: 'user',
        is_banned: false,
        created_at: '2023-11-10T11:00:00Z',
        last_login: '2023-11-21T10:00:00Z',
    },
    {
        wallet_address: '0xuser05...123456',
        nickname: 'DevLee',
        email: 'dev@korea.com',
        role: 'user',
        is_banned: false,
        created_at: '2023-11-12T14:30:00Z',
        last_login: '2023-11-21T11:20:00Z',
    },
];

// Products Data
export const productsData: Product[] = [
    {
        id: 'jetbrains-all',
        name: 'JetBrains All Products Pack',
        name_ko: 'JetBrains 전체 제품 팩',
        price: 249.00,
        category: 'ide',
        description_ko: 'IntelliJ IDEA, PyCharm, WebStorm 등 모든 JetBrains IDE 이용 가능',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 'ms365-personal',
        name: 'Microsoft 365 Personal',
        name_ko: 'Microsoft 365 개인용',
        price: 99.00,
        category: 'office',
        description_ko: 'Word, Excel, PowerPoint, Outlook 및 1TB OneDrive 저장공간',
        is_active: true,
        created_at: '2023-02-15T00:00:00Z',
    },
    {
        id: 'adobe-cc',
        name: 'Adobe Creative Cloud',
        name_ko: 'Adobe Creative Cloud',
        price: 599.00,
        category: 'design',
        description_ko: 'Photoshop, Illustrator, Premiere Pro 등 모든 Creative Cloud 앱 이용 가능',
        is_active: true,
        created_at: '2023-03-10T00:00:00Z',
    },
    {
        id: 'nordvpn-1y',
        name: 'NordVPN 1 Year',
        name_ko: 'NordVPN 1년 이용권',
        price: 59.99,
        category: 'security',
        description_ko: '최고의 보안을 자랑하는 NordVPN 1년 구독권',
        is_active: true,
        created_at: '2023-04-05T00:00:00Z',
    },
];

// Orders Data (Revenue)
export const ordersData: Order[] = [
    {
        id: 'ord-001',
        wallet_address: '0x123abc...def456',
        product_name: 'JetBrains All Products Pack',
        amount: 249.00,
        status: 'paid',
        created_at: '2023-11-15T10:00:00Z',
        paid_at: '2023-11-15T10:05:00Z',
    },
    {
        id: 'ord-002',
        wallet_address: '0x789xyz...123abc',
        product_name: 'Microsoft 365 Personal',
        amount: 99.00,
        status: 'paid',
        created_at: '2023-11-16T14:20:00Z',
        paid_at: '2023-11-16T14:25:00Z',
    },
    {
        id: 'ord-003',
        wallet_address: '0xuser04...abcdef',
        product_name: 'Adobe Creative Cloud',
        amount: 599.00,
        status: 'pending',
        created_at: '2023-11-17T09:00:00Z',
        paid_at: null,
    },
    {
        id: 'ord-004',
        wallet_address: '0xuser05...123456',
        product_name: 'NordVPN 1 Year',
        amount: 59.99,
        status: 'paid',
        created_at: '2023-11-18T16:45:00Z',
        paid_at: '2023-11-18T16:50:00Z',
    },
    {
        id: 'ord-005',
        wallet_address: '0x123abc...def456',
        product_name: 'Microsoft 365 Personal',
        amount: 99.00,
        status: 'paid',
        created_at: '2023-11-19T11:10:00Z',
        paid_at: '2023-11-19T11:15:00Z',
    },
    {
        id: 'ord-006',
        wallet_address: '0xnew...user',
        product_name: 'JetBrains All Products Pack',
        amount: 249.00,
        status: 'paid',
        created_at: '2023-11-20T13:00:00Z',
        paid_at: '2023-11-20T13:05:00Z',
    },
];

// Inquiries Data
export const inquiriesData: Inquiry[] = [
    {
        id: 'inq-001',
        user_wallet: '0x789xyz...123abc',
        contact_info: 'newbie@example.com',
        message: '결제가 진행되지 않습니다. 어떻게 해야 하나요?',
        status: 'resolved',
        created_at: '2023-11-16T15:00:00Z',
        resolved_at: '2023-11-16T16:00:00Z',
    },
    {
        id: 'inq-002',
        user_wallet: '0xuser04...abcdef',
        contact_info: '@telegram_user',
        message: '대량 구매 할인이 가능한가요?',
        status: 'pending',
        created_at: '2023-11-18T10:00:00Z',
        resolved_at: null,
    },
    {
        id: 'inq-003',
        user_wallet: '0xbadguy...999aaa',
        contact_info: 'spam@spam.com',
        message: '무료로 제품을 받고 싶습니다.',
        status: 'spam',
        created_at: '2023-11-05T09:00:00Z',
        resolved_at: '2023-11-05T10:00:00Z',
    },
];
