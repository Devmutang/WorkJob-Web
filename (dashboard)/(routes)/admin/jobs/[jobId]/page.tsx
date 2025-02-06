import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/job-publish-actions";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { YearsOfExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
import { TagsForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  // ตรวจสอบว่าเป็น MongoDB ID ที่ถูกต้องหรือไม่
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </div>
      </Link>

      {/* ชื่อเรื่อง */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">การตั้งค่างาน</h1>
          <span className="text-sm text-neutral-500">
            กรอกข้อมูลทั้งหมด {completionText}
          </span>
        </div>

        {/* ปุ่มแอคชัน */}
        <JobPublishAction
          jobId={params.jobId}
          isPublished={job.isPusblished}
          disabled={!isComplete}
        />
      </div>

      {/* คำเตือนก่อนเผยแพร่งาน */}
      {!job.isPusblished && (
        <Banner
          variant={"warning"}
          label=" งานนี้ยังไม่ได้เผยแพร่ และจะไม่แสดงในรายการงาน"
        />
      )}

      {/* เลย์เอาต์ของคอนเทนเนอร์ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* คอนเทนเนอร์ด้านซ้าย */}
        <div>
          {/* ชื่อเรื่อง */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">ปรับแต่งงานของคุณ</h2>
          </div>

          {/* ฟอร์มชื่อเรื่อง */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* ฟอร์มหมวดหมู่ */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* รูปภาพหน้าปก */}
          <ImageForm initialData={job} jobId={job.id} />

          {/* คำอธิบายสั้น */}
          <ShortDescription initialData={job} jobId={job.id} />

          {/* โหมดเวลาในการทำงาน */}
          <ShiftTimingForm initialData={job} jobId={job.id} />

          {/* อัตราค่าจ้างรายชั่วโมง */}
          <HourlyRateForm initialData={job} jobId={job.id} />

          {/* โหมดการทำงาน */}
          <WorkModeForm initialData={job} jobId={job.id} />

          {/* ประสบการณ์ทำงาน */}
          <YearsOfExperienceForm initialData={job} jobId={job.id} />
        </div>

        {/* คอนเทนเนอร์ด้านขวา */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              

            </div>

            <TagsForm initialData={job} jobId={job.id} />
          </div>

          {/* รายละเอียดบริษัท */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className=" text-xl text-neutral-700">รายละเอียดบริษัท</h2>
            </div>

            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>

          {/* ไฟล์แนบ */}
          <div>
 

            <AttachmentsForm initialData={job} jobId={job.id} />
          </div>
        </div>

        {/* คำอธิบาย */}
        <div className="col-span-2">
          <JobDescription initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
