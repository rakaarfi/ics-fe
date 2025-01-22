import Chart from '@/components/ImtRoster/Chart'
import ChartNameOnly from '@/components/ImtRoster/ChartNameOnly'
import React from 'react'

export default function page() {
    return (
        <div className="lg:ml-[11rem] ml-[9rem] lg:my-0 my-24">
            <ChartNameOnly />
            {/* <Chart /> */}
        </div>
    )
}
