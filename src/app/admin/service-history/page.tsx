'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { getAgencies } from '@/services/agency';
import { getAllServiceHistory } from '@/services/history';
import { CalendarDate, DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { RangeValue } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface IHistory {
    transactionKey: string;
    pnr: string;
    passengerName: string;
    departureTime: string;
    flightCode: string;
    user: string;
    agencyCode: string;
    airportCode: string;
    checkTime: string;
}

function History() {
    const [historyData, setHistoryData] = useState<IHistory[]>([]);
    const [formatedData, setFormatedData] = useState<IHistory[]>([]);
    const [minSearchDate, setMinSearchDate] = useState<CalendarDate>(today(getLocalTimeZone()).subtract({ days: 29 }));
    const [maxSearchDate, setMaxSearchDate] = useState<CalendarDate>(today(getLocalTimeZone()));
    const [dateRange, setDataRange] = useState<RangeValue<DateValue>>();
    const [listAgencies, setListAgencies] = useState([]);

    const minDate = today(getLocalTimeZone()).subtract({ days: 29 });
    const maxDate = today(getLocalTimeZone());
    const userPermissions = useSelector((state: RootState) => state.auth.permissions);
    const userAgency = useSelector((state: RootState) => state.auth.agencyCode);
    const userServiceOption = useSelector((state: RootState) => state.auth.serviceOption);

    const columns = [
        { name: 'STT', uid: 'stt' },
        { name: 'KEY', uid: 'transactionKey' },
        { name: 'NAME', uid: 'passengerName' },
        { name: 'SERVICE', uid: 'service' },
        { name: 'PNR', uid: 'pnr' },
        { name: 'FLIGHT', uid: 'flightCode' },
        { name: 'AIRPORT', uid: 'airportCode' },
        { name: 'DEPARTURE TIME', uid: 'departureTime' },
        { name: 'CHECK TIME', uid: 'checkTime' },
        { name: 'USER CREATE', uid: 'user' },
    ];

    const fetchHistorysData = async () => {
        if (userPermissions) {
            const viewPermission = (
                typeof userPermissions === 'string' ? JSON.parse(userPermissions) : userPermissions
            ).find((element: string) => element.includes('HISTORY_VIEW'));
            const result = await getAllServiceHistory(
                minSearchDate,
                maxSearchDate,
                viewPermission,
                userAgency,
                userServiceOption,
            );
            setHistoryData(result);
        }
    };

    const fetchAgencies = async () => {
        const result = await getAgencies();
        setListAgencies(result);
    };

    const formatDateTime = (dateTime: string): string => {
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(1, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    useEffect(() => {
        if (historyData) {
            let newList: IHistory[] = [];
            const sortedList = historyData.sort((a, b) => {
                const dateA = new Date(a.checkTime);
                const dateB = new Date(b.checkTime);
                return dateB.getTime() - dateA.getTime();
            });
            sortedList.forEach((element: any) => {
                let formatElement = element;
                formatElement.departureTime = formatDateTime(formatElement.departureTime);
                formatElement.checkTime = formatDateTime(formatElement.checkTime);
                newList.push(formatElement);
            });
            setFormatedData(sortedList);
        }
    }, [historyData]);

    useEffect(() => {
        if (dateRange) {
            const startDate = new CalendarDate(dateRange.start.year, dateRange.start.month, dateRange.start.day);
            const endDate = new CalendarDate(dateRange.end.year, dateRange.end.month, dateRange.end.day);
            setMinSearchDate(startDate);
            setMaxSearchDate(endDate);
        }
    }, [dateRange]);

    useEffect(() => {
        if (minSearchDate && maxSearchDate) {
            fetchHistorysData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minSearchDate, maxSearchDate]);

    return (
        <div className="p-1 pt-10 sm:p-16 sm:pt-12">
            <CustomTable
                data={formatedData}
                columns={columns}
                searchBy={'pnr'}
                hasAddNew={true}
                hasFilterByColumn={true}
                hasExport={true}
                dateSearchData={'checkTime'}
                dataOfFilter={listAgencies}
                filterByColumn={{ column: 'agencyCode', name: 'Đối tác' }}
                dateRange={dateRange}
                setDateRange={setDataRange}
                minDaterange={minDate}
                maxDaterange={maxDate}
            />
        </div>
    );
}

export default withAuth(History);
