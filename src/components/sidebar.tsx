'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PAGE_PERMISSIONS } from '@/utils/pagePermission';
import { BarSVG } from '../../public/assets/icons/bar';
import { useEffect, useRef, useState } from 'react';

const SideBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [openListTab, setOpenListTab] = useState(false);
    const permissions = useSelector((state: RootState) => state.auth.permissions);
    const listTabRef = useRef<HTMLDivElement>(null);

    const checkPage = (uri: string) => {
        return pathname.includes(uri);
    };

    const checkPermissions = (necessaryPermissions: string[]) => {
        if (permissions) {
            const hasPermisson = necessaryPermissions.find((element) => permissions.includes(element));
            return hasPermisson;
        } else {
            router.push('/login');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listTabRef.current && !listTabRef.current.contains(event.target as Node)) {
                setOpenListTab(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="sm:fixed absolute top-0 left-0 right-0 mt-20 flex items-center justify-between border-b shadow-lg py-2 px-4 sm:px-16 bg-white z-20">
            <div className="flex justify-end w-full">
                <div className="relative" id="list-tab" ref={listTabRef}>
                    <button className="block sm:hidden" onClick={() => setOpenListTab(!openListTab)}>
                        <BarSVG className="size-6" />
                    </button>
                    <ul
                        className={`${
                            openListTab ? 'block' : 'hidden'
                        } absolute right-0 sm:flex sm:relative justify-between items-center text-sm bg-white shadow-lg border rounded sm:rounded-none sm:border-none sm:shadow-none`}
                    >
                        <li
                            className={`sm:px-4 ${
                                checkPermissions(PAGE_PERMISSIONS['homePage'].permissions) ? 'block' : 'hidden'
                            }`}
                        >
                            <button
                                onClick={() => router.push('/agent/home-page')}
                                className={`sm:border-b-4 p-2 w-full text-end sm:text-start sm:w-fit sm:p-0 sm:hover:border-red-400 whitespace-nowrap ${
                                    checkPage('/agent/home-page')
                                        ? 'sm:bg-white sm:border-red-400 bg-gray-100'
                                        : 'sm:border-transparent'
                                }`}
                            >
                                Kiểm tra điều kiện
                            </button>
                        </li>
                        <li
                            className={`sm:px-4 ${
                                checkPermissions(PAGE_PERMISSIONS['adminServiceHistory'].permissions)
                                    ? 'block'
                                    : 'hidden'
                            }`}
                        >
                            <button
                                onClick={() => router.push('/admin/service-history')}
                                className={`sm:border-b-4 p-2 w-full text-end sm:text-start sm:w-fit sm:p-0 sm:hover:border-red-400 whitespace-nowrap ${
                                    checkPage('/admin/service-history')
                                        ? 'sm:bg-white sm:border-red-400 bg-gray-100'
                                        : 'sm:border-transparent'
                                }`}
                            >
                                Lịch sử sử dụng dịch vụ
                            </button>
                        </li>
                        <li
                            className={`sm:px-4 ${
                                checkPermissions(PAGE_PERMISSIONS['adminUsers'].permissions) ? 'block' : 'hidden'
                            }`}
                        >
                            <button
                                onClick={() => router.push('/admin/users')}
                                className={`sm:border-b-4 p-2 w-full text-end sm:text-start sm:w-fit sm:p-0 sm:hover:border-red-400 whitespace-nowrap ${
                                    checkPage('/admin/users')
                                        ? 'sm:bg-white sm:border-red-400 bg-gray-100'
                                        : 'sm:border-transparent'
                                }`}
                            >
                                Người dùng
                            </button>
                        </li>
                        <li
                            className={`sm:px-4 ${
                                checkPermissions(PAGE_PERMISSIONS['adminAgencies'].permissions) ? 'block' : 'hidden'
                            }`}
                        >
                            <button
                                onClick={() => router.push('/admin/agencies')}
                                className={`sm:border-b-4 p-2 w-full text-end sm:text-start sm:w-fit sm:p-0 sm:hover:border-red-400 whitespace-nowrap ${
                                    checkPage('/admin/agencies')
                                        ? 'sm:bg-white sm:border-red-400 bg-gray-100'
                                        : 'sm:border-transparent'
                                }`}
                            >
                                Đối tác
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
