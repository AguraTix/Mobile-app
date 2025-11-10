import { client } from './client';
import { API_ENDPOINTS } from './constants';

export interface Food {
  food_id: string;
  foodname: string;
  quantity: number;
  foodprice: number;
  fooddescription?: string;
  event_id: string;
  foodimage?: string;
}

type CreateFoodData = {
  foodname: string;
  quantity: number;
  foodprice: number;
  fooddescription?: string;
  event_id: string;
  foodimage?: File;
};

type UpdateFoodData = Partial<CreateFoodData>;

export const FoodService = {
  create: (data: CreateFoodData) => 
    client.post<{ message: string; food: Food }>(API_ENDPOINTS.FOODS.ALL, data),
  
  getAll: () => 
    client.get<{ message: string; foods: Food[] }>(API_ENDPOINTS.FOODS.ALL),
  
  getByEvent: (eventId: string) => 
    client.get<{ message: string; foods: Food[] }>(API_ENDPOINTS.FOODS.BY_EVENT(eventId)),
  
  getById: (id: string) => 
    client.get<{ message: string; food: Food }>(API_ENDPOINTS.FOODS.BY_ID(id)),
  
  update: (id: string, data: UpdateFoodData) => 
    client.put<{ message: string; food: Food }>(API_ENDPOINTS.FOODS.BY_ID(id), data),
  
  delete: (id: string) => 
    client.delete<{ message: string }>(API_ENDPOINTS.FOODS.BY_ID(id))
};
