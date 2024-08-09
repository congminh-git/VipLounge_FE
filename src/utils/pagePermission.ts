export interface IPagePermissions {
    homePage: IPagePermissionsElement;
    adminServiceHistory: IPagePermissionsElement;
    adminUsers: IPagePermissionsElement;
    adminAgencies: IPagePermissionsElement;
    adminLounges: IPagePermissionsElement;
    adminConnectingServices: IPagePermissionsElement;
}

export interface IPagePermissionsElement {
    pathName: string;
    permissions: string[];
}

export const PAGE_PERMISSIONS: IPagePermissions = {
    homePage: {
        pathName: '/agent/home-page',
        permissions: ['CHECK_ALL', 'CHECK_AGENCY_OWNED', 'CHECK_USER_OWNED'],
    },
    adminServiceHistory: {
        pathName: '/admin/service-history',
        permissions: ['HISTORY_VIEW_ALL', 'HISTORY_VIEW_AGENCY_OWNED', 'HISTORY_VIEW_USER_OWNED', 'REPORT_CREATE'],
    },
    adminUsers: {
        pathName: '/admin/users',
        permissions: ['USER_CRUD'],
    },
    adminAgencies: {
        pathName: '/admin/agencies',
        permissions: ['AGENCY_CRUD'],
    },
    adminLounges: {
        pathName: '/admin/lounges',
        permissions: ['LOUNGE_CRUD'],
    },
    adminConnectingServices: {
        pathName: '/admin/connecting-services',
        permissions: ['CONNECTING_CURD'],
    },
};
