# Quick Start Guide

## 1. Wrap Your App with RootProvider

In your main app file (e.g., `app.tsx`):

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

## 2. Use Context Hooks in Components

### Authentication
```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginScreen() {
  const { user, isLoading, error, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ identifier: 'user@example.com', password: 'pass' });
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    <View>
      {user && <Text>Welcome, {user.name}</Text>}
      <Button onPress={handleLogin} disabled={isLoading} title="Login" />
    </View>
  );
}
```

### Events
```typescript
import { useEvent } from '@/contexts/EventContext';

function EventsScreen() {
  const { events, isLoading, fetchEvents, createEvent } = useEvent();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item.event_id}
    />
  );
}
```

### Tickets
```typescript
import { useTicket } from '@/contexts/TicketContext';

function TicketsScreen({ eventId }) {
  const { availableTickets, isLoading, fetchAvailableTickets, bookTicket } = useTicket();

  useEffect(() => {
    fetchAvailableTickets(eventId);
  }, [eventId]);

  const handleBook = async (ticketId) => {
    try {
      await bookTicket(ticketId);
    } catch (err) {
      console.error('Booking failed');
    }
  };

  return (
    <View>
      {availableTickets.map((group) => (
        <TicketGroup key={group.sectionName} group={group} onBook={handleBook} />
      ))}
    </View>
  );
}
```

### Orders
```typescript
import { useOrder } from '@/contexts/OrderContext';

function OrdersScreen() {
  const { myOrders, isLoading, fetchMyOrders, createOrder } = useOrder();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCreateOrder = async (foodId) => {
    try {
      await createOrder({ food_id: foodId, quantity: 2 });
    } catch (err) {
      console.error('Order failed');
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

### Notifications
```typescript
import { useNotification } from '@/contexts/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotification();

  const handleSuccess = () => {
    addNotification('Success!', 'success', 3000);
  };

  const handleError = () => {
    addNotification('Error occurred', 'error', 5000);
  };

  return (
    <View>
      <Button onPress={handleSuccess} title="Show Success" />
      <Button onPress={handleError} title="Show Error" />
    </View>
  );
}
```

## 3. Key Patterns

### Loading State
```typescript
const { isLoading } = useEvent();

return (
  <View>
    {isLoading && <ActivityIndicator />}
    {/* Your content */}
  </View>
);
```

### Error Handling
```typescript
const { error, clearError } = useEvent();

useEffect(() => {
  if (error) {
    Alert.alert('Error', error);
    clearError();
  }
}, [error]);
```

### Data Fetching
```typescript
const { events, fetchEvents } = useEvent();

useEffect(() => {
  fetchEvents();
}, []); // Fetch once on mount
```

### Creating/Updating Data
```typescript
const { createEvent, updateEvent, deleteEvent } = useEvent();

// Create
const newEvent = await createEvent({
  title: 'Concert',
  date: '2024-12-25T20:00:00Z',
  venue_id: 'venue_123',
  tickets: [{ type: 'Regular', price: 50, quantity: 100 }]
});

// Update
await updateEvent('event_id', { title: 'Updated Title' });

// Delete
await deleteEvent('event_id');
```

## 4. Common Tasks

### Login User
```typescript
const { login } = useAuth();
await login({ identifier: 'user@example.com', password: 'pass' });
```

### Register User
```typescript
const { register } = useAuth();
await register({
  email: 'user@example.com',
  password: 'pass',
  name: 'John',
  phone_number: '1234567890'
});
```

### Fetch Events
```typescript
const { fetchEvents, fetchRecentEvents } = useEvent();
await fetchEvents(); // All events
await fetchRecentEvents(10, 0); // Recent with limit/offset
```

### Book Ticket
```typescript
const { bookTicket } = useTicket();
const bookedTicket = await bookTicket('ticket_id');
```

### Create Order
```typescript
const { createOrder } = useOrder();
const order = await createOrder({
  food_id: 'food_id',
  quantity: 2,
  special_instructions: 'No onions'
});
```

### Add to Cart
```typescript
const { addItem } = useCart();
addItem({
  order_id: 'order_123',
  food_id: 'food_123',
  quantity: 2,
  // ... other FoodOrder properties
});
```

## 5. Type Imports

```typescript
import {
  User,
  Event,
  Ticket,
  FoodOrder,
  Venue,
  Food,
  UserRole,
  TicketStatus,
  FoodOrderStatus,
  TicketType
} from '@/types/backend';
```

## 6. Service Direct Access (if needed)

```typescript
import { authService } from '@/services/auth';
import { EventService } from '@/services/event';
import { TicketService } from '@/services/ticket';
import { OrderService } from '@/services/order';
import { UserService } from '@/services/user';
import { VenueService } from '@/services/venue';
import { FoodService } from '@/services/food';

// Direct service calls (not recommended in components)
const response = await EventService.getAll();
```

## 7. API Endpoints Reference

```typescript
import { API_ENDPOINTS } from '@/services/constants';

// Auth
API_ENDPOINTS.AUTH.LOGIN
API_ENDPOINTS.AUTH.SIGNUP
API_ENDPOINTS.AUTH.LOGOUT

// Events
API_ENDPOINTS.EVENTS.ALL
API_ENDPOINTS.EVENTS.CREATE
API_ENDPOINTS.EVENTS.BY_ID('event_id')
API_ENDPOINTS.EVENTS.RECENT

// Tickets
API_ENDPOINTS.TICKETS.AVAILABLE('event_id')
API_ENDPOINTS.TICKETS.BOOK('ticket_id')
API_ENDPOINTS.TICKETS.MY_TICKETS

// Orders
API_ENDPOINTS.FOOD_ORDERS.CREATE
API_ENDPOINTS.FOOD_ORDERS.MY_ORDERS
API_ENDPOINTS.FOOD_ORDERS.BY_ID('order_id')

// And more...
```

## 8. Complete Example Component

```typescript
import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useEvent } from '@/contexts/EventContext';
import { useNotification } from '@/contexts/NotificationContext';

export function EventsScreen() {
  const { user } = useAuth();
  const { events, isLoading, error, fetchEvents, createEvent, clearError } = useEvent();
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        title: 'New Concert',
        description: 'Amazing concert',
        date: '2024-12-25T20:00:00Z',
        venue_id: 'venue_123',
        artist_lineup: ['Artist 1', 'Artist 2'],
        tickets: [
          { type: 'Regular', price: 50, quantity: 100 },
          { type: 'VIP', price: 100, quantity: 50 }
        ]
      });
      addNotification('Event created successfully!', 'success');
    } catch (err) {
      addNotification('Failed to create event', 'error');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {user?.role === 'Admin' && (
        <Button onPress={handleCreateEvent} title="Create Event" />
      )}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.event_id}
      />
    </View>
  );
}
```

## Documentation

For detailed information, see:
- `INTEGRATION_GUIDE.md` - Comprehensive integration guide
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `/types/backend.ts` - All TypeScript types
- `/services/` - Service implementations
- `/contexts/` - Context implementations
