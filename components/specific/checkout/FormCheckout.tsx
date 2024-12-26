"use client";
import {
  CancelOrder,
  CheckoutOrder,
  CreatePaymentPayOS,
} from "@/app/api/order";
import {
  DistrictSelector,
  ProvinceSelector,
  WardSelector,
} from "@/components/ui/LocationSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, cn, Input, Radio, RadioGroup } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsBoxSeam, BsCreditCard } from "react-icons/bs";
import { toast } from "react-toastify";
import { z } from "zod";

const CheckoutSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Tên không được để trống" })
      .regex(/^[\w\sÀ-ỹđĐ]+$/, {
        message: "Tên chỉ được chứa chữ cái và khoảng trắng",
      }),
    phoneNumber: z
      .string()
      .length(10, { message: "Số điện thoại phải có độ dài 10 chữ số" })
      .regex(/^\d{10}$/, { message: "Số điện thoại chỉ chứa các chữ số" }),
    email: z
      .string({ required_error: "Bạn chưa nhập email" })
      .email("Vui lòng nhập email hợp lệ"),
    province: z
      .string({ required_error: "Chưa chọn tỉnh/thành phố" })
      .optional(),
    district: z.string({ required_error: "Chưa chọn quận/huyện" }).optional(),
    ward: z.string({ required_error: "Chưa chọn phường/xã" }).optional(),
    address: z
      .string({ required_error: "Chưa nhập địa chỉ nhận hàng" })
      .min(1, "Chưa nhập địa chỉ nhận hàng"),
    paymentMethod: z.string({
      required_error: "Chưa chọn phương thức thanh toán",
    }),
    receiveName: z
      .string()
      // .refine(
      //   (val) => {
      //     if (val === "") return true;
      //     return /^[\w\sÀ-ỹđĐ]+$/.test(val);
      //   },
      //   {
      //     message: "Tên chỉ chứa chữ cái và khoảng trắng",
      //   }
      // )
      .optional(),
    receivePhoneNumber: z
      .string()
      // .length(10, { message: "Số điện thoại phải có độ dài 10 chữ số" })
      // .regex(/^\d{10}$/, { message: "Số điện thoại chỉ chứa các chữ số" })
      // .superRefine((val, ctx) => {
      //   if (val.length !== 10 && val !== "")
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       path: ["receivePhoneNumber"],
      //       message: "Số điện thoại phải có độ dài 10 chữ số",
      //     });

      //   if (!/^\d{10}$/.test(val) && val !== "") {
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       path: ["receivePhoneNumber"],
      //       message: "Số điện thoại chỉ chứa các chữ số",
      //     });
      //   }
      // })
      .optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.district || !data.province || !data.ward) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn đầy đủ địa chỉ nhận hàng",
      });
    }
  });

export type CheckoutData = z.infer<typeof CheckoutSchema>;

const FormCheckout = () => {
  const { data: session } = useSession();
  const searchParam = useSearchParams();
  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted, isValid, submitCount },
  } = useForm<CheckoutData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      email: session?.user.email ?? undefined,
      name: session?.user.name ?? undefined,
      paymentMethod: "Thanh toán khi nhận hàng",
    },
  });

  const handleCancelCheckout = async () => {
    try {
      await CancelOrder(searchParam.get("order") ?? "");
      router.push("/cart");
    } catch (error: any) {
      // toast.error(error?.message);
      router.push("/cart");
    }
  };

  const onSubmit: SubmitHandler<CheckoutData> = async (data) => {
    try {
      const session = await getSession();
      switch (data.paymentMethod) {
        case "Thanh toán khi nhận hàng":
          const { message } = await CheckoutOrder({
            ...data,
            orderId: searchParam.get("order") as string,
            userType: session && !session.terminate ? "Guest" : "Customer",
            customerId: session?.user.id,
          });
          toast.success(message ?? "Đã tạo đơn hàng");
          router.push("/cart");
          break;
        case "Thanh toán qua thẻ ngân hàng":
          const { checkoutUrl } = await CreatePaymentPayOS({
            ...data,
            orderId: searchParam.get("order") as string,
            userType: session && !session.terminate ? "Guest" : "Customer",
            customerId: session?.user.id,
          });

          console.log("Checkout url", checkoutUrl);

          router.push(checkoutUrl);
          break;
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  useEffect(() => {
    if (isSubmitted && !isValid) {
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        const firstErrorMessage =
          errors[firstErrorField as keyof typeof errors]?.message;
        const messageToDisplay =
          typeof firstErrorMessage === "string"
            ? firstErrorMessage
            : "Có thông tin không hợp lệ";

        // toast.error(`${firstErrorField}: ${messageToDisplay}`);
        toast.error(`${messageToDisplay}`);
      }
    }
  }, [submitCount]);

  return (
    <>
      <form
        className="flex flex-col"
        id="FormCheckout"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-3xl font-bold">Thanh toán</h4>
          <Button
            radius="sm"
            color="danger"
            variant="light"
            onClick={handleCancelCheckout}
          >
            Hủy giao dịch
          </Button>
        </div>

        <label htmlFor="name" className="my-2 font-semibold text-lg">
          Thông tin cá nhân
        </label>
        <div className="flex flex-wrap -mx-2 [&>*]:px-2 gap-y-4">
          <Input
            id="name"
            label="Họ tên"
            placeholder="Nhập họ tên của bạn"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-full"
            isRequired
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            isReadOnly={!!session}
            isDisabled={!!session}
            {...register("name")}
          />

          <Input
            label="Email"
            placeholder="Theo dõi đơn hàng sẽ được gửi qua email"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-1/2"
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            isReadOnly={!!session}
            isDisabled={!!session}
            {...register("email")}
          />

          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại của bạn"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-1/2"
            isRequired
            isInvalid={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>

        <label htmlFor="" className="my-3 font-semibold text-lg">
          Địa chỉ nhận hàng
        </label>
        <div className="flex flex-wrap -mx-2 [&>*]:px-2 gap-y-4">
          <ProvinceSelector
            onOptionChange={(key) => {
              setValue("province", key);
            }}
            className="w-1/3"
          />

          <DistrictSelector
            onOptionChange={(key) => {
              setValue("district", key);
            }}
            provinceName={watch("province")}
            className="w-1/3"
          />

          <WardSelector
            onOptionChange={(key) => {
              setValue("ward", key);
            }}
            provinceName={watch("province")}
            districtName={watch("district")}
            className="w-1/3"
          />

          <Input
            label="Địa chỉ cụ thể"
            placeholder="VD: Số 14, Đường Tây Sơn"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-full"
            isRequired
            maxLength={100}
            isInvalid={!!errors.address}
            errorMessage={errors.address?.message}
            {...register("address")}
          />

          <Input
            label="Ghi chú"
            placeholder="Ghi chú thêm (VD: Giao hàng vào buổi chiều)"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-full"
            maxLength={200}
            isInvalid={!!errors.note}
            errorMessage={errors.note?.message}
            {...register("note")}
          />

          <Input
            label="Họ tên người nhận"
            placeholder="Nhập họ tên người nhận (Nếu có)"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-1/2"
            isInvalid={!!errors.receiveName}
            errorMessage={errors.receiveName?.message}
            maxLength={100}
            {...register("receiveName")}
          />

          <Input
            label="Số điện thoại người nhận"
            placeholder="Nhập số điện thoại người nhận (Nếu có)"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            className="w-1/2"
            maxLength={10}
            isInvalid={!!errors.receivePhoneNumber}
            errorMessage={errors.receivePhoneNumber?.message}
            {...register("receivePhoneNumber")}
          />
        </div>

        <label htmlFor="" className="my-3 font-semibold text-lg">
          Phương thức thanh toán
        </label>
        <div className="flex flex-wrap -mx-2 [&>*]:px-2 gap-y-4">
          <div className=" w-1/2">
            <div
              className={cn(
                "flex gap-2 p-4 rounded-lg border-2 border-zinc-400 items-center justify-center hover:cursor-pointer",
                {
                  "border-blue-500 text-blue-500":
                    watch("paymentMethod") === "Thanh toán khi nhận hàng",
                }
              )}
              onClick={() =>
                setValue("paymentMethod", "Thanh toán khi nhận hàng")
              }
            >
              <BsBoxSeam size={20} />
              <span>Thanh toán khi nhận hàng</span>
            </div>
          </div>
          <div className=" w-1/2">
            <div
              className={cn(
                "flex gap-2 p-4 rounded-lg border-2 border-zinc-400 items-center justify-center hover:cursor-pointer",
                {
                  "border-blue-500 text-blue-500":
                    watch("paymentMethod") === "Thanh toán qua thẻ ngân hàng",
                }
              )}
              onClick={() =>
                setValue("paymentMethod", "Thanh toán qua thẻ ngân hàng")
              }
            >
              <BsCreditCard size={20} />
              Thanh toán qua thẻ ngân hàng
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default FormCheckout;
