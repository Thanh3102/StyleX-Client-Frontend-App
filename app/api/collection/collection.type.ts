export type Category = {
  id: number;
  title: string;
  slug: string;
  image: string;
};

export type Collection = {
  id: number;
  title: string;
  slug: string;
  categories: Array<Category>;
};
export type GetCollectionResponse = Array<Collection>;


