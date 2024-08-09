'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useClearUser } from '@/customHook/useClearUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Headers() {
    const router = useRouter();
    const clearUser = useClearUser();
    const name = useSelector((state: RootState) => state.auth.name);

    const signOut = () => {
        clearUser();
        router.push('/login');
    };
    return (
        <div className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between border-b shadow p-2 px-16 bg-white z-20">
            <div className="flex items-center">
                <Image src={'/assets/images/logoVietjet.png'} alt="Vietjet Logo" height={60} width={232}></Image>
                <div className="text-2xl font-bold ml-8">Lounge Application</div>
            </div>
            <div className="flex justify-between items-center">
                <p className="pr-2 border-r">Hi, {name}</p>
                <button
                    onClick={() => signOut()}
                    className="flex items-center justify-between rounded-md p-1 pl-2 border-l hover:bg-gray-100"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}
