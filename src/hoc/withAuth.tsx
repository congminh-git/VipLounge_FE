'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '@/redux/store';
import { usePathname } from 'next/navigation';
import { IPagePermissions, PAGE_PERMISSIONS } from '@/utils/pagePermission';
import { useClearUser } from '@/customHook/useClearUser';
import Swal from 'sweetalert2';

type DecodedToken = {
    exp: number;
};

const withAuth = (WrappedComponent: ComponentType<any>) => {
    const ComponentWithAuth = (props: any) => {
        const router = useRouter();
        const clearUser = useClearUser();
        const token = useSelector((state: RootState) => state.auth.token);
        const permissions = useSelector((state: RootState) => state.auth.permissions);
        const pathname = usePathname();

        const isTokenExpired = (token: string) => {
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                return decodedToken.exp < currentTime;
            } catch (e) {
                return true;
            }
        };

        const checkPagePermission = (pathName: string, permissons: string | null) => {
            if (permissons) {
                for (const key in PAGE_PERMISSIONS) {
                    if (PAGE_PERMISSIONS.hasOwnProperty(key)) {
                        const pageKey = key as keyof IPagePermissions;
                        if (pathName.includes(PAGE_PERMISSIONS[pageKey].pathName)) {
                            const hasPermission = PAGE_PERMISSIONS[pageKey].permissions.find((element) =>
                                permissons.includes(element),
                            );
                            if (hasPermission) {
                                return true;
                            }
                        }
                    }
                }
                Swal.fire({
                    title: 'Không có quyền truy cập',
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                });
                return false;
            } else {
                clearUser();
                return false;
            }
        };

        useEffect(() => {
            if (token) {
                if (isTokenExpired(token)) {
                    clearUser();
                    router.push('/login');
                }
            } else {
                clearUser();
                router.push('/login');
            }

            if (pathname && permissions) {
                if (!checkPagePermission(pathname, permissions)) {
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [token, router, pathname, permissions]);

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuth;
