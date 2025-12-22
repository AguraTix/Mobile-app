import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { EventProvider } from "./EventContext";
import { FoodProvider } from "./FoodContext";
import { NotificationProvider } from "./NotificationContext";
import { OrderProvider } from "./OrderContext";
import { PaymentProvider } from "./PaymentContext";
import { StatusProvider } from "./StatusContext";
import { TicketProvider } from "./TicketContext";
import { ToastProvider } from "./ToastContext";

export function RootProvider({ children }: { children: ReactNode }) {
    return (
        <StatusProvider>
            <AuthProvider>
                <EventProvider>
                    <OrderProvider>
                        <PaymentProvider>
                            <TicketProvider>
                                <CartProvider>
                                    <NotificationProvider>
                                        <ToastProvider>
                                            <FoodProvider>
                                                {children}
                                            </FoodProvider>
                                        </ToastProvider>
                                    </NotificationProvider>
                                </CartProvider>
                            </TicketProvider>
                        </PaymentProvider>
                    </OrderProvider>
                </EventProvider>
            </AuthProvider>
        </StatusProvider>
    )
}