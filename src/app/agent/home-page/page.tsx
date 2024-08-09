'use client';

import { useEffect, useState } from 'react';
import { Input } from '@nextui-org/react';
import { ButtonVJ } from '@/components/buttonVJStyle';
import { FindSVG } from '../../../../public/assets/icons/find';
import { QrSVG } from '../../../../public/assets/icons/qr';
import { postAddTransaction, postCheck } from '@/services/check';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Swal from 'sweetalert2';
import Scanner from '@/components/qrScanner/qrScanner';
import withAuth from '@/hoc/withAuth';

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

    const services = useSelector((state: RootState) => state.auth.service);
    const username = useSelector((state: RootState) => state.auth.username);

    const handleCheck = async (
        pnr: string,
        fullName: string,
        cityPair: string,
        airline: string,
        flightNumber: string,
        flightDateNumber: string,
    ) => {
        const body = {
            pnr,
            fullName,
            cityPair,
            airline,
            flightNumber,
            flightDateNumber,
            service:
                services !== 'lounge' && services !== 'connecting_flight'
                    ? tab === 0
                        ? 'lounge'
                        : 'connecting_flight'
                    : services,
            user: username,
        };
        const checkResult = await postCheck(body);
        if (checkResult.eligible === true) {
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
        }
        setResult('');
        setFullName('');
        setPnr('');
        setFlightNumber('');
        setCityPair('');
        setAirline('');
        setSearchByPnr(false);
    };

    const toggleSearchByPnr = () => {
        setSearchByPnr(true);
    };

    useEffect(() => {
        if (services === 'connecting_flight') {
            setTab(1);
        } else {
            setTab(0);
        }
    }, [services]);

    useEffect(() => {
        if (result.length > 0 && result !== '') {
            setStartScanning(false);
            setFullName(result.substring(2, 22).replace('/', ' '));
            setPnr(result.substring(23, 30));
            setCityPair(result.substring(30, 36));
            setAirline(result.substring(37, 39));
            setFlightNumber(result.substring(41, 44));
            setFlightDateNumber(result.substring(45, 48));
        }
    }, [result]);

    useEffect(() => {
        if ((result && fullName) || (searchByPnr && pnr && fullName)) {
            handleCheck(pnr, fullName, cityPair, airline, flightNumber, flightDateNumber);
        }
    }, [pnr, fullName, cityPair, airline, flightNumber, flightDateNumber, startScanning, searchByPnr, result]);

    return (
        <div className="p-16 pt-12 h-full flex flex-col">
            {services !== 'lounge' && services !== 'connecting_flight' ? (
                <div className="flex justify-start items-center">
                    <button
                        onClick={() => setTab(0)}
                        className={`py-2 px-4 border rounded-t-md translate-y-[1px] border-b-white ${
                            tab === 0 ? 'bg-white' : 'bg-gray-200'
                        }`}
                    >
                        Phòng chờ
                    </button>
                    <button
                        onClick={() => setTab(1)}
                        className={`py-2 px-4 border rounded-t-md translate-y-[1px] border-b-white ${
                            tab === 1 ? 'bg-white' : 'bg-gray-200'
                        }`}
                    >
                        Dịch vụ nối chuyến
                    </button>
                </div>
            ) : (
                <></>
            )}
            <div
                className={`border w-full grid grid-cols-5 shadow ${
                    services !== 'lounge' && services !== 'connecting_flight'
                        ? 'rounded-lg rounded-tl-none flex-grow'
                        : 'rounded-lg h-full'
                }`}
            >
                <div className="p-6 col-span-2">
                    <p className="mb-2">
                        {tab == 0
                            ? 'Kiểm tra quyền sử dụng phòng chờ của hành khách'
                            : 'Kiểm tra quyền sử dụng dịch vụ nối chuyến của hành khách'}
                    </p>
                    <h2 className="font-bold mb-2">Kiểm tra bằng PNR</h2>
                    <div className="">
                        <div>
                            <Input
                                size={'md'}
                                type="text"
                                placeholder="PNR"
                                fullWidth={true}
                                radius={'sm'}
                                onValueChange={setPnr}
                            />
                        </div>
                        <div className="mt-2">
                            <Input
                                size={'md'}
                                type="text"
                                placeholder="Họ tên"
                                fullWidth={true}
                                radius={'sm'}
                                onValueChange={setFullName}
                            />
                        </div>
                        <ButtonVJ
                            handleClick={toggleSearchByPnr}
                            svgIcon={<FindSVG />}
                            message={'Kiểm tra bằng PNR'}
                            fullWidth={true}
                            className={'mt-2'}
                            size={'md'}
                        />
                    </div>
                    <div className="mt-8">
                        <h2 className="font-bold">Kiểm tra bằng QR code / Barcode</h2>
                        <div className="">
                            <ButtonVJ
                                handleClick={() => {
                                    setStartScanning(!startScanning);
                                }}
                                svgIcon={<QrSVG />}
                                message={'Quét QR code / Barcode'}
                                fullWidth={true}
                                className={'mt-2'}
                                size={'md'}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-2 col-span-3 h-full">
                    <div className="h-full border rounded-md">
                        <Scanner startScanning={startScanning} setScanResult={setResult} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomePage);
