import List from '@/components/IAP/Ics203/List'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <List />
        </Suspense>
    )
}
