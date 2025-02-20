'use client'

import ListTemplate from '@/components/ImtMembers/ListTemplate';
import { Suspense } from 'react';

export default function page() {

    const routeUrl = "main-section/operation-section-chief";
    const responseKey = "read-paginated";

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ListTemplate
                routeUrl={routeUrl}
                responseKey={responseKey}
                headerText="Operation Section Chief"
            />
        </Suspense>
    )
}
