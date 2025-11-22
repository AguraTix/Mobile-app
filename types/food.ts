import { User } from './auth';
import { Event } from './events';

// ============================================================================
// FOOD INTERFACES
// ============================================================================

export interface FoodCreateInput {
    foodname: string;
    quantity: number;
    foodprice: number;
    fooddescription?: string;
    event_id: string;
    foodimage?: File;
}

export interface FoodUpdateInput {
    foodname?: string;
    quantity?: number;
    foodprice?: number;
    fooddescription?: string;
    event_id?: string;
    foodimage?: File;
}

export interface Food {
    food_id: string;
    foodname: string;
    foodimage?: string;
    quantity: number;
    foodprice: number;
    fooddescription?: string;
    event_id: string;
    admin_id: string;
    Event?: Event;
    User?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface FoodCreateOutput {
    message: string;
    food: Food;
}

export interface FoodUpdateOutput {
    message: string;
    food: Food;
}

export interface FoodDeleteOutput {
    message: string;
}

export interface FoodListOutput {
    message: string;
    foods: Food[];
}

export interface FoodDetailOutput {
    message: string;
    food: Food;
}

export interface FoodByEventOutput {
    message: string;
    foods: Food[];
    eventId: string;
    count: number;
}

export interface FoodGeneralOutput {
    message: string;
    foods: Food[];
    count: number;
}
