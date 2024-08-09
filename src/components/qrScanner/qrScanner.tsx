import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import QrScanner from 'react-qr-scanner';

type ScannerProps = {
    startScanning: boolean;
    setScanResult: (result: string) => void;
};

const Scanner: React.FC<ScannerProps> = ({ startScanning, setScanResult }) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const handleScan = (data: any) => {
        if (data) {
            setScanResult(data.text);
        }
    };

    const handleError = (err: any) => {
        Swal.fire({
            title: 'Something went wrong',
            text: 'Your QR code was invalid',
            icon: 'error',
        });
    };

    const previewStyle = {
        height: containerHeight,
        width: containerWidth,
    };

    useEffect(() => {
        const container = document.getElementById('qr-scanner-container');
        const width = container?.clientWidth;
        const height = container?.clientHeight;
        setContainerWidth(width ? width : 0);
        setContainerHeight(height ? height : 0);
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center" id="qr-scanner-container">
            {startScanning ? (
                <QrScanner delay={300} style={previewStyle} onError={handleError} onScan={handleScan} />
            ) : (
                <div className="font-bold text-2xl w-full h-full bg-gray-200 flex justify-center items-center">
                    Scan
                </div>
            )}
        </div>
    );
};

export default Scanner;
