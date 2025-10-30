import { createContext, ReactNode, useContext } from "react";

interface EventContextType{

}

const EventContext=createContext<EventContextType|null>(null)

export function EventProvider({children}:{children:ReactNode}){
    return(
        <EventContext.Provider value={null}>
            {children}
        </EventContext.Provider>
    )
}

export function useEvent(){
    const context=useContext(EventContext)
    if(!context){
        throw new Error('useEvent must be used within an EventProvider')
    }
    return context
}
