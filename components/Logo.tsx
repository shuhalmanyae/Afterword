"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useUI } from "@/components/UIProvider";

interface LogoProps {
    className?: string;
    isFooter?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    forceShow?: boolean;
    href?: string;
}

export default function Logo({ className = "", isFooter = false, onClick, forceShow = false, href = "/" }: LogoProps) {
    const pathname = usePathname();
    const { isGlobalNavForced } = useUI();

    // Hide on verify pages unless forced
    if (!forceShow && !isGlobalNavForced && pathname && pathname.includes("/verify")) return null;
    // If it's a footer, we might want slightly different sizing/positioning, 
    // but the user said "not size wise but as look wise".
    // We will use the same base style.

    return (
        <Link href={href} onClick={onClick} className={`group block w-fit ${className}`}>
            <h1 className="font-sans font-light tracking-[0.3em] uppercase text-white flex items-center gap-2 group-hover:opacity-80 transition-opacity">
                Afterword
            </h1>
        </Link>
    );
}

// User mentioned "topright as the main one".
// If I look at current `LanguageSwitcher`, it is top right.
// `NavigationMenu` is top right.
// Maybe there is a Logo at Top Right? 
// I didn't see one in code.
// I will just put this new Logo at Fixed Top Left.
