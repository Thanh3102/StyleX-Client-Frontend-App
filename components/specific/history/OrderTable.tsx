"use client";
import { OrderHistory } from "@/app/api/customer/customer.type";
import { ISOStringToLocalDate } from "@/util/helper/StringHelper";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import OrderStatusCard from "./OrderStatusCard";
import RenderIf from "@/components/ui/RenderIf";

type Props = {
  orders: OrderHistory["orders"];
  paginition: OrderHistory["paginition"];
};

type Column = {
  key: string;
  label: string;
  isSortable: boolean;
  className?: string;
  align?: "start" | "center" | "end";
};

const columns: Column[] = [
  {
    key: "code",
    label: "Mã đơn hàng",
    isSortable: false,
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    isSortable: false,
  },
  {
    key: "status",
    label: "Trạng thái",
    isSortable: false,
    align: "center",
  },
  {
    key: "paymentMethod",
    label: "Phương thức thanh toán",
    isSortable: false,
    align: "start",
  },
  {
    key: "total",
    label: "Tổng tiền",
    isSortable: false,
    align: "end",
  },

  {
    key: "detail",
    label: "Chi tiết",
    isSortable: false,
    align: "center",
  },
];

const CustomerTable = ({ orders, paginition }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOrder, setSelectedOrder] =
    useState<OrderHistory["orders"][0]>();

  const handlePageChange = (page: number) => {
    const search = new URLSearchParams(searchParams.toString());
    search.set("page", page.toString());
    router.push(`${pathname}?${search.toString()}`);
  };

  const handleLimitChange = (limit: string) => {
    const search = new URLSearchParams(searchParams.toString());
    search.set("limit", limit);
    search.set("page", "1");
    router.push(`${pathname}?${search.toString()}`);
  };

  const handleDetailClick = (id: string) => {
    const order = orders.find((order) => order.id === id);
    if (!order) return;
    setSelectedOrder(order);
    onOpen();
  };

  const renderCell = useCallback(
    (item: OrderHistory["orders"][0], key: string) => {
      switch (key) {
        case "code":
          return <TableCell>{item.code}</TableCell>;
        case "total":
          return (
            <TableCell>
              {currencyFormatter.format(item.totalOrderAfterDiscount)}
            </TableCell>
          );
        case "status":
          return (
            <TableCell>
              <div className="flex items-center justify-center">
                <OrderStatusCard status={item.status} />
              </div>
            </TableCell>
          );
        case "createdAt":
          return (
            <TableCell>
              {ISOStringToLocalDate(item.createdAt, { hideTime: false })}
            </TableCell>
          );
        case "paymentMethod":
          return (
            <TableCell>
              <span>{item.paymentMethod}</span>
            </TableCell>
          );
        case "detail":
          return (
            <TableCell>
              <span
                className="text-blue-500 hover:cursor-pointer hover:underline"
                onClick={() => handleDetailClick(item.id)}
              >
                Xem chi tiết
              </span>
            </TableCell>
          );
        default:
          return <TableCell>---</TableCell>;
      }
    },
    []
  );

  return (
    <>
      <div className="max-w-full overflow-x-auto max-h-[600px]">
        <Table removeWrapper isHeaderSticky radius="none">
          <TableHeader className="rounded-none" columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={column.className}
                align={column.align}
                allowsSorting={column.isSortable}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={orders}>
            {(item) => (
              <TableRow key={1}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center p-4 bg-white rounded-b-md shadow-md">
        <span className="">
          {`Từ ${
            paginition.count === 0
              ? 0
              : paginition.page === 1
              ? 1
              : (paginition.page - 1) * paginition.limit + 1
          } tới
          ${
            paginition.page * paginition.limit > paginition.count
              ? paginition.count
              : paginition.page * paginition.limit
          } trên tổng ${paginition.count}`}
        </span>

        <Pagination
          total={paginition.total}
          initialPage={paginition.page}
          showControls
          onChange={handlePageChange}
        />

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Hiển thị</span>
          <Select
            size="sm"
            className="w-[80px]"
            selectionMode="single"
            onSelectionChange={(key) =>
              handleLimitChange(key.currentKey as string)
            }
            defaultSelectedKeys={[paginition.limit.toString()]}
          >
            <SelectItem key={"20"}>20</SelectItem>
            <SelectItem key={"50"}>50</SelectItem>
            <SelectItem key={"100"}>100</SelectItem>
          </Select>
          <span className="whitespace-nowrap">Kết quả</span>
        </div>
      </div>

      {selectedOrder && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent className="min-w-[70vw] min-h-[80vh]">
            <ModalHeader>Chi tiết đơn hàng {selectedOrder.code}</ModalHeader>
            <ModalBody>
              <div className="text-sm flex flex-col">
                <div className="flex gap-2">
                  <span className="min-w-[200px]">Tổng tiền hàng</span>
                  <span className="font-medium">
                    {currencyFormatter.format(
                      selectedOrder.totalOrderBeforeDiscount
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="min-w-[200px]">Giảm giá</span>
                  <span className="font-medium">
                    {currencyFormatter.format(
                      selectedOrder.totalOrderDiscountAmount
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="min-w-[200px]">Tổng</span>
                  <span className="font-medium">
                    {currencyFormatter.format(
                      selectedOrder.totalOrderAfterDiscount
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="min-w-[200px]">Ngày tạo</span>
                  <span className="font-medium">
                    {ISOStringToLocalDate(selectedOrder.createdAt, {
                      hideTime: false,
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Table>
                  <TableHeader>
                    <TableColumn>Sản phẩm</TableColumn>
                    <TableColumn>Giá tiền</TableColumn>
                    <TableColumn>Số lượng</TableColumn>
                    <TableColumn>Thành tiền</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{item.product.name}</span>
                            <RenderIf
                              condition={item.variant.title !== "Default Title"}
                            >
                              <span className="text-sm text-zinc-400">
                                {item.variant.title}
                              </span>
                            </RenderIf>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <RenderIf condition={item.discountAmount > 0}>
                              <span className="text-zinc-400 line-through">
                                {currencyFormatter.format(
                                  item.priceBeforeDiscount
                                )}
                              </span>
                            </RenderIf>
                            <span className="text-sm">
                              {currencyFormatter.format(
                                item.discountAmount > 0
                                  ? item.priceAfterDiscount
                                  : item.priceBeforeDiscount
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>{item.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <RenderIf condition={item.discountAmount > 0}>
                              <span className="text-zinc-400 line-through">
                                {currencyFormatter.format(
                                  item.priceBeforeDiscount
                                )}
                              </span>
                            </RenderIf>
                            <span className="text-sm">
                              {currencyFormatter.format(
                                item.discountAmount > 0
                                  ? item.totalPriceAfterDiscount
                                  : item.totalPriceBeforeDiscount
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
export default CustomerTable;
