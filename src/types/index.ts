export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  brand: string | null;
  category_id: string | null;
  skin_type: string[] | null;
  skin_concern: string[] | null;
  product_type: string | null;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[] | { image_url: string; is_primary: boolean; sort_order?: number }[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  full_name?: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  governorate: string;
  city: string;
  address_detail: string;
  landmark: string | null;
  notes: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  governorate: string;
  city: string;
  address_detail: string;
  landmark: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  coupon_code: string | null;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image_url?: string;
  stock: number;
}

export const ORDER_STATUSES = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const PAYMENT_METHODS = {
  cod: 'Cash on Delivery',
  vodafone: 'Vodafone Cash',
  instapay: 'InstaPay',
} as const;

export const SKIN_TYPES = ['oily', 'dry', 'combination', 'sensitive', 'normal'] as const;
export const SKIN_CONCERNS = ['acne', 'dryness', 'pigmentation', 'pores', 'dullness', 'wrinkles', 'sensitivity'] as const;
export const PRODUCT_TYPES = ['cleanser', 'serum', 'moisturizer', 'sunscreen', 'toner', 'mask', 'eye_cream', 'exfoliator'] as const;

export const SKIN_TYPE_LABELS: Record<string, string> = {
  oily: 'Oily',
  dry: 'Dry',
  combination: 'Combination',
  sensitive: 'Sensitive',
  normal: 'Normal',
};

export const SKIN_CONCERN_LABELS: Record<string, string> = {
  acne: 'Acne',
  dryness: 'Dryness',
  pigmentation: 'Pigmentation',
  pores: 'Pores',
  dullness: 'Dullness',
  wrinkles: 'Wrinkles',
  sensitivity: 'Sensitivity',
};

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  cleanser: 'Cleanser',
  serum: 'Serum',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
  toner: 'Toner',
  mask: 'Mask',
  eye_cream: 'Eye Cream',
  exfoliator: 'Exfoliator',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
