import React, { useEffect, useState } from 'react';

const CountdownTime = ({ initialTime }: { initialTime: number }) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds}`;
    };

    return <p>{formatTime(timeRemaining)}</p>;
};

export default CountdownTime;
