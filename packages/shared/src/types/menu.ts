// Menu types
export interface MenuItem {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_popular?: boolean;
  display_order?: number;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  is_available?: boolean;
  is_popular?: boolean;
  display_order?: number;
}
