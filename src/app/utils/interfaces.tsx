export interface Plan {
  _id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  ispopular:boolean;
  priceId?: string;
  productId?: string;
  type:number;
}

export interface LoginUser {
  _id: string;
  email: string;
  isAdmin: boolean;
  role: string;
}