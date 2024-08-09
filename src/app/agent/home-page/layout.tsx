'use client';

import SideBar from '@/components/sidebar';
import Footer from '../../../components/footer';
import Headers from '../../../components/header';
import usePersistedAuth from '@/customHook/usePersistedAuth';

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
    const isLoading = usePersistedAuth();
    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return (
            <section>
                <Headers />
                <SideBar />
                <div className="pt-24 w-screen h-screen box-border">{children}</div>
                <Footer />
            </section>
        );
    }
}
