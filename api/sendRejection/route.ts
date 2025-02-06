import { compileSendRejectionEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, fullName } = await req.json();

  const response = await sendMail({
    to: email,
    name: fullName,
    subject: "Application Update",
    body: compileSendRejectionEmailTemplate(fullName),
  });

  if (response?.messageId) {
    return NextResponse.json("Mail Delivered", { status: 200 });
  } else {
    return new NextResponse("Mail not send", { status: 401 });
  }
};
