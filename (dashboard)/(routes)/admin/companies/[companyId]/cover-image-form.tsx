"use client";

import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanyCoverImageFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  coverImage: z.string().min(1),
});

export const CompanyCoverImageForm = ({
  initialData,
  companyId,
}: CompanyCoverImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: initialData?.coverImage || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("บริษัทได้รับการอัปเดตแล้ว");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("มีบางอย่างผิดพลาด");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
      ภาพหน้าปกบริษัท
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>ยกเลิก</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              แก้ไข
            </>
          )}
        </Button>
      </div>

      {/* display the coverImage if not editing */}
      {!isEditing &&
        (!initialData.coverImage ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="coverImage Image"
              fill
              className="w-full h-full object-cover"
              src={initialData?.coverImage}
            />
          </div>
        ))}

      {/* on editing mode display the input */}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                บันทึก
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
