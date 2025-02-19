'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";

export default function page() {

    const routeUrl = "planning-section/situation-unit-leader";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Situation Unit Leader"
        />
    );
}