'use client';

import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push('/agent/home-page');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <></>;
}

export default withAuth(Home);
