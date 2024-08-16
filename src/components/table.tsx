'use client';

import React, { useEffect, useState } from 'react';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Chip,
    Input,
    Pagination,
    DateRangePicker,
    RangeValue,
    DateValue,
    Autocomplete,
    AutocompleteItem,
    Skeleton,
} from '@nextui-org/react';
import { EditIcon } from '../../public/assets/icons/editIcon';
import { DeleteIcon } from '../../public/assets/icons/deleteIcon';
import { EyeIcon } from '../../public/assets/icons/eyeIcon';
import { SearchIcon } from '../../public/assets/icons/searchIcon';
import { PlusIcon } from '../../public/assets/icons/plusIcon';
import { ButtonVJ } from './buttonVJStyle';
import { LockIcon } from '../../public/assets/icons/lockIcon';
import { UnLockIcon } from '../../public/assets/icons/unlockIcon';
import { Service, serviceColor } from '@/types/publicTypes';
import { UserIcon } from '../../public/assets/icons/userIcon';
import ExportButton from './exportButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAgencies } from '@/services/agency';
import { getAirports } from '@/services/airport';
import { IAgency } from '@/types/Agency';
import { IAirport } from '@/types/Airport';

interface IFilterByColumn {
    name: string;
    column: string;
}

interface ICustomTable {
    data: any;
    columns: any;
    searchBy: string;
    filterByColumn?: IFilterByColumn;
    hasFilterByColumn?: boolean;
    dataOfFilter?: any[];
    hasSearch?: boolean;
    hasAddNew?: boolean;
    hasExport?: boolean;
    dateSearchData?: string;
    minDaterange?: CalendarDate;
    maxDaterange?: CalendarDate;
    dateRange?: RangeValue<DateValue>;
    setDateRange?: (dateRange: RangeValue<DateValue>) => void;
    actions?: string[];
    deleteFunc?: (id: string) => Promise<void>;
    activeFunc?: (id: string) => Promise<void>;
    openChangePassword?: (bool: boolean) => void;
    onOpenAddModal?: (bool: boolean) => void;
    onOpenUpdateModal?: (bool: boolean) => void;
    onOpenDetailModal?: (bool: boolean) => void;
    setSelectedId?: (id: string) => void;
}

interface DateRange {
    start: {
        calendar: {
            identifier: string;
        };
        era: string;
        year: number;
        month: number;
        day: number;
    };
    end: {
        calendar: {
            identifier: string;
        };
        era: string;
        year: number;
        month: number;
        day: number;
    };
}

function isDateInRange(dateString: string, range: DateRange | undefined): boolean {
    if (range) {
        const [, date] = dateString.split(' ');
        const [day, month, year] = date.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const startDate = new Date(range.start.year, range.start.month - 1, range.start.day);
        const endDate = new Date(range.end.year, range.end.month - 1, range.end.day);
        return inputDate >= startDate && inputDate <= endDate;
    }
    return true;
}

export default function CustomTable({
    data,
    columns,
    searchBy,
    hasAddNew = true,
    filterByColumn = { name: '', column: '' },
    hasFilterByColumn = true,
    dataOfFilter = [],
    hasSearch = true,
    hasExport = false,
    minDaterange,
    maxDaterange,
    dateSearchData = '',
    dateRange,
    setDateRange,
    actions = ['detail', 'edit', 'delete'],
    deleteFunc,
    activeFunc,
    onOpenAddModal,
    onOpenUpdateModal,
    onOpenDetailModal,
    setSelectedId,
    openChangePassword,
}: ICustomTable) {
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [columnFilter, setColumnFilter] = useState<string>('');
    const [agencies, setAgencies] = useState([]);
    const [airports, setAirports] = useState([]);
    const userPermissons = useSelector((state: RootState) => state.auth.permissions);

    const onRowsPerPageChange = React.useCallback((e: any) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const configServiceName: Record<Service, string> = {
        lounge: 'Phòng chờ',
        connecting_flight: 'Nối chuyến',
    };

    const fetchDataAgenciesForFormat = async () => {
        const result = await getAgencies();
        setAgencies(result);
    };

    const fetchDataAirportForFormat = async () => {
        const result = await getAirports();
        setAirports(result);
    };

    const renderCell = React.useCallback(
        (
            item: { [key: string]: any; service: Service },
            key: string,
            index: number,
            agencies: IAgency[],
            airports: IAirport[],
        ) => {
            const cellValue = item[key];
            const cellStyle = { whiteSpace: 'nowrap' };
            if (key === 'actions') {
                return (
                    <div key={`${key}-${index}`} className="relative flex justify-center items-center gap-2">
                        {actions.includes('detail') && onOpenDetailModal && setSelectedId && (
                            <Tooltip content="Details">
                                <button
                                    onClick={() => {
                                        setSelectedId(item.id.toString());
                                        onOpenDetailModal(true);
                                    }}
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                >
                                    <EyeIcon />
                                </button>
                            </Tooltip>
                        )}
                        {actions.includes('edit') && onOpenUpdateModal && setSelectedId && (
                            <Tooltip content="Edit">
                                <button
                                    onClick={() => {
                                        setSelectedId(item.id ? item.id.toString() : item.key);
                                        onOpenUpdateModal(true);
                                    }}
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                >
                                    <EditIcon />
                                </button>
                            </Tooltip>
                        )}
                        {actions.includes('delete') && deleteFunc && (
                            <Tooltip color="danger" content="Delete">
                                <button
                                    onClick={() => deleteFunc(item.id?.toString() || item.key?.toString())}
                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                >
                                    <DeleteIcon />
                                </button>
                            </Tooltip>
                        )}
                        {actions.includes('active') && activeFunc && item['status'] == 0 && (
                            <Tooltip color="primary" content="Unactive">
                                <button
                                    onClick={() => activeFunc(item.id?.toString() || item.key?.toString())}
                                    className="text-lg text-primary cursor-pointer active:opacity-50"
                                >
                                    <UnLockIcon className="size-5 text-primary" />
                                </button>
                            </Tooltip>
                        )}
                        {actions.includes('active') && activeFunc && item['status'] == 1 && (
                            <Tooltip color="primary" content="Active">
                                <button
                                    onClick={() => activeFunc(item.id?.toString() || item.key?.toString())}
                                    className="text-lg text-primary cursor-pointer active:opacity-50"
                                >
                                    <LockIcon className="size-5 text-primary" />
                                </button>
                            </Tooltip>
                        )}
                        {actions.includes('change_password') && openChangePassword && (
                            <Tooltip color="primary" content="Đổi mật khẩu">
                                <button
                                    onClick={() => openChangePassword(true)}
                                    className="text-lg text-primary cursor-pointer active:opacity-50"
                                >
                                    <UserIcon className="size-5 text-primary" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                );
            } else if (key === 'service' && item.service) {
                return (
                    <Chip
                        className="capitalize"
                        color={serviceColor[item.service]}
                        size="sm"
                        variant="flat"
                        style={cellStyle}
                    >
                        {configServiceName[cellValue as Service]}
                    </Chip>
                );
            } else if (key === 'stt') {
                return <span style={cellStyle}>{index + 1}</span>;
            } else if (key === 'pnr') {
                return (
                    <span style={cellStyle} className="text-sky-400">
                        {cellValue}
                    </span>
                );
            } else if (key === 'agencyCode') {
                const agency: any = agencies.find((agency) => agency.code === cellValue);
                return <span style={cellStyle}>{agency?.name}</span>;
            } else if (key === 'airportCode' && airports.length > 0) {
                const airport: any = airports.find((airport) => airport.code === cellValue);
                return <span style={cellStyle}>{airport?.name}</span>;
            } else {
                return <span style={cellStyle}>{cellValue}</span>;
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [],
    );

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: 'bg-foreground text-background',
                    }}
                    color="default"
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small border ml-2"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </label>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pages]);

    useEffect(() => {
        fetchDataAgenciesForFormat();
        fetchDataAirportForFormat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const pages = Math.ceil(data?.filter((item: any) => item[searchBy].includes(searchValue)).length / rowsPerPage);
        setPages(pages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, rowsPerPage, searchValue]);

    return (
        <div>
            <div className="flex justify-end items-center mb-2">
                {hasExport ? (
                    <ExportButton
                        data={data.filter((element: any) =>
                            (element[filterByColumn.column] ? element[filterByColumn.column] : '').includes(
                                columnFilter,
                            ),
                        )}
                        permissions={userPermissons}
                    />
                ) : (
                    <></>
                )}
            </div>
            <div className="sm:flex justify-between items-center mb-2">
                {hasSearch ? (
                    <Input
                        isClearable
                        classNames={{
                            base: `w-full sm:max-w-[40%] mb-2 sm:mb-0`,
                            inputWrapper: 'border-1',
                        }}
                        placeholder={`Search by ${searchBy}...`}
                        size="md"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={searchValue}
                        variant="bordered"
                        onClear={() => setSearchValue('')}
                        onValueChange={setSearchValue}
                    />
                ) : (
                    <div></div>
                )}
                <div
                    className={`flex ${
                        hasAddNew && !hasFilterByColumn && !setDateRange ? 'justify-end' : 'justify-center'
                    } items-center`}
                >
                    {hasFilterByColumn ? (
                        <Autocomplete
                            // label={`Lọc bằng ${filterByColumn.name}`}
                            placeholder={`Lọc bằng ${filterByColumn.name}`}
                            size="md"
                            defaultItems={dataOfFilter}
                            className="w-full sm:ml-4"
                            onInputChange={setColumnFilter}
                        >
                            {(element: any) => <AutocompleteItem key={element.code}>{element.code}</AutocompleteItem>}
                        </Autocomplete>
                    ) : (
                        <></>
                    )}
                    {setDateRange && minDaterange && maxDaterange ? (
                        <DateRangePicker
                            className={`max-w-xs p-0 ml-4`}
                            calendarProps={{
                                classNames: {
                                    base: 'bg-background',
                                    headerWrapper: 'pt-4 bg-background',
                                    prevButton: 'border-1 border-default-200 rounded-small',
                                    nextButton: 'border-1 border-default-200 rounded-small',
                                    gridHeader: 'bg-background shadow-none border-b-1 border-default-100',
                                    cellButton: [
                                        'data-[today=true]:bg-yellow-200 data-[selected=true]:bg-transparent rounded-small',
                                        'data-[range-start=true]:before:rounded-l-small',
                                        'data-[selection-start=true]:before:rounded-l-small',
                                        'data-[range-end=true]:before:rounded-r-small',
                                        'data-[selection-end=true]:before:rounded-r-small',
                                        'data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small',
                                        'data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small',
                                    ],
                                },
                            }}
                            maxValue={maxDaterange}
                            minValue={minDaterange}
                            defaultValue={{
                                start: minDaterange,
                                end: maxDaterange,
                            }}
                            onChange={setDateRange}
                        />
                    ) : (
                        <></>
                    )}
                    {hasAddNew && onOpenAddModal ? (
                        <ButtonVJ
                            className={`bg-foreground text-background flex ml-4`}
                            svgIcon={<PlusIcon />}
                            size="md"
                            message="Thêm mới"
                            fullWidth={false}
                            handleClick={() => onOpenAddModal(true)}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="">
                <Table isStriped aria-label="Custom table" bottomContent={bottomContent}>
                    <TableHeader columns={columns}>
                        {(column: any) => {
                            return (
                                <TableColumn key={column.uid} align={column.uid == 'actions' ? 'center' : 'start'}>
                                    {column.name}
                                </TableColumn>
                            );
                        }}
                    </TableHeader>
                    <TableBody>
                        {data?.map((item: any, index: number) => {
                            if (
                                item[searchBy]?.includes(searchValue) &&
                                isDateInRange(item[dateSearchData], dateRange) &&
                                (filterByColumn.column
                                    ? (item[filterByColumn.column] ? item[filterByColumn.column] : '').includes(
                                          columnFilter,
                                      )
                                    : true) &&
                                index >= (page - 1) * rowsPerPage &&
                                index < page * rowsPerPage
                            ) {
                                return (
                                    <TableRow key={item.id}>
                                        {(columnKey) => (
                                            <TableCell>
                                                {renderCell(item, columnKey.toString(), index, agencies, airports)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
