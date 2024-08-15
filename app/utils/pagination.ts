import { IPagMapToModel } from "app/interfaces";

export const pagination = (count: any, page: any, pageSize: any, items: any) => {
  console.log(count, pageSize);
  const totalPages = Math.ceil(count / Number(pageSize));
  return {
    page,
    pageSize,
    totalItems: count,
    totalPages: totalPages,
    items,
  };
};

export const pagMapToModel = (page, pageSize): IPagMapToModel => {
  return { offset: (Number(page) - 1) * Number(pageSize), limit: Number(pageSize) };
};
