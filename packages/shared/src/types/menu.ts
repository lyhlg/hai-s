// Menu types
export interface MenuItem {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMenuItemInput {
  store_id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  display_order?: number;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  is_available?: boolean;
  display_order?: number;
}
