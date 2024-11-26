"use client";

import {
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsProps,
  cn,
} from "@nextui-org/react";

export type BreadcrumItemType = {
  title: string;
  href?: string;
  isCurrent?: boolean;
};

type Props = {
  items: BreadcrumItemType[];
} & BreadcrumbsProps;

const CustomBreadcrumbs = ({ items, ...props }: Props) => {
  return (
    <Breadcrumbs {...props}>
      {items.map((item) => (
        <BreadcrumbItem
          href={item.href}
          isCurrent={item.isCurrent}
          key={item.title}
        >
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};
export default CustomBreadcrumbs;
