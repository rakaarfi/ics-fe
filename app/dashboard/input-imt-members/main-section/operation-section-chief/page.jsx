'use client'

import ListTemplate from '@/components/ImtMembers/ListTemplate';

export default function page() {

    const routeUrl = "main-section/operation-section-chief";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Operation Section Chief"
        />
    )
}
