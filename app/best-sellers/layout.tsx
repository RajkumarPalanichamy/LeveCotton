import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Sellers',
    description: 'Shop our most loved and best-selling sarees. Discover the favorites of Leve Cottons customers.',
    openGraph: {
        title: 'Best Sellers | Leve Cottons',
        description: 'Shop our most loved and best-selling sarees.',
    },
};

export default function BestSellersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
