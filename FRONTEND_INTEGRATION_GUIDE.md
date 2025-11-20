# Frontend Integration Guide - Agura Ticketing System

## Quick Start

### 1. Import Types
```typescript
import {
  User,
  Event,
  Venue,
  Ticket,
  Food,
  FoodOrder,
  UserRole,
  TicketStatus,
  FoodOrderStatus,
  // ... other types
} from '@/types';
```

### 2. API Base URL
Set your API base URL in your environment:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Authentication Flow

#### Register
```typescript
const registerUser = async (data: UserRegisterInput) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json() as UserRegisterOutput;
};
```

#### Login
```typescript
const loginUser = async (data: UserLoginInput) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json() as UserLoginOutput;
  localStorage.setItem('token', result.token);
  return result;
};
```

#### Protected Requests
```typescript
const fetchWithAuth = async (endpoint: string, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

---

## Common Patterns

### 1. Fetching Events
```typescript
// Get all events
const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json() as EventListOutput;
  return data.events;
};

// Get recent events with pagination
const getRecentEvents = async (limit = 10, offset = 0) => {
  const response = await fetch(
    `${API_URL}/events/recent?limit=${limit}&offset=${offset}`
  );
  return response.json() as EventRecentOutput;
};

// Get event by ID
const getEventById = async (eventId: string) => {
  const response = await fetch(`${API_URL}/events/${eventId}`);
  return response.json() as EventDetailOutput;
};
```

### 2. Booking Tickets
```typescript
// Get available tickets for an event
const getAvailableTickets = async (eventId: string) => {
  const response = await fetch(`${API_URL}/tickets/event/${eventId}`);
  return response.json() as TicketAvailableOutput;
};

// Book a ticket
const bookTicket = async (ticketId: string) => {
  const response = await fetchWithAuth(`/tickets/${ticketId}/book`, {
    method: 'POST'
  });
  return response.json() as TicketBookOutput;
};

// Get my tickets
const getMyTickets = async () => {
  const response = await fetchWithAuth('/tickets/my');
  return response.json() as TicketMyListOutput;
};

// Cancel ticket
const cancelTicket = async (ticketId: string) => {
  const response = await fetchWithAuth(`/tickets/${ticketId}/cancel`, {
    method: 'POST'
  });
  return response.json() as TicketCancelOutput;
};
```

### 3. Food Ordering
```typescript
// Get foods for an event
const getFoodsByEvent = async (eventId: string) => {
  const response = await fetch(`${API_URL}/foods/event/${eventId}`);
  return response.json() as FoodByEventOutput;
};

// Create food order
const createFoodOrder = async (data: FoodOrderCreateInput) => {
  const response = await fetchWithAuth('/food-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json() as FoodOrderCreateOutput;
};

// Get my orders
const getMyOrders = async () => {
  const response = await fetchWithAuth('/food-orders/my');
  return response.json() as FoodOrderListOutput;
};
```

### 4. File Uploads (Events & Foods)
```typescript
// Create event with images
const createEvent = async (data: EventCreateInput) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  formData.append('date', data.date);
  formData.append('venue_id', data.venue_id);
  formData.append('artist_lineup', JSON.stringify(data.artist_lineup || []));
  formData.append('tickets', JSON.stringify(data.tickets));
  
  if (data.event_image) {
    formData.append('event_image', data.event_image);
  }
  
  if (data.event_images) {
    data.event_images.forEach((file, index) => {
      formData.append('event_images', file);
    });
  }
  
  const response = await fetchWithAuth('/events', {
    method: 'POST',
    body: formData
  });
  return response.json() as EventCreateOutput;
};

// Create food with image
const createFood = async (data: FoodCreateInput) => {
  const formData = new FormData();
  formData.append('foodname', data.foodname);
  formData.append('quantity', data.quantity.toString());
  formData.append('foodprice', data.foodprice.toString());
  formData.append('fooddescription', data.fooddescription || '');
  formData.append('event_id', data.event_id);
  
  if (data.foodimage) {
    formData.append('foodimage', data.foodimage);
  }
  
  const response = await fetchWithAuth('/foods', {
    method: 'POST',
    body: formData
  });
  return response.json() as FoodCreateOutput;
};
```

---

## Admin Operations

### 1. Venue Management
```typescript
// Create venue
const createVenue = async (data: VenueCreateInput) => {
  const response = await fetchWithAuth('/venues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json() as VenueCreateOutput;
};

// Update venue
const updateVenue = async (venueId: string, data: VenueUpdateInput) => {
  const response = await fetchWithAuth(`/venues/${venueId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json() as VenueUpdateOutput;
};

// Delete venue
const deleteVenue = async (venueId: string) => {
  const response = await fetchWithAuth(`/venues/${venueId}`, {
    method: 'DELETE'
  });
  return response.json() as VenueDeleteOutput;
};
```

### 2. Event Management
```typescript
// Update event
const updateEvent = async (eventId: string, data: EventUpdateInput) => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.date) formData.append('date', data.date);
  if (data.venue_id) formData.append('venue_id', data.venue_id);
  if (data.artist_lineup) {
    formData.append('artist_lineup', JSON.stringify(data.artist_lineup));
  }
  
  if (data.event_image) {
    formData.append('event_image', data.event_image);
  }
  
  if (data.event_images) {
    data.event_images.forEach(file => {
      formData.append('event_images', file);
    });
  }
  
  const response = await fetchWithAuth(`/events/${eventId}`, {
    method: 'PUT',
    body: formData
  });
  return response.json() as EventUpdateOutput;
};

// Delete event
const deleteEvent = async (eventId: string) => {
  const response = await fetchWithAuth(`/events/${eventId}`, {
    method: 'DELETE'
  });
  return response.json() as EventDeleteOutput;
};
```

### 3. View Booked Tickets
```typescript
// Get all booked tickets (admin only)
const getBookedTickets = async (status = 'sold', limit = 50, offset = 0) => {
  const response = await fetchWithAuth(
    `/tickets/admin/booked?status=${status}&limit=${limit}&offset=${offset}`
  );
  return response.json() as TicketAdminListOutput;
};
```

---

## Error Handling

```typescript
const handleApiError = (error: any): string => {
  if (error.error) {
    return error.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Usage
try {
  const result = await loginUser(credentials);
} catch (error) {
  const message = handleApiError(error);
  console.error(message);
}
```

---

## Validation

### User Registration
```typescript
const validateUserRegistration = (data: UserRegisterInput): string[] => {
  const errors: string[] = [];
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.phone_number || data.phone_number.trim().length === 0) {
    errors.push('Phone number is required');
  }
  
  return errors;
};
```

### Event Creation
```typescript
const validateEventCreation = (data: EventCreateInput): string[] => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Event title is required');
  }
  
  if (!data.date) {
    errors.push('Event date is required');
  }
  
  if (!data.venue_id) {
    errors.push('Venue is required');
  }
  
  if (!data.tickets || data.tickets.length === 0) {
    errors.push('At least one ticket type is required');
  }
  
  return errors;
};
```

---

## Image Handling

### Display Event Images
```typescript
const EventImageGallery = ({ event }: { event: Event }) => {
  return (
    <div className="gallery">
      {event.event_images?.map((img) => (
        <img
          key={img.filename}
          src={img.path}
          alt={img.originalname}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ))}
    </div>
  );
};
```

### Display Food Images
```typescript
const FoodCard = ({ food }: { food: Food }) => {
  return (
    <div className="food-card">
      {food.foodimage && (
        <img
          src={food.foodimage}
          alt={food.foodname}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <h3>{food.foodname}</h3>
      <p>{food.fooddescription}</p>
      <p className="price">${food.foodprice}</p>
    </div>
  );
};
```

---

## QR Code Display

```typescript
const TicketQRCode = ({ ticketId }: { ticketId: string }) => {
  return (
    <div className="qr-code">
      <img
        src={`${API_URL}/tickets/${ticketId}/qrcode`}
        alt="Ticket QR Code"
        style={{ maxWidth: '200px' }}
      />
    </div>
  );
};
```

---

## Venue Sections

### Creating Venue with Sections
```typescript
const createVenueWithSections = async () => {
  const data: VenueCreateInput = {
    name: 'Concert Hall',
    location: 'Downtown',
    capacity: 1000,
    hasSections: true,
    sections: [
      { name: 'Front', capacity: 300 },
      { name: 'Middle', capacity: 400 },
      { name: 'Back', capacity: 300 }
    ]
  };
  
  return createVenue(data);
};
```

### Creating Event for Sectioned Venue
```typescript
const createEventForSectionedVenue = async (venueId: string) => {
  const data: EventCreateInput = {
    title: 'Concert',
    date: new Date().toISOString(),
    venue_id: venueId,
    tickets: [
      { type: 'Front', price: 100, quantity: 300 },
      { type: 'Middle', price: 75, quantity: 400 },
      { type: 'Back', price: 50, quantity: 300 }
    ]
  };
  
  return createEvent(data);
};
```

---

## Pagination Example

```typescript
const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    const fetchEvents = async () => {
      const result = await getRecentEvents(limit, (page - 1) * limit);
      setEvents(result.events);
      setTotal(result.pagination.total || 0);
    };
    
    fetchEvents();
  }, [page]);
  
  const totalPages = Math.ceil(total / limit);
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.event_id} event={event} />
      ))}
      
      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        
        <span>{page} / {totalPages}</span>
        
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## Type Safety Tips

1. **Always use the provided interfaces** - Don't create custom types that duplicate API responses
2. **Use `as` casting carefully** - Only cast when you're certain of the response structure
3. **Handle optional fields** - Many fields are optional, use optional chaining (`?.`)
4. **Check enums** - Use enum values for comparisons, not string literals

```typescript
// Good
if (ticket.status === TicketStatus.SOLD) { }

// Avoid
if (ticket.status === 'sold') { }
```

---

## Environment Variables

Create a `.env` file in your frontend project:

```
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

---

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Check if token is stored and valid
```typescript
const token = localStorage.getItem('token');
if (!token) {
  // Redirect to login
}
```

### Issue: CORS Errors
**Solution:** Ensure backend has CORS enabled for your frontend URL

### Issue: File Upload Fails
**Solution:** Don't set Content-Type header when using FormData
```typescript
// Wrong
headers: { 'Content-Type': 'multipart/form-data' }

// Correct - let browser set it automatically
// (no Content-Type header)
```

### Issue: Image URLs Not Loading
**Solution:** Images are served with full URLs, ensure your API base URL is correct

---

## Resources

- **Types File:** `/types/index.ts`
- **API Documentation:** `/API_INTERFACES.md`
- **Backend Repository:** Root directory
- **API Base URL:** Check `.env` file

