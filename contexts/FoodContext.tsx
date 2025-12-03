import { FoodService } from "@/services/food";
import { Food, FoodCreateInput, FoodUpdateInput } from "@/types/food";
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface FoodContextType {
    foods: Food[];
    currentFood: Food | null;
    foodsByEvent: Food[];
    isLoading: boolean;
    error: string | null;
    fetchAllFoods: () => Promise<void>;
    fetchFoodById: (foodId: string) => Promise<void>;
    fetchFoodsByEvent: (eventId: string) => Promise<void>;
    createFood: (data: FoodCreateInput) => Promise<Food>;
    updateFood: (foodId: string, data: FoodUpdateInput) => Promise<Food>;
    deleteFood: (foodId: string) => Promise<void>;
    clearError: () => void;
}

const FoodContext = createContext<FoodContextType | null>(null);

export function FoodProvider({ children }: { children: ReactNode }) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [currentFood, setCurrentFood] = useState<Food | null>(null);
    const [foodsByEvent, setFoodsByEvent] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllFoods = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await FoodService.getAll();
            setFoods(response.foods);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch foods';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchFoodById = useCallback(async (foodId: string) => {
        setIsLoading(true);
        setError(null);
        setCurrentFood(null);
        try {
            const response = await FoodService.getById(foodId);
            setCurrentFood(response.food);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch food';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchFoodsByEvent = useCallback(async (eventId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await FoodService.getByEvent(eventId);
            setFoodsByEvent(response.foods);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch foods for event';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createFood = useCallback(async (data: FoodCreateInput): Promise<Food> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await FoodService.create(data);
            if (response.food) {
                setFoods((prev) => [...prev, response.food]);
                return response.food;
            }
            throw new Error('Failed to create food: food is undefined');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create food';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateFood = useCallback(async (foodId: string, data: FoodUpdateInput): Promise<Food> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await FoodService.update(foodId, data);
            if (response.food) {
                setFoods((prev) =>
                    prev.map((f) => (f.food_id === foodId ? response.food : f))
                );
                if (currentFood?.food_id === foodId) {
                    setCurrentFood(response.food);
                }
                return response.food;
            }
            throw new Error('Failed to update food: food is undefined');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update food';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFood]);

    const deleteFood = useCallback(async (foodId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await FoodService.delete(foodId);
            setFoods((prev) => prev.filter((f) => f.food_id !== foodId));
            if (currentFood?.food_id === foodId) {
                setCurrentFood(null);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete food';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentFood]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: FoodContextType = {
        foods,
        currentFood,
        foodsByEvent,
        isLoading,
        error,
        fetchAllFoods,
        fetchFoodById,
        fetchFoodsByEvent,
        createFood,
        updateFood,
        deleteFood,
        clearError,
    };

    return (
        <FoodContext.Provider value={value}>
            {children}
        </FoodContext.Provider>
    );
}

export function useFood() {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error('useFood must be used within a FoodProvider');
    }
    return context;
}
