export interface IPagePermissions {
    homePage: IPagePermissionsElement;
    adminServiceHistory: IPagePermissionsElement;
    adminUsers: IPagePermissionsElement;
    adminAgencies: IPagePermissionsElement;
}

export interface IPagePermissionsElement {
    pathName: string;
    permissions: string[];
}

export const PAGE_PERMISSIONS: IPagePermissions = {
    homePage: {
        pathName: '/agent/home-page',
        permissions: ['CHECK_ALL', 'CHECK_AGENCY_OWNED'],
    },
    adminServiceHistory: {
        pathName: '/admin/service-history',
        permissions: ['HISTORY_VIEW_ALL', 'HISTORY_VIEW_AGENCY_OWNED', 'REPORT_CREATE'],
    },
    adminUsers: {
        pathName: '/admin/users',
        permissions: ['USER_CRUD'],
    },
    adminAgencies: {
        pathName: '/admin/agencies',
        permissions: ['AGENCY_CRUD'],
    },
};
