import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen flex flex-col overflow-auto relative">
      <div className="bg-green-300 py-4 sticky top-0 z-50">Header</div>
      <div className="flex-1">{children}</div>
      <div className="bg-green-300 py-4">Footer</div>
    </div>
  );
};
export default Layout;
