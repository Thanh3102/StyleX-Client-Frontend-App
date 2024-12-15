"use client";
import { ProductDetail } from "@/app/api/product/product.type";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "../collection/ProductCard";

type Props = {
  products: ProductDetail["sameCategoryProducts"];
};
const ProductWithSameCategory = ({ products }: Props) => {
  const currency = new Intl.NumberFormat("vi-VN", {
    currency: "vnd",
    style: "currency",
  });

  return (
    <div className="mt-5 border-t-1 border-zinc-300">
      <div className="flex items-center justify-center py-8 font-bold text-3xl">
        Sản phẩm cùng loại
      </div>
      <Swiper
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={4}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide className="flex flex-col" key={product.id}>
            <ProductCard product={product}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ProductWithSameCategory;
