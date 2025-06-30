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