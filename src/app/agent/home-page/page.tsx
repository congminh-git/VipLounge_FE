'use client';

import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Input } from '@nextui-org/react';
import { ButtonVJ } from '@/components/buttonVJStyle';
import { FindSVG } from '../../../../public/assets/icons/find';
import { QrSVG } from '../../../../public/assets/icons/qr';
import { postCheck } from '@/services/check';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Swal from 'sweetalert2';
import Scanner from '@/components/qrScanner/qrScanner';
import withAuth from '@/hoc/withAuth';
import { postAddTransaction } from '@/services/history';
import { getAgencies } from '@/services/agency';
import { IAgency } from '@/types/Agency';
import Passenger from '@/components/scanResult/passenger';
import Journey from '@/components/scanResult/journey';

function HomePage() {
    const [startScanning, setStartScanning] = useState<boolean>(false);
    const [result, setResult] = useState('');
    const [pnr, setPnr] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [cityPair, setCityPair] = useState<string>('');
    const [flightNumber, setFlightNumber] = useState<string>('');
    const [airline, setAirline] = useState<string>('');
    const [flightDateNumber, setFlightDateNumber] = useState<string>('');
    const [searchByPnr, setSearchByPnr] = useState<boolean>(false);
    const [tab, setTab] = useState<0 | 1>(0);
    const [listAgencies, setListAgencies] = useState<IAgency[]>([]);
    const [selectedAgency, setSelectedAgency] = useState<string>();
    const [selectedAgencyValue, setSelectedAgencyValue] = useState<string>('');
    const [successStatus, setSuccessStatus] = useState<number | null>();
    const [passenger, setPassenger] = useState<any>();
    const [journey, setJourney] = useState<any>();
    const [segment, setSegment] = useState<any>();
    const [qrDeviceReults, setQrDeviceReults] = useState<string>('');
    const [agencyInvalid, setAgencyInvalid] = useState<boolean>(false);

    const services = useSelector((state: RootState) => state.auth.service);
    const permissions = useSelector((state: RootState) => state.auth.permissions);
    const username = useSelector((state: RootState) => state.auth.username);
    const agency = useSelector((state: RootState) => state.auth.agencyCode);

    function barcodeAutoFocus() {
        const activeElement = document.activeElement;
        if (!(activeElement && activeElement.tagName === 'INPUT')) {
            const element = document.getElementById('search-by-scanning-device') as HTMLInputElement | null;
            if (element) {
                element.focus();
                element.value = '';
            }
        }
    }

    function onChangeBarcode(event: any) {
        setQrDeviceReults(event.target.value);
    }

    function onKeyPressBarcode(event: any) {
        if (event.keyCode === 13) {
            setResult(event.target.value);
        }
    }

    const todayNumber = () => {
        const date = new Date();
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const diffInDays = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return diffInDays;
    };

    const fetchAgencies = async () => {
        const result = await getAgencies();
        setListAgencies(result);
    };

    const handleCheck = async (
        pnr: string,
        fullName: string,
        cityPair: string,
        airline: string,
        flightNumber: string,
        flightDateNumber: string,
    ) => {
        if (!agency && !selectedAgency) {
            setAgencyInvalid(true);
        }
        const body = {
            pnr,
            fullName: fullName.trim(),
            cityPair,
            airline,
            flightNumber,
            flightDateNumber,
            service: permissions?.includes('CHECK_ALL') ? (tab === 0 ? 'lounge' : 'connecting_flight') : services,
            user: username,
            agency: agency ? agency : selectedAgency,
        };
        const checkResult = await postCheck(body);
        if (checkResult.eligible === true) {
            setPassenger(checkResult.passenger);
            setJourney(checkResult.journey);
            setSegment(checkResult.segment);
            setSuccessStatus(checkResult.successStatus);
            if (checkResult.question) {
                Swal.fire({
                    title: 'Hành khách đủ điều kiện sử dụng dịch vụ',
                    text: 'Có muốn thêm mới lịch sử sử dụng dịch vụ',
                    icon: 'success',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    timer: 10000,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const newTransaction = {
                            pnr: checkResult.pnr,
                            passengerName: checkResult.passengerName,
                            departureTime: checkResult.departureTime,
                            flightCode: checkResult.flightCode,
                            user: checkResult.user,
                            agencyCode: checkResult.agencyCode,
                            airportCode: checkResult.airportCode,
                            service: checkResult.service,
                            serviceOption: checkResult.serviceOption,
                        };
                        const addResult = await postAddTransaction(newTransaction);
                        if (addResult.transactionKey) {
                            Swal.fire({
                                title: 'Đã thêm lịch sử sử dụng dịch vụ',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: 'Hành khách đủ điều kiện sử dụng dịch vụ',
                    text: 'Đã lưu lịch sử sử dụng dịch vụ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 5000,
                });
            }
        } else if (checkResult.eligible === false) {
            Swal.fire({
                title: 'Hành khách không đủ điều kiện sử dụng dịch vụ',
                icon: 'error',
                showConfirmButton: false,
                timer: 5000,
            });
            setResult('');
        } else {
            setResult('');
            console.log('Case');
        }
        setFullName('');
        setPnr('');
        setFlightNumber('');
        setCityPair('');
        setAirline('');
    };

    const toggleSearchByPnr = async (pnr: string, fullName: string) => {
        if (!agency && !selectedAgency) {
            Swal.fire({
                title: 'Chưa chọn đại lý',
                text: 'Vui lòng chọn đối tác muốn kiểm tra',
                icon: 'error',
            });
            return;
        }
        const body = {
            pnr: pnr.trim(),
            fullName: fullName.trim(),
            flightDateNumber: todayNumber().toString(),
            service: permissions?.includes('CHECK_ALL') ? (tab === 0 ? 'lounge' : 'connecting_flight') : services,
            user: username,
            agency: agency ? agency : selectedAgency,
        };
        const checkResult = await postCheck(body);
        if (checkResult.eligible === true) {
            setPassenger(checkResult.passenger);
            setJourney(checkResult.journey);
            setSegment(checkResult.segment);
            setSuccessStatus(checkResult.successStatus);
            if (checkResult.question) {
                Swal.fire({
                    title: 'Hành khách đủ điều kiện sử dụng dịch vụ',
                    text: 'Có muốn thêm mới lịch sử sử dụng dịch vụ',
                    icon: 'success',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    timer: 10000,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const newTransaction = {
                            pnr: checkResult.pnr,
                            passengerName: checkResult.passengerName,
                            departureTime: checkResult.departureTime,
                            flightCode: checkResult.flightCode,
                            user: checkResult.user,
                            agencyCode: checkResult.agencyCode,
                            airportCode: checkResult.airportCode,
                            service: checkResult.service,
                            serviceOption: checkResult.serviceOption,
                        };
                        const addResult = await postAddTransaction(newTransaction);
                        if (addResult.transactionKey) {
                            Swal.fire({
                                title: 'Đã thêm lịch sử sử dụng dịch vụ',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: 'Hành khách đủ điều kiện sử dụng dịch vụ',
                    text: 'Đã lưu lịch sử sử dụng dịch vụ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 5000,
                });
            }
        } else if (checkResult.eligible === false) {
            Swal.fire({
                title: 'Hành khách không đủ điều kiện sử dụng dịch vụ',
                icon: 'error',
                showConfirmButton: false,
                timer: 5000,
            });
            setResult('');
        } else {
            setResult('');
            console.log('Case');
        }
        setFullName('');
        setPnr('');
        setFlightNumber('');
        setCityPair('');
        setAirline('');
    };

    useEffect(() => {
        fetchAgencies();

        const handleClick = (event: any) => {
            const element = event.target;
            if (element instanceof HTMLElement && element.tagName !== 'INPUT') {
                barcodeAutoFocus();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        if (services === 'connecting_flight') {
            setTab(1);
        } else {
            setTab(0);
        }
    }, [services]);

    useEffect(() => {
        if (startScanning) {
            const scannerBox = document.getElementById('scanner-box');
            if (scannerBox) {
                scannerBox.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [startScanning]);

    useEffect(() => {
        if (qrDeviceReults && qrDeviceReults.length >= 48 && result.length === 0) {
            setResult(qrDeviceReults);
        }
        //  else if (result.length === 48) {
        //     const element = document.getElementById('search-by-scanning-device');
        //     if (element instanceof HTMLInputElement) {
        //         element.value = '';
        //     }
        // }
    }, [qrDeviceReults]);

    useEffect(() => {
        if (result.length > 0 && result !== '') {
            setFullName(result.substring(2, 22).replace('/', ' '));
            setPnr(result.substring(23, 29));
            setCityPair(result.substring(30, 36));
            setAirline(result.substring(37, 39));
            setFlightNumber(result.substring(41, 44));
            setFlightDateNumber(result.substring(45, 48));
        }
        setStartScanning(false);
    }, [result]);

    useEffect(() => {
        const regex = /\(([^)]+)\)/;
        if (selectedAgencyValue) {
            const match = selectedAgencyValue.match(regex);
            if (match) {
                setSelectedAgency(match[1]);
            }
        }
    }, [selectedAgencyValue]);

    useEffect(() => {
        if ((result && fullName) || (searchByPnr && pnr && fullName)) {
            handleCheck(pnr, fullName, cityPair, airline, flightNumber, flightDateNumber);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pnr, fullName, cityPair, airline, flightNumber, flightDateNumber, startScanning, searchByPnr, result]);

    return (
        <div className="sm:p-16 p-1 sm:pt-12 pt-10 h-full flex flex-col">
            {permissions?.includes('CHECK_ALL') ? (
                <div className="flex justify-between items-start">
                    <div className="flex justify-start items-center">
                        <button
                            onClick={() => setTab(0)}
                            className={`py-2 px-2 border text-sm rounded-t-md translate-y-[1px] border-b-white ${
                                tab === 0 ? 'bg-white' : 'bg-gray-200'
                            }`}
                        >
                            Phòng chờ
                        </button>
                        <button
                            onClick={() => setTab(1)}
                            className={`py-2 px-2 border text-sm rounded-t-md translate-y-[1px] border-b-white ${
                                tab === 1 ? 'bg-white' : 'bg-gray-200'
                            }`}
                        >
                            Dịch vụ nối chuyến
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className={`w-full grid gap-4 sm:grid-cols-5`}>
                <div
                    className={`sm:p-6 p-4 sm:col-span-2 border ${
                        permissions?.includes('CHECK_ALL')
                            ? 'rounded-lg rounded-tl-none flex-grow'
                            : 'rounded-lg h-full'
                    }`}
                >
                    <p className="mb-2">
                        {tab == 0
                            ? 'Kiểm tra quyền sử dụng phòng chờ của hành khách'
                            : 'Kiểm tra quyền sử dụng dịch vụ nối chuyến của hành khách'}
                    </p>
                    <Autocomplete
                        placeholder="Đối tác muốn kiểm tra"
                        isRequired
                        defaultItems={listAgencies.filter(
                            (element) =>
                                element.service ===
                                (permissions?.includes('CHECK_ALL')
                                    ? tab === 0
                                        ? 'lounge'
                                        : 'connecting_flight'
                                    : services),
                        )}
                        isInvalid={agencyInvalid}
                        errorMessage={'Chọn đối tác muốn kiểm tra'}
                        className="mb-2"
                        fullWidth={true}
                        onInputChange={setSelectedAgencyValue}
                    >
                        {(element: IAgency) => (
                            <AutocompleteItem
                                key={element.code}
                            >{`${element.name} (${element.code})`}</AutocompleteItem>
                        )}
                    </Autocomplete>
                    <h2 className="font-bold mb-2">Kiểm tra bằng PNR</h2>
                    <div className="">
                        <div>
                            <Input
                                size={'md'}
                                type="text"
                                placeholder="PNR"
                                fullWidth={true}
                                radius={'sm'}
                                value={pnr}
                                onValueChange={(value) => setPnr(value.toUpperCase())}
                            />
                        </div>
                        <div className="mt-2">
                            <Input
                                size={'md'}
                                type="text"
                                placeholder="Họ tên"
                                fullWidth={true}
                                radius={'sm'}
                                value={fullName}
                                onValueChange={(value) => setFullName(value.toUpperCase())}
                            />
                        </div>
                        <ButtonVJ
                            handleClick={() => toggleSearchByPnr(pnr, fullName)}
                            svgIcon={<FindSVG />}
                            message={'Kiểm tra bằng PNR'}
                            fullWidth={true}
                            className={'mt-2'}
                            size={'md'}
                        />
                    </div>
                    <div className="mt-8">
                        <h2 className="font-bold">Quét QR code / Barcode bằng camera</h2>
                        <div className="">
                            <ButtonVJ
                                handleClick={() => {
                                    setResult('');
                                    setPassenger(null);
                                    setJourney(null);
                                    setSegment(null);
                                    setStartScanning(!startScanning);
                                }}
                                svgIcon={<QrSVG />}
                                message={'Sử dụng camera thiết bị'}
                                fullWidth={true}
                                className={'mt-2'}
                                size={'md'}
                            />
                        </div>
                    </div>
                    <div>
                        <input
                            id="search-by-scanning-device"
                            type="text"
                            autoFocus={true}
                            // value={qrDeviceReults}
                            className="h-0"
                            onKeyDown={onKeyPressBarcode}
                            onChange={onChangeBarcode}
                        />
                    </div>
                </div>
                <div className="sm:col-span-3 h-full">
                    {startScanning ? (
                        <div className={`h-[300px] sm:h-full border rounded-md`} id="scanner-box">
                            <Scanner startScanning={startScanning} setScanResult={setResult} />
                        </div>
                    ) : (
                        <></>
                    )}
                    {passenger ? <Passenger passenger={passenger} successStatus={successStatus} /> : <></>}
                    {journey ? (
                        <Journey journey={journey} selectedSegment={segment} successStatus={successStatus} />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomePage);
