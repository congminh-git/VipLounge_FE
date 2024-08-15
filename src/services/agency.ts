import { deleteRequest, getRequest, postRequest, putRequest } from './apiAxios';

export const getAgencies = async () => {
    const url = `/agency`;
    return getRequest(url);
};

export const getAgencyByKey = async (key: string) => {
    const url = `/agency/${key}`;
    return getRequest(url);
};

export const deleteAgencyByKey = async (key: string) => {
    const url = `/agency/${key}`;
    return deleteRequest(url);
};

export const addAgency = async (data: any) => {
    const url = `/agency`;
    return postRequest(url, data);
};

export const updateAgencyByKey = async (key: string, data: any) => {
    const url = `/agency/update/${key}`;
    return putRequest(url, data);
};

export const activeAgencyByKey = async (key: string) => {
    const url = `/agency/active/${key}`;
    return putRequest(url);
};
