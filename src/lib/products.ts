// Product data migrated from products-data.js
export interface Product {
    id: string;
    name: string;
    desc: string;
    price: string;        // Display price (e.g., "$649")
    priceUSD: number;     // Numeric price in USD for payment
    cat: string;
    badges: string[];
    hue: number;
}

export const products: Product[] = [
    {
        id: 'test-product',
        name: '결제 테스트 상품',
        desc: '결제 시스템 테스트용 1달러 상품입니다',
        price: '$1',
        priceUSD: 1,
        cat: '테스트',
        badges: ['테스트', 'NEW'],
        hue: 60,
    },
    {
        id: 'jetbrains-all',
        name: 'JetBrains All Products Pack',
        desc: 'IntelliJ IDEA Ultimate, WebStorm, PyCharm 등 모든 IDE 통합 라이선스',
        price: '$649',
        priceUSD: 649,
        cat: '개발',
        badges: ['인기', '구독'],
        hue: 250,
    },
    {
        id: 'ms-office-365',
        name: 'Microsoft 365 Business',
        desc: 'Word, Excel, PowerPoint, Teams, OneDrive 1TB 포함',
        price: '$149',
        priceUSD: 149,
        cat: '오피스',
        badges: ['구독', '클라우드'],
        hue: 200,
    },
    {
        id: 'adobe-cc',
        name: 'Adobe Creative Cloud',
        desc: 'Photoshop, Illustrator, Premiere Pro 등 전체 앱',
        price: '$599',
        priceUSD: 599,
        cat: '디자인',
        badges: ['구독', '인기'],
        hue: 340,
    },
    {
        id: 'github-enterprise',
        name: 'GitHub Enterprise',
        desc: '고급 보안, 감사 로그, SSO, 셀프호스팅 옵션',
        price: '$252',
        priceUSD: 252,
        cat: '개발',
        badges: ['기업'],
        hue: 270,
    },
    {
        id: 'figma-org',
        name: 'Figma Organization',
        desc: '무제한 팀, SSO, 디자인 시스템 분석',
        price: '$900',
        priceUSD: 900,
        cat: '디자인',
        badges: ['협업'],
        hue: 320,
    },
    {
        id: 'notion-team',
        name: 'Notion Team Plan',
        desc: '무제한 블록, 협업 워크스페이스, API 연동',
        price: '$120',
        priceUSD: 120,
        cat: '오피스',
        badges: ['협업', '인기'],
        hue: 40,
    },
    {
        id: 'norton-360',
        name: 'Norton 360 Premium',
        desc: '10대 장치 보호, VPN, 다크웹 모니터링',
        price: '$79',
        priceUSD: 79,
        cat: '보안',
        badges: ['가정용'],
        hue: 120,
    },
    {
        id: 'crowdstrike',
        name: 'CrowdStrike Falcon',
        desc: '엔드포인트 보안, XDR, 위협 인텔리전스',
        price: 'Contact',
        priceUSD: 0,
        cat: '보안',
        badges: ['기업', 'EDR'],
        hue: 10,
    },
];

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === '전체') return products;
    return products.filter((p) => p.cat === category);
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.desc.toLowerCase().includes(lowerQuery) ||
            p.cat.toLowerCase().includes(lowerQuery)
    );
}
