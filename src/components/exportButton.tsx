'use client';

import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ButtonVJ } from './buttonVJStyle';
import { ExportIcon } from '../../public/assets/icons/exportIcon';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { getAgencies, getServiceOptions } from '@/services/agency';

export default function ExportButton({ data, permissions }: any) {
    const [historyViewPermission, setHistoryViewPermission] = useState();
    const [agency, setAgency] = useState<string>();
    const [serviceOption, setServiceOption] = useState<string>();
    const [listAgencies, setListAgencies] = useState([]);
    const [listServiceOptions, setListServiceOptions] = useState([]);
    const agencyName = useSelector((state: RootState) => state.auth.agencyName);
    const agencyCode = useSelector((state: RootState) => state.auth.agencyCode);

    const handleExport = async () => {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const response = await fetch('/assets/excels/ReportTemplate.xlsx');
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        const startRow = 11;
        const startCol = 2;

        worksheet.eachRow({ includeEmpty: false }, (row) => {
            row.eachCell({ includeEmpty: false }, (cell) => {
                if (typeof cell.value === 'string') {
                    cell.value = cell.value.replace('{day}', day.toString());
                    cell.value = cell.value.replace('{month}', month.toString());
                    cell.value = cell.value.replace('{year}', year.toString());
                    cell.value = cell.value.replace('{agencyName}', agencyName ? agencyName.toString() : '');
                }
            });
        });

        let filterData = [];
        if (agency && serviceOption) {
            filterData = data.filter(
                (item: any) =>
                    item.agencyCode.includes(agency ? agency : '') &&
                    item.serviceOption.includes(serviceOption ? serviceOption : ''),
            );
        } else if (agency && !serviceOption) {
            filterData = data.filter((item: any) => item.agencyCode.includes(agency ? agency : ''));
        } else if (!agency && !serviceOption) {
            filterData = data;
        }

        worksheet.spliceRows(startRow, 1, ...Array(filterData.length).fill([]));

        filterData.forEach((item: any, index: number) => {
            const rowIndex = startRow + index;
            worksheet.getCell(rowIndex, startCol).value = index + 1;
            worksheet.getCell(rowIndex, startCol + 1).value = item.passengerName;
            worksheet.getCell(rowIndex, startCol + 2).value = item.flightCode;
            worksheet.getCell(rowIndex, startCol + 3).value = item.transactionKey;
            worksheet.getCell(rowIndex, startCol + 4).value = 1;
            worksheet.getCell(rowIndex, startCol + 5).value = '';
            worksheet.getCell(rowIndex, startCol + 6).value = '';
            worksheet.getCell(rowIndex, startCol + 7).value = '';

            for (let col = startCol; col <= startCol + 7; col++) {
                const cell = worksheet.getCell(rowIndex, col);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                };
            }
        });

        if (!worksheet.getCell(13 + filterData.length, 2).isMerged) {
            worksheet.mergeCells(13 + filterData.length, 2, 13 + filterData.length, 5);
            worksheet.mergeCells(13 + filterData.length, 6, 13 + filterData.length, 9);
            worksheet.mergeCells(14 + filterData.length, 2, 14 + filterData.length, 5);
            worksheet.mergeCells(14 + filterData.length, 6, 14 + filterData.length, 9);
            worksheet.mergeCells(15 + filterData.length, 2, 18 + filterData.length, 5);
            worksheet.mergeCells(15 + filterData.length, 6, 18 + filterData.length, 9);
            const mergeCells1 = worksheet.getCell(13 + filterData.length, 2);
            const mergeCells2 = worksheet.getCell(13 + filterData.length, 6);
            const mergeCells3 = worksheet.getCell(14 + filterData.length, 2);
            const mergeCells4 = worksheet.getCell(14 + filterData.length, 6);

            //Report footer
            mergeCells1.value = 'ĐẠI DIỆN PHÒNG KHÁCH';
            mergeCells1.alignment = { horizontal: 'center', vertical: 'middle' };
            mergeCells1.font = { bold: true };

            mergeCells2.value = 'ĐẠI DIỆN VIETJET AIR';
            mergeCells2.alignment = { horizontal: 'center', vertical: 'middle' };
            mergeCells2.font = { bold: true };

            mergeCells3.value = '(Ký và ghi rõ họ tên)';
            mergeCells3.alignment = { horizontal: 'center', vertical: 'middle' };

            mergeCells4.value = '(Ký và ghi rõ họ tên)';
            mergeCells4.alignment = { horizontal: 'center', vertical: 'middle' };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Report_${year}-${month}-${day}.xlsx`);
    };

    const fetchAgenciesData = async () => {
        const result = await getAgencies();
        setListAgencies(result);
    };

    const fetchServiceOptions = async (agency: string) => {
        const result = await getServiceOptions(agency);
        setListServiceOptions(result);
    };

    useEffect(() => {
        if (permissions) {
            const historyView = (typeof permissions === 'string' ? JSON.parse(permissions) : permissions).find(
                (element: string) => element.includes('HISTORY_VIEW'),
            );
            setHistoryViewPermission(historyView);
        }
        fetchAgenciesData();
    }, [permissions]);

    useEffect(() => {
        if (agency) {
            fetchServiceOptions(agency);
        }
    }, [agency]);

    useEffect(() => {
        if (agencyCode) {
            if (permissions.includes('HISTORY_VIEW_AGENCY_OWNED')) {
                setAgency(agencyCode);
            }
        }
    }, [agencyCode]);

    return (
        <div className="flex items-center">
            {historyViewPermission === 'HISTORY_VIEW_ALL' ? (
                <>
                    <Autocomplete
                        placeholder={`Đại lý`}
                        size="md"
                        defaultItems={listAgencies}
                        className="mr-4"
                        onInputChange={setAgency}
                    >
                        {(element: any) => <AutocompleteItem key={element.code}>{element.code}</AutocompleteItem>}
                    </Autocomplete>
                    <Autocomplete
                        placeholder={`Dịch vụ`}
                        size="md"
                        defaultItems={listServiceOptions}
                        className="mr-4"
                        onInputChange={setServiceOption}
                    >
                        {(element: any) => <AutocompleteItem key={element.code}>{element.code}</AutocompleteItem>}
                    </Autocomplete>
                </>
            ) : historyViewPermission === 'HISTORY_VIEW_AGENCY_OWNED' ? (
                <>
                    <Autocomplete
                        placeholder={`Dịch vụ`}
                        size="md"
                        defaultItems={listServiceOptions}
                        className="mr-4"
                        onInputChange={setServiceOption}
                    >
                        {(element: any) => <AutocompleteItem key={element.code}>{element.code}</AutocompleteItem>}
                    </Autocomplete>
                </>
            ) : (
                <></>
            )}
            <ButtonVJ
                className={`bg-foreground text-background flex`}
                size="md"
                svgIcon={<ExportIcon />}
                message="Xuất báo cáo"
                handleClick={() => handleExport()}
            />
        </div>
    );
}
