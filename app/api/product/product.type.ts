export type Discount = {
  id: number;
  type: "product" | "order";
  mode: "promotion" | "coupon";
  title: string;
  value: number;
  valueLimitAmount: null | number;
  valueType: "value" | "percent" | "flat";
  entitle: "all" | "entitledProduct" | "entitledCategory";
  prerequisite:
    | "none"
    | "prerequisiteMinTotal"
    | "prerequisiteMinItem"
    | "prerequisiteMinItemTotal";
  prerequisiteMinTotal: null | number;
  prerequisiteMinItem: null | number;
  prerequisiteMinItemTotal: null | number;
  usageLimit: null | number;
  onePerCustomer: boolean;
  combinesWithProductDiscount: boolean;
  combinesWithOrderDiscount: boolean;
  startOn: string;
  endOn: string | null;
  active: boolean;
  summary: string;
  applyFor: string;
  usage: number;
  createdAt: string;
  updatedAt: string;
  createdUserId: number;
  void: boolean;
  productIds: number[];
  variantIds: number[];
  categoryIds: number[];
};

export type BasicProduct = {
  id: number;
  name: string;
  image: string | null;
  // sellPrice: number;
  // comparePrice: number;
  createdAt: string;
  updatedAt: string;
  // promotions: Discount[];
  // discountPrice: number | null;
  categoryIds: number[];
  options: Array<{
    id: number;
    name: string;
    position: number;
    values: string[];
  }>;
  // stock: number;
  variants: Array<{
    title: string;
    id: number;
    barCode: string | null;
    skuCode: string;
    comparePrice: number;
    sellPrice: number;
    unit: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    image: string | null;
    discountPrice: number | null;
    discountPercent: number | null;
    avaiable: number;
    applyPromotions: Promotion[];
  }>;
};

export interface ResponseData<T> {
  data: T;
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;
  message?: string;
}

export interface GetProductResponse extends ResponseData<BasicProduct[]> {}

export type Promotion = {
  id: number;
  type: "product" | "order";
  mode: "coupon" | "promotion";
  title: string;
  description: string;
  value: number;
  valueLimitAmount: number | null;
  valueType: "percent" | "flat" | "value";
  entitle: "entitledCategory" | "entitledProduct" | "all";
  prerequisite:
    | "none"
    | "prerequisiteMinTotal"
    | "prerequisiteMinItem"
    | "prerequisiteMinItemTotal";
  prerequisiteMinTotal: null | number;
  prerequisiteMinItem: null | number;
  prerequisiteMinItemTotal: null | number;
  usageLimit: null | number;
  onePerCustomer: boolean;
  combinesWithProductDiscount: boolean;
  combinesWithOrderDiscount: boolean;
  startOn: string;
  endOn: null | string;
  active: boolean;
  summary: string;
  applyFor: string;
  usage: number;
  createdAt: string;
  updatedAt: string;
  createdUserId: number;
  void: boolean;
  categoryIds: number[];
  productIds: number[];
  variantIds: number[];
  amount: number;
};

export interface ProductDetail {
  id: number;
  name: "string";
  skuCode: "string";
  // comparePrice: number;
  // costPrice: number;
  // sellPrice: number;
  type: string | null;
  unit: string | null;
  description: string | null;
  shortDescription: string | null;
  image: string;
  images: {
    url: string;
    publicId: string;
  }[];
  variants: Array<{
    title: string;
    id: number;
    barCode: string | null;
    skuCode: string;
    comparePrice: number;
    sellPrice: number;
    unit: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    image: string | null;
    discountPrice: number | null;
    discountPercent: number | null;
    avaiable: number;
    applyPromotions: Promotion[];
    activePromotions: Promotion[];
  }>;
  options: Array<{
    id: number;
    name: string;
    position: number;
    values: string[];
  }>;
  sameCategoryProducts: BasicProduct[];
  message?: string;
}

export type SearchCategory = {
  id: number;
  title: string;
  slug: string;
  image: null | string;
  imagePublicId: null | string;
  createdAt: string;
  updatedAt: string;
  collectionId: number;
  collection: {
    id: number;
    title: string;
    slug: string;
    position: number;
  };
};

export type SearchProduct = {
  id: number;
  name: string;
  image: null | string;
  createdAt: string;
  updatedAt: string;
  productCategories: Array<{
    categoryId: 10;
  }>;
};

export type ProductSearchResponse = {
  products: SearchProduct[];
  categories: SearchCategory[];
  message?: string;
};
