'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";

export default function page() {

    const routeUrl = "logistic-section/communication-unit-leader";
    const responseKey = "read-paginated";

    return (
        <ListTemplate
            routeUrl={routeUrl}
            responseKey={responseKey}
            headerText="Communication Unit Leader"
        />
    );
}