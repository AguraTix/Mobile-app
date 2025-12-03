import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { EventProvider } from "./EventContext";
import { NotificationProvider } from "./NotificationContext";
import { OrderProvider } from "./OrderContext";
import { PaymentProvider } from "./PaymentContext";
import { TicketProvider } from "./TicketContext";
import { FoodProvider } from "./FoodContext";

export function RootProvider({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <EventProvider>
                <OrderProvider>
                    <PaymentProvider>
                        <TicketProvider>
                            <CartProvider>
                                <NotificationProvider>
                                    <FoodProvider>
                                        {children}
                                    </FoodProvider>
                                </NotificationProvider>
                            </CartProvider>
                        </TicketProvider>
                    </PaymentProvider>
                </OrderProvider>
            </EventProvider>
        </AuthProvider>
    )
}