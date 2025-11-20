# Agura Ticketing System - API Interfaces Documentation

This document maps all API endpoints to their corresponding TypeScript interfaces for frontend integration.

---

## USER ENDPOINTS

### 1. Register User
- **Endpoint:** `POST /api/users/register`
- **Input:** `UserRegisterInput`
- **Output:** `UserRegisterOutput`
- **Description:** Register a new attendee user

### 2. Register Admin
- **Endpoint:** `POST /api/users/registerAdmin`
- **Input:** `UserRegisterInput`
- **Output:** `UserRegisterOutput`
- **Description:** Register a new admin user (for web app)

### 3. Login
- **Endpoint:** `POST /api/users/login`
- **Input:** `UserLoginInput`
- **Output:** `UserLoginOutput`
- **Description:** Login with email or phone number and password

### 4. Update User Role
- **Endpoint:** `PUT /api/users/:id`
- **Input:** `UserUpdateRoleInput`
- **Output:** `UserUpdateRoleOutput`
- **Description:** Update user role (Admin only)

---

## PASSWORD RESET ENDPOINTS

### 1. Request Password Reset
- **Endpoint:** `POST /api/password-reset/request`
- **Input:** `PasswordResetRequestInput`
- **Output:** `PasswordResetRequestOutput`
- **Description:** Request password reset with email or phone

### 2. Verify Reset Code
- **Endpoint:** `POST /api/password-reset/verify`
- **Input:** `PasswordResetVerifyInput`
- **Output:** `PasswordResetVerifyOutput`
- **Description:** Verify the reset code sent to user

### 3. Reset Password
- **Endpoint:** `POST /api/password-reset/reset`
- **Input:** `PasswordResetInput`
- **Output:** `PasswordResetOutput`
- **Description:** Reset password with verified code

---

## VENUE ENDPOINTS

### 1. Create Venue
- **Endpoint:** `POST /api/venues`
- **Auth:** Required (Admin)
- **Input:** `VenueCreateInput`
- **Output:** `VenueCreateOutput`
- **Description:** Create a new venue with optional sections

### 2. Get All Venues
- **Endpoint:** `GET /api/venues`
- **Output:** `VenueListOutput`
- **Description:** Retrieve all venues

### 3. Get Venue by ID
- **Endpoint:** `GET /api/venues/:venueId`
- **Output:** `VenueDetailOutput`
- **Description:** Retrieve a specific venue

### 4. Update Venue
- **Endpoint:** `PUT /api/venues/:venueId`
- **Auth:** Required (Admin)
- **Input:** `VenueUpdateInput`
- **Output:** `VenueUpdateOutput`
- **Description:** Update venue details

### 5. Delete Venue
- **Endpoint:** `DELETE /api/venues/:venueId`
- **Auth:** Required (Admin)
- **Output:** `VenueDeleteOutput`
- **Description:** Delete a venue

---

## EVENT ENDPOINTS

### 1. Create Event
- **Endpoint:** `POST /api/events`
- **Auth:** Required (Admin)
- **Input:** `EventCreateInput` (multipart/form-data)
- **Output:** `EventCreateOutput`
- **Description:** Create a new event with images and tickets

### 2. Get All Events
- **Endpoint:** `GET /api/events`
- **Output:** `EventListOutput`
- **Description:** Retrieve all events

### 3. Get Recent Events
- **Endpoint:** `GET /api/events/recent`
- **Query:** `EventQueryParams`
- **Output:** `EventRecentOutput`
- **Description:** Get recent events with pagination

### 4. Get Event by ID
- **Endpoint:** `GET /api/events/:eventId`
- **Output:** `EventDetailOutput`
- **Description:** Retrieve a specific event

### 5. Update Event
- **Endpoint:** `PUT /api/events/:eventId`
- **Auth:** Required (Admin)
- **Input:** `EventUpdateInput` (multipart/form-data)
- **Output:** `EventUpdateOutput`
- **Description:** Update event details

### 6. Delete Event
- **Endpoint:** `DELETE /api/events/:eventId`
- **Auth:** Required (Admin)
- **Output:** `EventDeleteOutput`
- **Description:** Delete an event

### 7. Get Events by Venue
- **Endpoint:** `GET /api/events/venue/:venueId`
- **Output:** `EventByVenueOutput`
- **Description:** Get all events for a specific venue

### 8. Get Event Images
- **Endpoint:** `GET /api/events/:eventId/images`
- **Output:** `EventImagesOutput`
- **Description:** Get all images for an event

---

## TICKET ENDPOINTS

### 1. Get Available Tickets
- **Endpoint:** `GET /api/tickets/event/:eventId`
- **Output:** `TicketAvailableOutput`
- **Description:** Get available tickets for an event (grouped by section)

### 2. Book Ticket
- **Endpoint:** `POST /api/tickets/:ticketId/book`
- **Auth:** Required
- **Input:** `TicketBookInput`
- **Output:** `TicketBookOutput`
- **Description:** Book a specific ticket

### 3. Get My Tickets
- **Endpoint:** `GET /api/tickets/my`
- **Auth:** Required
- **Output:** `TicketMyListOutput`
- **Description:** Get all tickets booked by the current user

### 4. Cancel Ticket
- **Endpoint:** `POST /api/tickets/:ticketId/cancel`
- **Auth:** Required
- **Output:** `TicketCancelOutput`
- **Description:** Cancel a booked ticket

### 5. Get All Booked Tickets (Admin)
- **Endpoint:** `GET /api/tickets/admin/booked`
- **Auth:** Required (Admin)
- **Query:** `TicketAdminQueryParams`
- **Output:** `TicketAdminListOutput`
- **Description:** Get all purchased tickets with pagination

### 6. Get QR Code
- **Endpoint:** `GET /api/tickets/:ticketId/qrcode`
- **Output:** Image (PNG)
- **Description:** Get QR code image for a ticket

---

## FOOD ENDPOINTS

### 1. Create Food Item
- **Endpoint:** `POST /api/foods`
- **Auth:** Required (Admin)
- **Input:** `FoodCreateInput` (multipart/form-data)
- **Output:** `FoodCreateOutput`
- **Description:** Create a new food item

### 2. Get All Foods
- **Endpoint:** `GET /api/foods`
- **Output:** `FoodListOutput`
- **Description:** Get all food items

### 3. Get Foods by Event
- **Endpoint:** `GET /api/foods/event/:eventId`
- **Output:** `FoodByEventOutput`
- **Description:** Get food items for a specific event (menu items)

### 4. Get General Foods
- **Endpoint:** `GET /api/foods/general`
- **Output:** `FoodGeneralOutput`
- **Description:** Get foods not assigned to any specific event

### 5. Get Food by ID
- **Endpoint:** `GET /api/foods/:id`
- **Output:** `FoodDetailOutput`
- **Description:** Get a specific food item

### 6. Update Food Item
- **Endpoint:** `PUT /api/foods/:id`
- **Auth:** Required (Admin)
- **Input:** `FoodUpdateInput` (multipart/form-data)
- **Output:** `FoodUpdateOutput`
- **Description:** Update food item details

### 7. Delete Food Item
- **Endpoint:** `DELETE /api/foods/:id`
- **Auth:** Required (Admin)
- **Output:** `FoodDeleteOutput`
- **Description:** Delete a food item

---

## FOOD ORDER ENDPOINTS

### 1. Create Food Order
- **Endpoint:** `POST /api/food-orders`
- **Auth:** Required
- **Input:** `FoodOrderCreateInput`
- **Output:** `FoodOrderCreateOutput`
- **Description:** Create a new food order

### 2. Get User Orders
- **Endpoint:** `GET /api/food-orders/my`
- **Auth:** Required
- **Output:** `FoodOrderListOutput`
- **Description:** Get all orders for the current user

### 3. Get User Order History
- **Endpoint:** `GET /api/food-orders/history`
- **Auth:** Required
- **Query:** `FoodOrderQueryParams`
- **Output:** `FoodOrderHistoryOutput`
- **Description:** Get user order history with pagination

### 4. Get Event Orders (Admin)
- **Endpoint:** `GET /api/food-orders/event/:eventId`
- **Auth:** Required (Admin)
- **Query:** `FoodOrderQueryParams`
- **Output:** `FoodOrderEventOutput`
- **Description:** Get all orders for a specific event

---

## ENUMS

### UserRole
```typescript
enum UserRole {
  ATTENDEE = 'Attendee',
  ADMIN = 'Admin'
}
```

### TicketStatus
```typescript
enum TicketStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  USED = 'used',
  CANCELLED = 'cancelled'
}
```

### FoodOrderStatus
```typescript
enum FoodOrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}
```

### TicketType
```typescript
enum TicketType {
  REGULAR = 'Regular',
  VIP = 'VIP',
  VVIP = 'VVIP'
}
```

---

## ERROR HANDLING

All endpoints return error responses in the following format:

```typescript
interface ErrorResponse {
  error: string;
  details?: string;
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## AUTHENTICATION

Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <token>
```

The token is obtained from the login endpoint and should be included in all subsequent requests.

---

## FILE UPLOADS

The following endpoints accept file uploads via `multipart/form-data`:
- `POST /api/events` - event_image, event_images
- `PUT /api/events/:eventId` - event_image, event_images
- `POST /api/foods` - foodimage
- `PUT /api/foods/:id` - foodimage

---

## PAGINATION

Endpoints that support pagination use the following query parameters:
- `limit` - Number of items per page (default varies by endpoint)
- `offset` - Number of items to skip (default: 0)
- `page` - Page number (alternative to offset)

Response includes pagination metadata:
```typescript
interface PaginationMeta {
  limit: number;
  offset: number;
  total?: number;
  page?: number;
  totalPages?: number;
}
```

---

## NOTES FOR FRONTEND DEVELOPERS

1. **Image URLs**: All image URLs returned by the API are absolute URLs (include protocol and domain)
2. **Dates**: All dates are in ISO 8601 format
3. **UUIDs**: All IDs are UUID v4 format
4. **Sections**: Venues can have sections which affects ticket types and pricing
5. **Ticket Grouping**: Available tickets are grouped by section for venues with sections
6. **QR Codes**: Generated automatically when a ticket is sold
7. **Food Orders**: Event ID is derived from the food item, not required in request

---

Generated from: `/types/index.ts`
