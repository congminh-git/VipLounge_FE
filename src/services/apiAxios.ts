import axios from 'axios';
import Swal from 'sweetalert2';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleError = (error: any) => {
    console.error('Failed to fetch data:', error);
    Swal.fire({
        title: error?.response?.data.message || 'Something went wrong',
        icon: 'error',
        timer: 1500,
    });
};

// Hàm GET chung
export const getRequest = async (url: string, params = {}) => {
    try {
        const response = await apiService.get(url, { params });
        if (response.data.data) {
            return response.data.data;
        } else {
            return response.data;
        }
    } catch (error: any) {
        handleError(error);
        return error;
    }
};

// Hàm POST chung
export const postRequest = async (url: string, body = {}, params = {}) => {
    try {
        const response = await apiService.post(url, body, { params });
        if (response.data.data) {
            return response.data.data;
        } else {
            return response.data;
        }
    } catch (error: any) {
        handleError(error);
        console.log(error);
        return error;
    }
};

// Hàm PUT chung
export const putRequest = async (url: string, body = {}, params = {}) => {
    try {
        const response = await apiService.put(url, body, { params });
        if (response.data.data) {
            return response.data.data;
        } else {
            return response.data;
        }
    } catch (error: any) {
        handleError(error);
        return error;
    }
};

// Hàm DELETE chung
export const deleteRequest = async (url: string, params = {}) => {
    try {
        const response = await apiService.delete(url, { params });
        if (response.data.data) {
            return response.data.data;
        } else {
            return response.data;
        }
    } catch (error: any) {
        handleError(error);
        return error;
    }
};
