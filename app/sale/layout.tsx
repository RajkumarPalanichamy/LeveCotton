import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sale',
    description: 'Limited time offers on premium sarees. Shop the Leve Cottons sale and get your favorites at the best prices.',
    openGraph: {
        title: 'Sale | Leve Cottons',
        description: 'Limited time offers on premium sarees.',
    },
};

export default function SaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
