import { createContext, ReactNode, useContext } from "react";

interface TicketContextType{

}

const TicketContext=createContext<TicketContextType|null>(null)

export function TicketProvider({children}:{children:ReactNode}){
    return(
        <TicketContext.Provider value={null}>
            {children}
        </TicketContext.Provider>
    )
}

export function useTicket(){
    const context=useContext(TicketContext)
    if(!context){
        throw new Error('useTicket must be used within a TicketProvider')
    }
    return context
}
