import {
  FoodByEventOutput,
  FoodCreateInput,
  FoodCreateOutput,
  FoodDeleteOutput,
  FoodDetailOutput,
  FoodListOutput,
  FoodUpdateInput,
  FoodUpdateOutput
} from '@/types/food';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export const FoodService = {
  create: (data: FoodCreateInput): Promise<FoodCreateOutput> =>
    client.post<FoodCreateOutput>(API_ENDPOINTS.FOODS.CREATE, data),

  getAll: (): Promise<FoodListOutput> =>
    client.get<FoodListOutput>(API_ENDPOINTS.FOODS.ALL),

  getByEvent: (eventId: string): Promise<FoodByEventOutput> =>
    client.get<FoodByEventOutput>(API_ENDPOINTS.FOODS.BY_EVENT(eventId)),

  getById: (id: string): Promise<FoodDetailOutput> =>
    client.get<FoodDetailOutput>(API_ENDPOINTS.FOODS.BY_ID(id)),

  update: (id: string, data: FoodUpdateInput): Promise<FoodUpdateOutput> =>
    client.put<FoodUpdateOutput>(API_ENDPOINTS.FOODS.UPDATE(id), data),

  delete: (id: string): Promise<FoodDeleteOutput> =>
    client.delete<FoodDeleteOutput>(API_ENDPOINTS.FOODS.DELETE(id)),
};
