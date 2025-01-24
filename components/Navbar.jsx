import Link from 'next/link';

export const Navbar = () => {

    const imtMembersRoster = [
        { name: "Input IMT Member", link: "/dashboard/input-imt-members/" },
        {
            name: "IMT Roster", link: "#", subMenu: [
                { name: "Input", link: "/dashboard/imt-roster/input/" },
                { name: "Detail", link: "/dashboard/imt-roster/detail/" },
                { name: "Table", link: "/dashboard/imt-roster/table/" },
                { name: "Chart", link: "/dashboard/imt-roster/chart/" },
            ]
        },
    ]

    const icsForms = [
        { name: "Incident Data", link: "/dashboard/incident-data/detail" },
        { name: "Operational Period", link: "/dashboard/operational-period/detail" },
        { name: "ICS 201 Incident Briefing", link: "/dashboard/ics-201/detail" },
        { name: "Incident Action Plan (IAP)", link: "/dashboard/iap/" },
    ]

    return (
        <nav className="dark:bg-[#12171c] bg-[#ffffff] p-3 lg:p-6 z-[9999] fixed left-0 rounded-3xl shadow h-[95vh] my-5 mx-5 w-[250px]">
            <div className="flex flex-col container mx-auto justify-between">
                <div className="flex flex-col">
                    <h1 className='text-lg font-bold border-b font-jkt'>Manage IMT Members & Roster</h1>
                    <div className='flex flex-col gap-5 my-1'>
                        {imtMembersRoster.map((data) => {
                            return (
                                <div key={data.name}>
                                    <Link
                                        href={data.link}
                                        className='font-jkt text-sm'
                                    >
                                        {data.name}
                                    </Link>
                                    {data.subMenu && (
                                        <div className="mx-4 my-2 flex flex-col gap-2">
                                            {data.subMenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.link}
                                                    className='font-jkt text-sm'
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className='text-lg font-bold border-b font-jkt'>Manage ICS Forms</h1>
                    <div className='flex flex-col gap-5 my-1'>
                        {icsForms.map((data) => {
                            return (
                                <div key={data.name}>
                                    <Link
                                        href={data.link}
                                        className='font-jkt text-sm'
                                    >
                                        {data.name}
                                    </Link>
                                    {data.subMenu && (
                                        <div className="mx-4 my-2 flex flex-col gap-2">
                                            {data.subMenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.link}
                                                    className='font-jkt text-sm'
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav >
    );
};