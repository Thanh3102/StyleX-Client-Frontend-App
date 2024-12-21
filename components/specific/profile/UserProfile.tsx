"use client";
import { updateCustomerInfo } from "@/app/api/customer";
import { CustomerInfo } from "@/app/api/customer/customer.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import ChangePasswordButton from "./ChangePasswordButton";

type Props = {
  user: CustomerInfo;
};

const zodSchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .min(1, "Vui lòng nhập họ tên")
    .max(50, "Họ tên quá dài")
    .regex(/^[A-Za-zÀ-ỹ\s]+$/, "Họ tên chỉ chứa chữ cái"),
  //   email: z
  //     .string({ required_error: "Vui lòng nhập một địa chỉ email" })
  //     .email("Vui lòng nhập một địa chỉ email hợp lệ"),
  gender: z.string(),
});

type UpdateInfoData = z.infer<typeof zodSchema>;

const UserProfile = ({ user }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateInfoData>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: user.name,
      //   email: user.email,
      gender: user.gender,
    },
  });

  const onSubmit: SubmitHandler<UpdateInfoData> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      await updateCustomerInfo(data, session?.accessToken);
      toast.success("Cập nhật thông tin thành công");
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 rounded-md border-1 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Thông tin cá nhân</span>
          <ChangePasswordButton />
        </div>
        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            variant="underlined"
            label="Họ tên"
            labelPlacement="outside"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
          />

          <Input
            variant="underlined"
            label="Email"
            labelPlacement="outside"
            defaultValue={user.email}
            // isInvalid={!!errors.email}
            // errorMessage={errors.email?.message}
            isDisabled
            isReadOnly
            // {...register("email")}
          />

          <RadioGroup
            label="Giới tính"
            classNames={{ base: "[&>span]:label" }}
            orientation="horizontal"
            defaultValue={getValues("gender")}
            onValueChange={(value) =>
              setValue("gender", value, { shouldDirty: true })
            }
          >
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
            <Radio value="Bỏ chọn">Bỏ chọn</Radio>
          </RadioGroup>

          <div className="flex justify-end">
            <Button
              radius="sm"
              color="primary"
              isLoading={isLoading}
              isDisabled={!isDirty || isLoading}
              type="submit"
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserProfile;
