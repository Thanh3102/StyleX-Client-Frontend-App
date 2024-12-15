import FormSignin from "@/components/specific/signin/FormSignin";
import { SignUpRoute } from "@/util/constaint/route";
import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="px-28 py-20">
      <div className="flex border-1 p-10 shadow-lg gap-2">
        <div className="flex-1 basis-1/2">
          <FormSignin />
        </div>
        <div className="basis-[1px] mx-5">
          <div className="bg-gray-500 h-full"></div>
        </div>
        <div className="flex-1 basis-1/2 flex flex-col">
          <h4 className="text-3xl font-bold">Tạo một tài khoản</h4>
          <span className="py-4">
            Hãy tạo tài khoản ngay ! Bạn có thể nhận được các dịch vụ đặc biệt
            cho riêng bạn như kiểm tra lịch sử mua hàng và nhận phiếu giảm giá
            cho thành viên. Đăng ký miễn phí ngay hôm nay!
          </span>
          <Link href={SignUpRoute}>
            <Button
              size="lg"
              radius="none"
              type="submit"
              className="text-white bg-black font-medium w-fit"
            >
              Tạo tài khoản
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Page;
