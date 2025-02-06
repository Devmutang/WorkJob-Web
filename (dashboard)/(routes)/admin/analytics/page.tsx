import {
  getPeiGraphCompanyCreatedByUser,
  getPeiGraphJobCreatedByUser,
  getTotaCompaniesOnPortal,
  getTotalCompaniesOnPortalByUserId,
  getTotalJobsOnPortal,
  getTotalJobsOnPortalByUserId,
} from "@/actions/get-overview-analytics";
import Box from "@/components/box";
import { OverviewPieChart } from "@/components/overview-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardAnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const totalJobsOnPortal = await getTotalJobsOnPortal();
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId);
  const totalCompanniesOnPortal = await getTotaCompaniesOnPortal();
  const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(
    userId
  );

  const graphJobTotal = await getPeiGraphJobCreatedByUser(userId);
  const graphCompanyTotal = await getPeiGraphCompanyCreatedByUser(userId);

  return (
    <Box className="flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans tracking-wider font-bold text-2xl">
          แดชบอร์ด
        </h2>
        <p className="text-sm text-muted-foreground">ภาพรวมของบัญชีของคุณ</p>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-4">
        {/* จำนวนงานทั้งหมดในพอร์ทัล */}
        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">จำนวนงานทั้งหมด</CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>

        {/* จำนวนงานที่สร้างโดยผู้ใช้ */}
        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              จำนวนงานที่สร้างโดยคุณ
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>
        {/* จำนวนบริษัททั้งหมดในพอร์ทัล */}
        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              จำนวนบริษัททั้งหมด
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompanniesOnPortal}
          </CardContent>
        </Card>
        {/* จำนวนบริษัทที่สร้างโดยผู้ใช้ */}
        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              จำนวนบริษัทที่สร้างโดยคุณ
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>

        {/* จำนวนงานตามเดือน */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              จำนวนงานตามเดือน
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphJobTotal} />
          </CardContent>
        </Card>
        {/* จำนวนบริษัทตามเดือน */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              จำนวนบริษัทตามเดือน
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphCompanyTotal} />
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;
