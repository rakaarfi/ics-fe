'use client'

import React, { useEffect, useState } from 'react'
import ChartPreview from './ChartPreview'

export default function ChartPreviewPage() {
    const [chartData, setChartData] = useState({});

    // Terima data dari parent menggunakan postMessage
    useEffect(() => {
        const handleMessage = (event) => {
            console.log('Message event:', event);
            console.log('Received data:', event.data);
            console.log('Event origin:', event.origin);
    
            if (event.data) {
                setChartData(event.data);
            }
        };
    
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    
    return (
        <div style={{ width: '100%', height: '100%', padding: '10px' }}>
            <ChartPreview chartData={chartData} />
        </div>
    )
}
