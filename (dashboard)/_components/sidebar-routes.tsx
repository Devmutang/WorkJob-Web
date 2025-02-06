"use client";

import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SideBarRouteItem } from "./side-bar-route-item";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import { DateFilter } from "./date-filter";
import { CheckBoxContainer } from "./checkbox-container";
import qs from "query-string";

const adminRoutes = [
  {
    icon: List,
    label: "ตำแหน่งงาน",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "บริษัท",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "การวิเคราะห์ข้อมูล",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icon: Home,
    label: "หน้าหลัก",
    href: "/",
  },
  {
    icon: Compass,
    label: "ค้นหา",
    href: "/search",
  },
  {
    icon: User,
    label: "โปรไฟล์",
    href: "/user",
  },
  {
    icon: BookMarked,
    label: "งานที่บันทึก",
    href: "/savedJobs",
  },
];

const shiftTimingsData = [
  {
    value: "full-time",
    label: "งานเต็มเวลา",
  },
  {
    value: "part-time",
    label: "งานพาร์ทไทม์",
  },
  {
    value: "contract",
    label: "งานสัญญาจ้าง",
  },
];

const workingModesData = [
  {
    value: "remote",
    label: "ทำงานจากระยะไกล",
  },
  {
    value: "hybrid",
    label: "ทำงานแบบผสมผสาน",
  },
  {
    value: "office",
    label: "ทำงานในสำนักงาน",
  },
];

const experienceData = [
  {
    value: "0",
    label: "นักศึกษาจบใหม่",
  },
  {
    value: "2",
    label: "0-2 ปี",
  },
  {
    value: "3",
    label: "2-4 ปี",
  },
  {
    value: "5",
    label: "5+ ปี",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");

  const routes = isAdminPage ? adminRoutes : guestRoutes;

  const handleShiftTimingChange = (shiftTimings: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updateQueryParams = {
      ...currentQueryParams,
      shiftTiming: shiftTimings,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updateQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  };

  const handleWorkingModes = (workingModes: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updateQueryParams = {
      ...currentQueryParams,
      workMode: workingModes,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updateQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );

    router.push(url);
  };

  const handleExperience = (experience: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updateQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experience,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updateQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );

    router.push(url);
  };
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SideBarRouteItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col">
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
          ค้นหาตามวันที่
          </h2>

          {/* filter the data by createdAt */}
          <DateFilter />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
          เวลาทำงาน
          </h2>
          <CheckBoxContainer
            data={shiftTimingsData}
            onChange={handleShiftTimingChange}
          />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
          รูปแบบการทำงาน
          </h2>
          <CheckBoxContainer
            data={workingModesData}
            onChange={handleWorkingModes}
          />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
          ประสบการณ์การทำงาน
          </h2>
          <CheckBoxContainer
            data={experienceData}
            onChange={handleExperience}
          />
        </Box>
      )}
    </div>
  );
};
