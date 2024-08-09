import { deleteRequest, getRequest, postRequest, putRequest } from './apiAxios';

export const getAgencies = async () => {
    const url = `/agency`;
    return getRequest(url);
};

export const getServiceOptions = async (agency: string) => {
    const url = `/agency/serviceOptions?agency=${agency}`;
    return getRequest(url);
};

export const getAgencyById = async (id: string) => {
    const url = `/agency/${id}`;
    return getRequest(url);
};

export const deleteAgencyById = async (id: string) => {
    const url = `/agency/${id}`;
    return deleteRequest(url);
};

export const addAgency = async (data: any) => {
    const url = `/agency`;
    return postRequest(url, data);
};

export const updateAgencyById = async (id: string, data: any) => {
    const url = `/agency/update/${id}`;
    return putRequest(url, data);
};

export const activeAgencyById = async (id: string) => {
    const url = `/agency/active/${id}`;
    return putRequest(url);
};
