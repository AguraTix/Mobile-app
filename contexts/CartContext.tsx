import { createContext,ReactNode,useContext } from "react"
interface CartContextType{

}

const CartContext=createContext<CartContextType|null>(null)

export function CartProvider({children}:{children:ReactNode}){
    return(
        <CartContext.Provider value={null}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    const context=useContext(CartContext)
    if(!context){
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
