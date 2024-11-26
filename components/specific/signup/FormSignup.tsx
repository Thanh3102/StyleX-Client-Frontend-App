"use client";

import DatePicker from "@/components/common/DatePicker";
import Input from "@/components/common/Input";
import { SignInRoute } from "@/util/constaint/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, Link, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from "zod";
import OtpVerifyModal from "./OtpVerifyModal";
import RenderIf from "@/components/ui/RenderIf";
import { toast } from "react-toastify";
import { SIGN_UP_URL } from "@/util/constaint/api-routes";

const zodSchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .min(1, "Vui lòng nhập họ tên")
    .max(50, "Họ tên quá dài")
    .regex(/^[A-Za-zÀ-ỹ\s]+$/, "Họ tên chỉ chứa chữ cái"),
  email: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .email("Vui lòng nhập một địa chỉ email hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .regex(
      /^(?=[a-zA-Z0-9-_.@]{8,20}$)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9-_.@]*$/,
      "Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
    ),
  dob: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
  gender: z.string(),
});

export type SignupData = z.infer<typeof zodSchema>;

const FormSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      gender: "Nam",
    },
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch(SIGN_UP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setIsLoading(false);

      const response = await res.json();

      if (res.ok) {
        // Mở modal nhập OTP nếu response ok
        setShowOtpVerify(true);
        return;
      }

      toast(response.message ?? "Đã xảy ra lỗi", { type: "error" });
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="p-5 border-1 w-1/2 min-w-[400px] max-w-[800px] flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span>
          Chúng tôi sẽ gửi thư xác nhận đến địa chỉ email được liên kết với tài
          khoản của bạn. Hãy kiểm tra email đến từ chúng tôi
        </span>

        <Input
          label="HỌ TÊN"
          placeholder="Nhập họ tên của bạn"
          isRequired
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="ĐỊA CHỈ EMAIL"
          placeholder="Nhập email hợp lệ"
          isRequired
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="MẬT KHẨU"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          isRequired
          description="Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            showPassword ? (
              <FaRegEyeSlash
                onClick={() => setShowPassword(false)}
                className="hover:cursor-pointer hover:text-gray-500"
              />
            ) : (
              <FaRegEye
                onClick={() => setShowPassword(true)}
                className="hover:cursor-pointer hover:text-gray-500"
              />
            )
          }
          {...register("password")}
        />

        <DatePicker
          showMonthAndYearPickers
          isInvalid={!!errors.dob}
          errorMessage={errors.dob?.message}
          label="SINH NHẬT"
          description="Không thể chỉnh sửa ngày sinh sau khi bạn đăng ký tài khoản."
          maxValue={today(getLocalTimeZone())}
          onChange={(dateValue) =>
            setValue("dob", dateValue.toDate(getLocalTimeZone()), {
              shouldValidate: true,
            })
          }
        />

        <RadioGroup
          label="GIỚI TÍNH"
          classNames={{ base: "[&>span]:label" }}
          orientation="horizontal"
          defaultValue={"Nam"}
          onValueChange={(value) => setValue("gender", value)}
        >
          <Radio value="Nam">Nam</Radio>
          <Radio value="Nữ">Nữ</Radio>
          <Radio value="Bỏ chọn">Bỏ chọn</Radio>
        </RadioGroup>

        <Button
          size="lg"
          radius="none"
          type="submit"
          className="text-white bg-black font-medium w-fit px-10"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Đăng ký
        </Button>

        <div className="flex gap-2">
          <span>Bạn đã có tài khoản?</span>
          <Link href={SignInRoute}>
            <span className="text-link">Đăng nhập</span>
          </Link>
        </div>
      </form>

      <RenderIf condition={showOtpVerify}>
        <OtpVerifyModal
          isOpen={showOtpVerify}
          onOpenChange={(open) => setShowOtpVerify(open)}
          data={getValues()}
        />
      </RenderIf>
    </>
  );
};
export default FormSignup;
