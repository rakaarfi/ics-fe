import Detail from '@/components/IAP/Ics202/Detail'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Detail />
        </Suspense>
    )
}
