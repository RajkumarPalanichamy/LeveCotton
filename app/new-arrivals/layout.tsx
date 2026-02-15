import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Arrivals',
    description: 'Explore the latest collection of premium sarees and ethnic wear at Leve Cottons. Stay ahead of the trends with our new arrivals.',
    openGraph: {
        title: 'New Arrivals | Leve Cottons',
        description: 'Explore the latest collection of premium sarees and ethnic wear at Leve Cottons.',
    },
};

export default function NewArrivalsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
