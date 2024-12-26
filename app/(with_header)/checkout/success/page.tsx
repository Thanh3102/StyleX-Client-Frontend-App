import Header from "@/components/layout/Header";
import { Button } from "@nextui-org/react";
import { FaHistory, FaRegCheckCircle } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";
import { getServerSession } from "next-auth";
import RenderIf from "@/components/ui/RenderIf";
const Page = async () => {
  const session = await getServerSession();
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center gap-5 h-full">
        <FaRegCheckCircle size={100} className="text-green-500" />
        <p className="text-green-500 text-2xl flex items-center justify-center flex-col">
          <span>Đơn hàng của bạn đã tạo thành công</span>
          <span>Cảm ơn bạn đã lựa chọn chúng tôi!</span>
        </p>
        <div className="flex gap-5 items-center justify-center">
          <Button
            as={Link}
            startContent={<MdKeyboardDoubleArrowRight size={20} />}
            endContent={<FaBasketShopping size={20} />}
            color="warning"
            radius="sm"
            variant="bordered"
            href="/collections"
          >
            Tiếp tục mua sắm
          </Button>
          <RenderIf condition={!!(session && !session.terminate)}>
            <Button
              as={Link}
              endContent={<FaHistory size={20} />}
              color="primary"
              radius="sm"
              variant="bordered"
              href="/history"
            >
              Lịch sử mua hàng
            </Button>
          </RenderIf>
        </div>
      </div>
    </>
  );
};
export default Page;
