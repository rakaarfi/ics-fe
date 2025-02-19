'use client'

import ListTemplate from '@/components/ImtMembers/ListTemplate';

export default function page() {

    const routeUrl = "main-section/legal-officer";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Legal Officer"
        />
    )
}
