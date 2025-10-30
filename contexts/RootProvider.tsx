import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { EventProvider } from "./EventContext";
import { NotificationProvider } from "./NotificationContext";
import { OrderProvider } from "./OrderContext";
import { TicketProvider } from "./TicketContext";

export function RootProvider({children}:{children:ReactNode}){
    return(
        <AuthProvider>
            <EventProvider>
                <OrderProvider>
                    <TicketProvider>
                        <CartProvider>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </CartProvider>
                    </TicketProvider>
                </OrderProvider>
            </EventProvider>
        </AuthProvider>
    )
}