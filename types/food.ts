import { User } from './auth';

// ============================================================================
// FOOD INTERFACES
// ============================================================================

// Partial Event type for food responses (API returns only these fields)
export interface FoodEvent {
    event_id: string;
    title: string;
    date: string;
}

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
    Event?: FoodEvent;
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
