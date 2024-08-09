import { CalendarDate } from '@internationalized/date';
import { getRequest, postRequest } from './apiAxios';

interface IPostCheck {
    pnr: string;
    fullName: string;
    cityPair: string;
    airline: string;
    flightNumber: string;
    flightDateNumber: string;
    service: string;
    user: string | null | undefined;
}

interface INewTransaction {
    pnr: string;
    passengerName: string;
    departureTime: string;
    flightCode: string;
    user: string;
    airportCode: string;
    service: string;
}

export const getAllServiceHistory = async (
    minDateRange: CalendarDate,
    maxDateRange: CalendarDate,
    viewPermission: string,
    agencyCode: string | null,
    serviceOptions: string | null,
) => {
    let url = '';
    if (viewPermission === 'HISTORY_VIEW_ALL') {
        url = `/check?minDate=${minDateRange}&maxDate=${maxDateRange}`;
    } else if (viewPermission === 'HISTORY_VIEW_AGENCY_OWNED') {
        url = `/check?minDate=${minDateRange}&maxDate=${maxDateRange}&agencyCode=${agencyCode}`;
    } else {
        url = `/check?minDate=${minDateRange}&maxDate=${maxDateRange}&agencyCode=${agencyCode}&serviceOptions=${serviceOptions}`;
    }
    return getRequest(url);
};

export const postCheck = async (data: IPostCheck) => {
    const url = `/check`;
    const body = data;
    return postRequest(url, body);
};

export const postAddTransaction = async (data: INewTransaction) => {
    const url = `/check/addTransaction`;
    const body = data;
    return postRequest(url, body);
};
