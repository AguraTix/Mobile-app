import { createContext, ReactNode, useContext } from "react";

interface OrderContextType{

}

const OrderContext=createContext<OrderContextType|null>(null)

export function OrderProvider({children}:{children:ReactNode}){
    return(
        <OrderContext.Provider value={null}>
            {children}
        </OrderContext.Provider>
    )
}

export function useOrder(){
    const context=useContext(OrderContext)
    if(!context){
        throw new Error('useOrder must be used within an OrderProvider')
    }
    return context
}
