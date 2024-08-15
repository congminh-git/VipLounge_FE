'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useClearUser } from '@/customHook/useClearUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EditIcon } from '../../public/assets/icons/editIcon';
import { SignOutSVG } from '../../public/assets/icons/signOut';
import { UserIcon } from '../../public/assets/icons/userIcon';
import ResetPasswordModal from './modals/resetPasswordModals/resetPasswordModal';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Headers() {
    const router = useRouter();
    const clearUser = useClearUser();
    const name = useSelector((state: RootState) => state.auth.name);
    const [isOpenResetPassword, setIsOpenResetPassword] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);

    const signOut = () => {
        clearUser();
        router.push('/login');
    };

    useEffect(() => {
        setScreenWidth(window.innerWidth);
    }, []);

    return (
        <div className="sm:fixed absolute top-0 left-0 right-0 h-20 flex items-center justify-between border-b sm:px-16 px-4 bg-white z-30">
            <div>
                <Link className="sm:flex block items-center" href={'/agent/home-page'}>
                    <Image
                        src={'/assets/images/logoVietjet.png'}
                        alt="Vietjet Logo"
                        height={screenWidth < 640 ? 20 : 60}
                        width={screenWidth < 640 ? 77 : 232}
                    ></Image>
                    <div className="sm:text-2xl text-lg font-bold ml-0 sm:ml-8">Lounge Application</div>
                </Link>
            </div>
            <div className="relative group flex items-center">
                <div className="flex items-center">
                    <span className="sm:block hidden">{name}</span>
                    <UserIcon className="ml-2 size-8" />
                </div>
                <div className="hidden absolute right-0 top-full mt-2 bg-gray-100 z-100 border rounded shadow-lg group-hover:flex">
                    <div className="h-2 -top-2 absolute w-full left-0 right-0 bg-transparent"></div>
                    <div className="h-0 w-0 border-8 border-transparent border-b-gray-100 absolute -top-4 right-2"></div>
                    <ul className="text-sm">
                        <li className="hover:bg-white p-2">
                            <button
                                className="flex items-center flex-nowrap whitespace-nowrap"
                                onClick={() => setIsOpenResetPassword(true)}
                            >
                                Đổi mật khẩu <EditIcon className="ml-2" />
                            </button>
                        </li>
                        <li className="hover:bg-white p-2">
                            <button
                                className="flex items-center flex-nowrap whitespace-nowrap"
                                onClick={() => signOut()}
                            >
                                Đăng xuất
                                <SignOutSVG className="size-4 ml-2" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <ResetPasswordModal isOpen={isOpenResetPassword} onOpenChange={setIsOpenResetPassword} />
        </div>
    );
}
