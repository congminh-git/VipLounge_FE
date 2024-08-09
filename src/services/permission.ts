import { getRequest } from './apiAxios';

export const getPermissions = async () => {
    const url = `/permission`;
    return getRequest(url);
};
