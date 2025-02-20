'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";
import { Suspense } from "react";

export default function page() {

    const routeUrl = "finance-section/cost-unit-leader";
    const responseKey = "read-paginated";

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ListTemplate
                routeUrl={routeUrl}
                responseKey={responseKey}
                headerText="Cost Unit Leader"
            />
        </Suspense>
    );
}