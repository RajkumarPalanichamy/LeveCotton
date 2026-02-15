import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Designer Collections',
    description: 'Explore our exclusive designer collections. Handpicked sarees that blend tradition with modern aesthetics.',
    openGraph: {
        title: 'Designer Collections | Leve Cottons',
        description: 'Explore our exclusive designer collections.',
    },
};

export default function CollectionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
