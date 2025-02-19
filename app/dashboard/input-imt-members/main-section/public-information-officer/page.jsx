'use client'

import ListTemplate from '@/components/ImtMembers/ListTemplate';

export default function page() {

    const routeUrl = "main-section/public-information-officer";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Public Information Officer"
        />
    )
}
