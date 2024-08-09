import { deleteRequest, getRequest, postRequest, putRequest } from './apiAxios';

export const getConnectingServices = async () => {
    const url = `/cf-rom`;
    return getRequest(url);
};

export const getConnectingServiceById = async (id: string) => {
    const url = `/cf-rom/${id}`;
    return getRequest(url);
};

export const deleteConnectingServiceById = async (id: string) => {
    const url = `/cf-rom/${id}`;
    return deleteRequest(url);
};

export const addConnectingService = async (data: any) => {
    const url = `/cf-rom`;
    return postRequest(url, data);
};

export const updateConnectingServiceById = async (id: string, data: any) => {
    const url = `/cf-rom/update/${id}`;
    return putRequest(url, data);
};
