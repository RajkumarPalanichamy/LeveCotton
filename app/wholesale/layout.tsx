import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wholesale',
    description: 'Bulk orders and wholesale opportunities at Leve Cottons. Get premium quality sarees for your business.',
    openGraph: {
        title: 'Wholesale | Leve Cottons',
        description: 'Bulk orders and wholesale opportunities at Leve Cottons.',
    },
};

export default function WholesaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
