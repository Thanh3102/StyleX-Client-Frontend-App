import FormSignup from "@/components/specific/signup/FormSignup";
import CustomBreadcrumbs, {
  BreadcrumItemType,
} from "@/components/ui/CustomBreadcrumbs";

const BreadcrumbItems: BreadcrumItemType[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Tạo tài khoản",
    href: "/signup",
    isCurrent: true,
  },
];

const Page = () => {
  return (
    <div className="px-20 py-5">
      <CustomBreadcrumbs
        items={BreadcrumbItems}
        separator={<div className="px-2 text-gray-500">/</div>}
        classNames={{
          base: "text-gray-500",
        }}
      />
      <h4 className="py-5 text-3xl font-bold">Tạo tài khoản</h4>
      <FormSignup />
    </div>
  );
};
export default Page;
