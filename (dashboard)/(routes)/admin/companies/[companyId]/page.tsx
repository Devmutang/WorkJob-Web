import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ListChecks, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanySocialContactsForm } from "./social-contacts-form";
import { CompanyCoverImageForm } from "./cover-image-form";
import { CompanyOverviewForm } from "./company-overview";
import { WhyJoinUsForm } from "./why-join-us-form";

const CompanyEditPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  // verfiy the mongodb ID
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">ตั้งค่าบริษัท</h1>
          <span className="text-sm text-neutral-500">
          โปรดกรอกข้อมูลทุกช่องให้สมบูรณ์ {completionText}
          </span>
        </div>
      </div>

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">ปรับแต่งบริษัทของคุณ</h2>
          </div>

          {/* name form */}
          <CompanyName initialData={company} companyId={company.id} />

          {/* description form */}
          <CompanyDescriptionForm
            initialData={company}
            companyId={company.id}
          />

          {/* company logo */}
          <CompanyLogoForm initialData={company} companyId={company.id} />
        </div>

        {/* right container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Network} />
              <h2 className="text-xl">ข้อมูลติดต่อทางโซเชียลของบริษัท</h2>
            </div>

            {/* socials form */}
            <CompanySocialContactsForm
              initialData={company}
              companyId={company.id}
            />

            {/* company cover image */}
            <CompanyCoverImageForm
              initialData={company}
              companyId={company.id}
            />
          </div>
        </div>

        <div className="col-span-2">
          <CompanyOverviewForm initialData={company} companyId={company.id} />
        </div>

        <div className="col-span-2">
          <WhyJoinUsForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
