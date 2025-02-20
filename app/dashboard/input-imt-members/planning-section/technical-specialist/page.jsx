'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";
import { Suspense } from "react";

export default function page() {

    const routeUrl = "planning-section/technical-specialist";
    const responseKey = "read-paginated";

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ListTemplate
                routeUrl={routeUrl}
                responseKey={responseKey}
                headerText="Technical Specialist"
            />
        </Suspense>
    );
}