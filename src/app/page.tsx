'use client';

import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push('/agent/home-page');
    }, []);
    return <></>;
}

export default withAuth(Home);
