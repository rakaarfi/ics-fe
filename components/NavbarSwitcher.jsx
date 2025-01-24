"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { InputNavbar } from "@/components/ImtMembers/InputNavbar";
import { IAPNavbar } from "./IAP/IAPNavbar";

export default function NavbarSwitcher() {
    const pathname = usePathname();
    const showInputNavbar = pathname.startsWith("/dashboard/input-imt-members");
    const showIAPNavbar = pathname.startsWith("/dashboard/iap");

    if (showIAPNavbar) return <IAPNavbar />;
    if (showInputNavbar) return <InputNavbar />;
    return <Navbar />;
}
