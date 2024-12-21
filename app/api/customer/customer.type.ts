export enum OrderStatus {
  CANCEL = "Đã hủy",
  PENDING_PAYMENT = "Đang giao dịch",
  PENDING_PROCESSING = "Chờ xử lý giao hàng",
  IN_TRANSIT = "Đang vận chuyển",
  COMPLETE = "Đã hoàn thành",
}

export enum OrderTransactionStatus {
  PENDING_PAYMENT = "Chưa thanh toán",
  PAID = "Đã thanh toán",
}

export type CustomerInfo = {
  id: string;
  name: string;
  dob: string;
  email: string;
  gender: string;
};

export type UpdateInfoDto = {
  name: string;
  gender: string;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

export type OrderHistory = {
  orders: Array<{
    id: string;
    code: string;
    totalOrderBeforeDiscount: number;
    totalOrderAfterDiscount: number;
    totalOrderDiscountAmount: number;
    status: string;
    transactionStatus: string;
    createdAt: string;
    paymentMethod: string;
    items: Array<{
      id: string;
      quantity: number;
      totalPriceBeforeDiscount: number;
      totalDiscountAmount: number;
      totalPriceAfterDiscount: number;
      priceAfterDiscount: number;
      priceBeforeDiscount: number;
      discountAmount: number;
      product: {
        id: number;
        name: string;
        image: string;
      };
      variant: {
        id: number;
        title: string;
      };
    }>;
  }>;
  paginition: {
    page: number;
    limit: number;
    total: number;
    count: number;
  };
};
