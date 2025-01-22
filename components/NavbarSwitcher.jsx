// components/NavbarSwitcher.jsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { InputNavbar } from "@/components/ImtMembers/InputNavbar";

export default function NavbarSwitcher() {
    const pathname = usePathname();
    const showInputNavbar = pathname.startsWith("/dashboard/input-imt-members");

    return showInputNavbar ? <InputNavbar /> : <Navbar />;
}
