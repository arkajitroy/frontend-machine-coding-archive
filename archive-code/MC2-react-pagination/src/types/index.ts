export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ApiResponse {
  products: Product[];
  total: number;
}
