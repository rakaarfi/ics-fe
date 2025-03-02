import Link from 'next/link';
import { NavSection } from './NavSection';
import styled from 'styled-components';
import { AiOutlineArrowLeft } from "react-icons/ai";

const ScrollableNav = styled.div`
    overflow-y: hidden; /* Scrollbar is hidden by default */
    max-height: 85vh;
    padding-right: 8px;

    &:hover {
        overflow-y: auto; /* Scrollbar appears when hovered */
    }

    &::-webkit-scrollbar {
        width: 8px;
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 4px;
    }

    &:hover::-webkit-scrollbar-thumb {
        background: #888; /* Scrollbar thumb appears when hovered */
    }

    &:hover::-webkit-scrollbar-thumb:hover {
        background: #555; /* Scrollbar thumb changes color when hovered */
    }
`;

export const InputNavbar = () => {

    const main_section = [
        { name: "• Incident Commander", link: "/dashboard/input-imt-members/main-section/incident-commander/" },
        { name: "• Deputy Incident Commander", link: "/dashboard/input-imt-members/main-section/deputy-incident-commander/" },
        { name: "• Safety Officer", link: "/dashboard/input-imt-members/main-section/safety-officer/" },
        { name: "• Public Information Officer", link: "/dashboard/input-imt-members/main-section/public-information-officer/" },
        { name: "• Liaison Officer", link: "/dashboard/input-imt-members/main-section/liaison-officer/" },
        { name: "• Legal Officer", link: "/dashboard/input-imt-members/main-section/legal-officer/" },
        { name: "• Human Capital Officer", link: "/dashboard/input-imt-members/main-section/human-capital-officer/" },
        { name: "• Operation Section Chief", link: "/dashboard/input-imt-members/main-section/operation-section-chief/" },
    ];

    const planning_section = [
        { name: "• Planning Section Chief", link: "/dashboard/input-imt-members/planning-section/planning-section-chief" },
        { name: "• Situation Unit Leader", link: "/dashboard/input-imt-members/planning-section/situation-unit-leader" },
        { name: "• Resources Unit Leader", link: "/dashboard/input-imt-members/planning-section/resources-unit-leader" },
        { name: "• Documentation Unit Leader", link: "/dashboard/input-imt-members/planning-section/documentation-unit-leader" },
        { name: "• Demobilization Unit Leader", link: "/dashboard/input-imt-members/planning-section/demobilization-unit-leader" },
        { name: "• Environmental Unit Leader", link: "/dashboard/input-imt-members/planning-section/environmental-unit-leader" },
        { name: "• Technical Specialist", link: "/dashboard/input-imt-members/planning-section/technical-specialist" },
    ];

    const logistic_section = [
        { name: "• Logistic Section Chief", link: "/dashboard/input-imt-members/logistic-section/logistic-section-chief" },
        { name: "• Communication Unit Leader", link: "/dashboard/input-imt-members/logistic-section/communication-unit-leader" },
        { name: "• Medical Unit Leader", link: "/dashboard/input-imt-members/logistic-section/medical-unit-leader" },
        { name: "• Food Unit Leader", link: "/dashboard/input-imt-members/logistic-section/food-unit-leader" },
        { name: "• Facility Unit Leader", link: "/dashboard/input-imt-members/logistic-section/facility-unit-leader" },
        { name: "• Supply Unit Leader", link: "/dashboard/input-imt-members/logistic-section/supply-unit-leader" },
        { name: "• Transportation Unit Leader", link: "/dashboard/input-imt-members/logistic-section/transportation-unit-leader" },
    ];

    const finance_section = [
        { name: "• Finance Section Chief", link: "/dashboard/input-imt-members/finance-section/finance-section-chief" },
        { name: "• Procurement Unit Leader", link: "/dashboard/input-imt-members/finance-section/procurement-unit-leader" },
        { name: "• Compensation/Claim Unit Leader", link: "/dashboard/input-imt-members/finance-section/compensation-claim-unit-leader" },
        { name: "• Cost Unit Leader", link: "/dashboard/input-imt-members/finance-section/cost-unit-leader" },
        { name: "• Time Unit Leader", link: "/dashboard/input-imt-members/finance-section/time-unit-leader" },
    ];

    const boldItems = [
        "• Planning Section Chief",
        "• Logistic Section Chief",
        "• Finance Section Chief",
    ];

    return (
        <nav className="dark:bg-[#12171c] bg-[#ffffff] p-3 lg:p-6 z-[9999] fixed left-0 rounded-3xl shadow h-[95vh] my-5 mx-5 w-[250px]">
            <div className="flex flex-col container mx-auto h-full">
                <div className="flex justify-center mb-10">
                    <Link href="/dashboard">
                        <button className="flex items-center gap-2 bg-[#1a202c] hover:bg-[#2d3748] text-white font-semibold py-2 px-5 rounded-full shadow-md transition-all duration-300">
                            <AiOutlineArrowLeft size={20} />
                            <span>To Main Menu</span>
                        </button>
                    </Link>
                </div>
                <ScrollableNav>
                    <NavSection title="Input and Update IMT Members" data={main_section} boldItems={boldItems} />
                    <NavSection data={planning_section} boldItems={boldItems} />
                    <NavSection data={logistic_section} boldItems={boldItems} />
                    <NavSection data={finance_section} boldItems={boldItems} />
                </ScrollableNav>
            </div>
        </nav>
    );
};