import Link from 'next/link';

export const IAPNavbar = () => {

    const incidentActionPlan = [
        {
            name: "ICS 202",
            link: "/dashboard/iap/ics-202/detail",
            subMenu: [
                {
                    name: "Incident Objectives",
                    link: "/dashboard/iap/ics-202/detail",
                    subMenu: [
                        { name: "Planning Section Chief", link: "/dashboard/iap/ics-202/detail" },
                    ]
                },
            ]
        },
        {
            name: "ICS 203",
            link: "/dashboard/iap/ics-203/detail",
            subMenu: [
                {
                    name: "Organization Assignment List",
                    link: "/dashboard/iap/ics-203/detail",
                    subMenu: [
                        { name: "Resources Unit Leader", link: "/dashboard/iap/ics-203/detail" },
                    ]
                },
            ]
        },
        {
            name: "ICS 204",
            link: "#",
            subMenu: [
                {
                    name: "Assignment List",
                    link: "#",
                    subMenu: [
                        { name: "Resources Unit Leader", link: "#" },
                        { name: "Operation Section Chief", link: "#" },
                    ]
                },
            ]
        },
        {
            name: "ICS 205",
            link: "#",
            subMenu: [
                {
                    name: "Radio Communication Plan",
                    link: "#",
                    subMenu: [
                        { name: "Communication Unit Leader", link: "#" },
                    ]
                },
            ]
        },
        {
            name: "ICS 206",
            link: "#",
            subMenu: [
                {
                    name: "Medical Plan",
                    link: "#",
                    subMenu: [
                        { name: "Medical Unit Leader", link: "#" },
                        { name: "(review by Safety Officer)", link: "#" },
                    ]
                },
            ]
        },
        {
            name: "ICS 207",
            link: "#",
            subMenu: [
                {
                    name: "Incident Organization Chart",
                    link: "#",
                    subMenu: [
                        { name: "Resources Unit Leader", link: "#" },
                    ]
                },
            ]
        },
        {
            name: "ICS 208",
            link: "#",
            subMenu: [
                {
                    name: "Safety Message/Plan",
                    link: "#",
                    subMenu: [
                        { name: "Safety Officer", link: "#" },
                    ]
                }
            ]
        },
    ]

    const renderMenu = (menu) => {
        return (
            <div key={menu.name}>
                <Link
                    href={menu.link}
                    className='font-jkt text-sm font-bold'
                >
                    {menu.name}
                </Link>
                {menu.subMenu && (
                    <div className="mx-4 flex flex-col">
                        {menu.subMenu.map((subItem) => (
                            <div key={subItem.name}>
                                <Link
                                    href={subItem.link}
                                    className='font-jkt text-xs'
                                >
                                    {subItem.name}
                                </Link>
                                {subItem.subMenu && (
                                    <div className="mx-4 flex flex-col">
                                        {subItem.subMenu.map((subSubItem) => (
                                            <Link
                                                key={subSubItem.name}
                                                href={subSubItem.link}
                                                className='font-jkt text-xs'
                                            >
                                                {subSubItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <nav className="dark:bg-[#12171c] bg-[#ffffff] p-3 lg:p-6 z-[9999] fixed left-0 rounded-3xl shadow h-[95vh] my-5 mx-5 w-[250px]">
            <div className="flex flex-col container mx-auto justify-between">
                <div className="flex flex-col">
                    <h1 className='text-lg font-bold border-b font-jkt'>Incident Action Plan (IAP)</h1>
                    <div className='flex flex-col gap-2 my-1'>
                        {incidentActionPlan.map((data) => renderMenu(data))}
                    </div>
                </div>
            </div>
        </nav>
    );
};