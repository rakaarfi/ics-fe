import List from '@/components/OperationalPeriod/List'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <List />
        </Suspense>
    )
}
