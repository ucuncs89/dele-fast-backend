export interface ResProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  is_deleted: boolean;
  type: string;
  relation_id: number;
  created_at: Date;
  created_by: number;
  product_response: ResProductResponseInterface;
  detail?: any;
}
export interface ResProductResponseInterface {
  product_id: number;

  user_id: number;

  enroll_at: Date;

  is_enroll: boolean;
}
