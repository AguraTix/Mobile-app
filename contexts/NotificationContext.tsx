import { createContext, ReactNode, useContext } from "react";

interface NotificationContextType{

}

const NotificationContext=createContext<NotificationContextType|null>(null)

export function NotificationProvider({children}:{children:ReactNode}){
    return(
        <NotificationContext.Provider value={null}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotification(){
    const context=useContext(NotificationContext)
    if(!context){
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}
