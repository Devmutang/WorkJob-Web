"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SideBarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SideBarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SideBarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20",
        isActive &&
          "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20 hover:text-purple-700 "
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          className={cn("text-neutral-500", isActive && "text-purple-700")}
          size={22}
        />
        {label}
      </div>
      {/* highlighter color */}
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-purple-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      ></div>
    </button>
  );
};
