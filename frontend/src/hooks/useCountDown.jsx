import { useEffect, useState } from 'react';

export const useCountDown = (time) => {
    const targetDate = new Date(time).getTime();
    const [countDown, setCountDown] = useState(
        targetDate - Date.now()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(targetDate - Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return Math.ceil(countDown / 1000);
}