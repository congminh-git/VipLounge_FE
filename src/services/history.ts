import { CalendarDate } from '@internationalized/date';
import { getRequest, postRequest } from './apiAxios';

export const getAllServiceHistory = async (
    minDateRange: CalendarDate,
    maxDateRange: CalendarDate,
    viewPermission: string,
    agencyCode: string | null,
    serviceOptions: string | null,
) => {
    let url = '';
    if (viewPermission === 'HISTORY_VIEW_ALL') {
        url = `/history?minDate=${minDateRange}&maxDate=${maxDateRange}`;
    } else if (viewPermission === 'HISTORY_VIEW_AGENCY_OWNED') {
        url = `/history?minDate=${minDateRange}&maxDate=${maxDateRange}&agencyCode=${agencyCode}`;
    } else {
        url = `/history?minDate=${minDateRange}&maxDate=${maxDateRange}&agencyCode=${agencyCode}&serviceOptions=${serviceOptions}`;
    }
    return getRequest(url);
};

export const postAddTransaction = async (data: INewTransaction) => {
    const url = `/history/addTransaction`;
    const body = data;
    return postRequest(url, body);
};
interface INewTransaction {
    pnr: string;
    passengerName: string;
    departureTime: string;
    flightCode: string;
    user: string;
    airportCode: string;
    service: string;
}
