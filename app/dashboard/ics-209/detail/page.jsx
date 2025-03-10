import List from '@/components/Ics209/List'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <List />
        </Suspense>
    )
}

