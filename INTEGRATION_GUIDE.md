# Backend API Integration Guide

This guide explains how to use the integrated backend API services and context management system in the AguraTix mobile app.

## Architecture Overview

The app uses a layered architecture:

```
UI Components
    ↓
Context Hooks (useAuth, useEvent, useTicket, useOrder, useCart, useNotification)
    ↓
Services (authService, EventService, TicketService, etc.)
    ↓
API Client (axios-based with interceptors)
    ↓
Backend API
```

## Key Components

### 1. Types (`/types/backend.ts`)

Comprehensive TypeScript interfaces for all backend entities:

- **Enums**: `UserRole`, `TicketStatus`, `FoodOrderStatus`, `TicketType`
- **User Types**: `User`, `UserLoginInput`, `UserRegisterInput`, `UserUpdateRoleInput`
- **Event Types**: `Event`, `EventCreateInput`, `EventUpdateInput`, `EventImage`
- **Ticket Types**: `Ticket`, `TicketGrouped`, `TicketTypeConfig`
- **Food Types**: `Food`, `FoodCreateInput`, `FoodUpdateInput`
- **Order Types**: `FoodOrder`, `FoodOrderCreateInput`
- **Venue Types**: `Venue`, `VenueCreateInput`, `VenueUpdateInput`
- **Response Types**: All output interfaces for API responses
- **Pagination Types**: `PaginationParams`, `PaginationMeta`

### 2. Services (`/services/`)

Each service provides typed methods for API calls:

#### AuthService
```typescript
import { authService } from '@/services/auth';

// Login
await authService.login({ identifier: 'email@example.com', password: 'pass' });

// Register
await authService.register({ 
  email: 'user@example.com', 
  password: 'pass', 
  name: 'John', 
  phone_number: '1234567890' 
});

// Password Reset
await authService.requestPasswordReset({ identifier: 'email@example.com' });
await authService.verifyPasswordReset({ identifier: 'email@example.com', verification_code: '123456' });
await authService.resetPassword({ identifier: 'email@example.com', verification_code: '123456', new_password: 'newpass' });

// Logout
await authService.logout();
```

#### UserService
```typescript
import { UserService } from '@/services/user';

// Get all users
const response = await UserService.getAll();

// Get current user
const response = await UserService.getMe();

// Get user by ID
const response = await UserService.getById('user_id');

// Update user role
await UserService.updateRole('user_id', { role: 'Admin' });

// Update user
await UserService.update('user_id', { name: 'New Name' });

// Delete user
await UserService.delete('user_id');
```

#### EventService
```typescript
import { EventService } from '@/services/event';

// Get all events
const response = await EventService.getAll();

// Get recent events
const response = await EventService.getRecent({ limit: 10, offset: 0 });

// Get event by ID
const response = await EventService.getById('event_id');

// Get events by venue
const response = await EventService.getByVenue('venue_id');

// Create event
const response = await EventService.create({
  title: 'Concert',
  description: 'Amazing concert',
  date: '2024-12-25T20:00:00Z',
  venue_id: 'venue_id',
  artist_lineup: ['Artist 1', 'Artist 2'],
  tickets: [{ type: 'Regular', price: 50, quantity: 100 }]
});

// Update event
const response = await EventService.update('event_id', { title: 'Updated Title' });

// Delete event
await EventService.delete('event_id');

// Get event images
const response = await EventService.getImages('event_id');
```

#### TicketService
```typescript
import { TicketService } from '@/services/ticket';

// Get available tickets for event
const response = await TicketService.getAvailable('event_id');

// Book a ticket
const response = await TicketService.book('ticket_id');

// Get my tickets
const response = await TicketService.getMyTickets();

// Cancel ticket
await TicketService.cancel('ticket_id');

// Get admin booked tickets
const response = await TicketService.getAdminBooked({ status: 'sold', limit: 10 });
```

#### FoodService
```typescript
import { FoodService } from '@/services/food';

// Get all food items
const response = await FoodService.getAll();

// Get food by event
const response = await FoodService.getByEvent('event_id');

// Get food by ID
const response = await FoodService.getById('food_id');

// Create food
const response = await FoodService.create({
  foodname: 'Pizza',
  quantity: 50,
  foodprice: 15,
  fooddescription: 'Delicious pizza',
  event_id: 'event_id'
});

// Update food
const response = await FoodService.update('food_id', { quantity: 30 });

// Delete food
await FoodService.delete('food_id');
```

#### OrderService
```typescript
import { OrderService } from '@/services/order';

// Get my orders
const response = await OrderService.getMyOrders();

// Get order history
const response = await OrderService.getHistory({ page: 1, limit: 10 });

// Get orders by event
const response = await OrderService.getByEvent('event_id', { page: 1, limit: 10 });

// Get order by ID
const response = await OrderService.getById('order_id');

// Create order
const response = await OrderService.create({
  food_id: 'food_id',
  quantity: 2,
  special_instructions: 'No onions'
});

// Update order
const response = await OrderService.update('order_id', { order_status: 'Confirmed' });

// Delete order
await OrderService.delete('order_id');
```

#### VenueService
```typescript
import { VenueService } from '@/services/venue';

// Get all venues
const response = await VenueService.getAll();

// Get venue by ID
const response = await VenueService.getById('venue_id');

// Create venue
const response = await VenueService.create({
  name: 'Grand Arena',
  location: 'Downtown',
  capacity: 5000,
  hasSections: true,
  sections: [{ name: 'VIP', capacity: 500 }]
});

// Update venue
const response = await VenueService.update('venue_id', { capacity: 6000 });

// Delete venue
await VenueService.delete('venue_id');
```

### 3. Context Providers (`/contexts/`)

Contexts manage global state and provide hooks for components.

#### AuthContext
Manages authentication state and user session.

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginScreen() {
  const { user, token, isLoading, error, login, logout, clearError } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ identifier: 'user@example.com', password: 'pass' });
      // User is now logged in
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      {user && <Text>Welcome, {user.name}</Text>}
      <Button onPress={handleLogin} disabled={isLoading} title="Login" />
      <Button onPress={logout} title="Logout" />
    </View>
  );
}
```

#### EventContext
Manages events data and operations.

```typescript
import { useEvent } from '@/contexts/EventContext';

function EventsScreen() {
  const {
    events,
    currentEvent,
    isLoading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError
  } = useEvent();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        title: 'New Event',
        date: '2024-12-25T20:00:00Z',
        venue_id: 'venue_id',
        tickets: [{ type: 'Regular', price: 50, quantity: 100 }]
      });
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item.event_id}
    />
  );
}
```

#### TicketContext
Manages ticket availability and bookings.

```typescript
import { useTicket } from '@/contexts/TicketContext';

function TicketsScreen({ eventId }) {
  const {
    availableTickets,
    myTickets,
    isLoading,
    error,
    fetchAvailableTickets,
    bookTicket,
    cancelTicket
  } = useTicket();

  useEffect(() => {
    fetchAvailableTickets(eventId);
  }, [eventId]);

  const handleBookTicket = async (ticketId) => {
    try {
      await bookTicket(ticketId);
      // Ticket booked successfully
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
    <View>
      {availableTickets.map((group) => (
        <TicketGroup key={group.sectionName} group={group} onBook={handleBookTicket} />
      ))}
    </View>
  );
}
```

#### OrderContext
Manages food orders.

```typescript
import { useOrder } from '@/contexts/OrderContext';

function OrdersScreen() {
  const {
    myOrders,
    isLoading,
    error,
    fetchMyOrders,
    createOrder,
    deleteOrder
  } = useOrder();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCreateOrder = async (foodId) => {
    try {
      await createOrder({
        food_id: foodId,
        quantity: 2,
        special_instructions: 'Extra spicy'
      });
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  return (
    <FlatList
      data={myOrders}
      renderItem={({ item }) => <OrderCard order={item} />}
      keyExtractor={(item) => item.order_id}
    />
  );
}
```

#### CartContext
Manages shopping cart for food items.

```typescript
import { useCart } from '@/contexts/CartContext';

function CartScreen() {
  const { items, totalPrice, addItem, removeItem, updateItemQuantity, clearCart } = useCart();

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={() => removeItem(item.order_id)}
            onUpdateQuantity={(qty) => updateItemQuantity(item.order_id, qty)}
          />
        )}
        keyExtractor={(item) => item.order_id}
      />
      <Text>Total: ${totalPrice}</Text>
      <Button onPress={clearCart} title="Clear Cart" />
    </View>
  );
}
```

#### NotificationContext
Manages toast/notification messages.

```typescript
import { useNotification } from '@/contexts/NotificationContext';

function MyComponent() {
  const { addNotification, removeNotification, notifications } = useNotification();

  const handleSuccess = () => {
    addNotification('Operation successful!', 'success', 3000);
  };

  const handleError = () => {
    addNotification('Something went wrong', 'error', 5000);
  };

  return (
    <View>
      <Button onPress={handleSuccess} title="Show Success" />
      <Button onPress={handleError} title="Show Error" />
      {notifications.map((notif) => (
        <Toast key={notif.id} notification={notif} />
      ))}
    </View>
  );
}
```

## Setup Instructions

### 1. Wrap your app with RootProvider

In your main app file (e.g., `app.tsx` or `index.tsx`):

```typescript
import { RootProvider } from '@/contexts/RootProvider';

export default function App() {
  return (
    <RootProvider>
      <YourAppContent />
    </RootProvider>
  );
}
```

### 2. Use hooks in your components

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useEvent } from '@/contexts/EventContext';

function MyComponent() {
  const { user, login } = useAuth();
  const { events, fetchEvents } = useEvent();

  // Use the hooks...
}
```

## API Constants

API endpoints are defined in `/services/constants.ts`:

```typescript
import { API_ENDPOINTS } from '@/services/constants';

// Example: API_ENDPOINTS.EVENTS.ALL = '/events'
// Example: API_ENDPOINTS.EVENTS.BY_ID('123') = '/events/123'
// Example: API_ENDPOINTS.TICKETS.BOOK('456') = '/tickets/456/book'
```

## Error Handling

All contexts provide error state and clearError function:

```typescript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Show error to user
    console.error(error);
    // Clear error after showing
    clearError();
  }
}, [error]);
```

## Loading States

All contexts provide isLoading state:

```typescript
const { isLoading, fetchEvents } = useEvent();

return (
  <View>
    {isLoading && <ActivityIndicator />}
    {/* Your content */}
  </View>
);
```

## Data Synchronization

Data is synchronized through context state. When you perform an action (create, update, delete), the context automatically updates the local state:

```typescript
// When you call createEvent, the context:
// 1. Sets isLoading = true
// 2. Makes API call
// 3. Updates events array with new event
// 4. Sets isLoading = false
// 5. Returns the created event
```

## Best Practices

1. **Always use hooks**: Don't call services directly in components; use context hooks
2. **Handle errors**: Always wrap async operations in try-catch
3. **Check loading state**: Show loading indicators while fetching data
4. **Clear errors**: Clear error messages after displaying them
5. **Optimize re-renders**: Use useCallback and useMemo where appropriate
6. **Type safety**: Always use TypeScript types from `/types/backend.ts`

## Example: Complete Feature Implementation

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useEvent } from '@/contexts/EventContext';
import { useNotification } from '@/contexts/NotificationContext';

function EventDetailsScreen({ eventId }) {
  const { user } = useAuth();
  const { currentEvent, isLoading, error, fetchEventById, updateEvent } = useEvent();
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEventById(eventId);
  }, [eventId]);

  const handleUpdateEvent = async () => {
    try {
      await updateEvent(eventId, { title: 'Updated Title' });
      addNotification('Event updated successfully', 'success');
    } catch (err) {
      addNotification('Failed to update event', 'error');
    }
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  if (!currentEvent) return <Text>Event not found</Text>;

  return (
    <ScrollView>
      <Text>{currentEvent.title}</Text>
      <Text>{currentEvent.description}</Text>
      {user?.role === 'Admin' && (
        <Button onPress={handleUpdateEvent} title="Edit Event" />
      )}
    </ScrollView>
  );
}
```

## Troubleshooting

### Context not found error
Make sure your component is wrapped with `RootProvider` or the specific provider.

### API calls failing
Check that the backend server is running and the `API_CONFIG.BASE_URL` in `/services/constants.ts` is correct.

### Types not found
Ensure you're importing from `/types/backend.ts` and not from other type files.

### State not updating
Remember that context state updates are asynchronous. Use the returned value from async functions or refetch data after operations.
