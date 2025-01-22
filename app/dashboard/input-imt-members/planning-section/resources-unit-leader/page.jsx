'use client'

import ListTemplate from "@/components/ImtMembers/ListTemplate";

export default function page() {

    const routeUrl = "planning-section/resources-unit-leader";
    const responseKey = "read-paginated";

    return (
        <div className="lg:ml-[17rem] ml-[9rem] lg:my-0 my-24 mx-2">
            <ListTemplate
                routeUrl={routeUrl}
                responseKey={responseKey}
                headerText="Resources Unit Leader"
            />
        </div>
    );
}