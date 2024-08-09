'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PAGE_PERMISSIONS } from '@/utils/pagePermission';

const SideBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const permissions = useSelector((state: RootState) => state.auth.permissions);

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

    return (
        <div className="fixed top-0 left-0 right-0 mt-20 flex items-center justify-between border-b shadow-lg p-2 px-16 bg-white z-20">
            <div className="flex justify-end w-full">
                <ul className="flex justify-between items-center text-sm">
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['homePage'].permissions) ? 'block' : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/agent/home-page')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/agent/home-page') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Kiểm tra điều kiện
                        </button>
                    </li>
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['adminServiceHistory'].permissions) ? 'block' : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/admin/service-history')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/admin/service-history') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Lịch sử sử dụng dịch vụ
                        </button>
                    </li>
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['adminUsers'].permissions) ? 'block' : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/admin/users')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/admin/users') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Người dùng
                        </button>
                    </li>
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['adminAgencies'].permissions) ? 'block' : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/admin/agencies')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/admin/agencies') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Đại lý
                        </button>
                    </li>
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['adminLounges'].permissions) ? 'block' : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/admin/lounges')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/admin/lounges') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Phòng chờ
                        </button>
                    </li>
                    <li
                        className={`px-4 ${
                            checkPermissions(PAGE_PERMISSIONS['adminConnectingServices'].permissions)
                                ? 'block'
                                : 'hidden'
                        }`}
                    >
                        <button
                            onClick={() => router.push('/admin/connecting-services')}
                            className={`border-b-4 hover:border-red-400 ${
                                checkPage('/admin/connecting-services') ? 'border-red-400' : 'border-transparent'
                            }`}
                        >
                            Dịch vụ nối chuyến
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
