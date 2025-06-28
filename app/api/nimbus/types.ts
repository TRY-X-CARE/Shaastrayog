export interface ShipmentRequest {
  customer_name: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  customer_phone: string;
  order_number: string;
  product_name: string;
  quantity: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
  payment_mode: 'Prepaid' | 'COD';
  collectable_amount: number;
}

export interface NimbusResponse {
  success: boolean;
  message: string;
  data?: any;
}
