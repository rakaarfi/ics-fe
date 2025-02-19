'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";

export default function page() {

    const routeUrl = "planning-section/resources-unit-leader";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Resources Unit Leader"
        />
    );
}