# Screen Integration Guide - Backend API with Error Handling

## Overview

This guide shows how screens have been integrated with the backend API using context providers, with comprehensive error handling and loading states.

## Architecture

```
App (_layout.tsx)
  ↓
RootProvider (wraps all contexts)
  ↓
Screens (use context hooks)
  ↓
Context (manages state & API calls)
  ↓
Services (make API requests)
  ↓
Backend API
```

## Completed Integrations

### 1. App Root Layout (`/app/_layout.tsx`)

**What was done:**
- Wrapped entire app with `RootProvider`
- Ensures all contexts are available to all screens
- Maintains proper provider hierarchy

**Code:**
```typescript
import { RootProvider } from '@/contexts/RootProvider';

export default function RootLayout() {
  return (
    <RootProvider>
      <ToastProvider>
        <Stack>
          {/* All screens here */}
        </Stack>
      </ToastProvider>
    </RootProvider>
  );
}
```

### 2. Login Screen (`/app/auth/login.tsx`)

**Features Implemented:**
- ✅ Real API authentication via `useAuth()` hook
- ✅ Form validation with error display
- ✅ Loading states during login
- ✅ Network error detection
- ✅ Toast notifications for success/error
- ✅ Auto-redirect to home if already logged in
- ✅ Google OAuth integration ready

**Error Handling:**
```typescript
// Network errors
if (error?.message?.includes('ECONNREFUSED')) {
  setNetworkError(true);
  addNotification('Network error. Please check your connection.', 'error', 5000);
}

// API errors
const errorMessage = error?.response?.data?.message || error?.message;
addNotification(errorMessage, 'error', 5000);
```

**Loading States:**
- Login button disabled during request
- Google button disabled during request
- Form inputs remain accessible for retry

**Usage:**
```typescript
const { login, isLoading, error, user } = useAuth();

await login({ identifier: 'user@example.com', password: 'pass' });
```

### 3. Upcoming Events Screen (`/app/(tabs)/events/upcoming.tsx`)

**Features Implemented:**
- ✅ Fetch events from backend on mount
- ✅ Loading spinner while fetching
- ✅ Error state with retry button
- ✅ Empty state when no events
- ✅ Event list with proper filtering
- ✅ Toast notifications for errors
- ✅ Pagination support (10 events per page)

**Error Handling:**
```typescript
// Show error state
if (error && events.length === 0) {
  return (
    <View style={styles.errorContainer}>
      <AlertCircle size={48} color={Colors.error} />
      <Text style={styles.errorTitle}>Unable to Load Events</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <Button title="Try Again" onPress={handleRetry} />
    </View>
  );
}

// Show loading state
if (isLoading && events.length === 0) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading events...</Text>
    </View>
  );
}
```

**Usage:**
```typescript
const { events, isLoading, error, fetchRecentEvents } = useEvent();

useEffect(() => {
  fetchRecentEvents(10, 0); // Fetch 10 events, offset 0
}, []);
```

## Error Handling Patterns

### 1. Network Errors
```typescript
// Detect network issues
if (error?.message?.includes('Network Error') || 
    error?.message?.includes('timeout') ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('ECONNREFUSED')) {
  // Show network error UI
  addNotification('Network error. Please check your connection.', 'error');
}
```

### 2. API Errors
```typescript
// Extract error message from API response
const errorMessage = error?.response?.data?.message || 
                    error?.message || 
                    'Something went wrong';
addNotification(errorMessage, 'error', 5000);
```

### 3. Form Validation Errors
```typescript
// Display field-level errors
{getFieldError('identifier') && (
  <Text style={styles.errorText}>{getFieldError('identifier')}</Text>
)}
```

## Loading States Pattern

### Three-State Pattern
```typescript
// 1. Loading state (no data yet)
if (isLoading && data.length === 0) {
  return <LoadingSpinner />;
}

// 2. Error state (no data)
if (error && data.length === 0) {
  return <ErrorScreen onRetry={handleRetry} />;
}

// 3. Success state (show data)
return <DataList data={data} />;
```

### Partial Loading (with existing data)
```typescript
// Show data while refreshing
if (isLoading && data.length > 0) {
  // Show data with refresh indicator
  return <DataListWithRefresh data={data} isRefreshing={isLoading} />;
}
```

## Notification System

### Toast Notifications
```typescript
import { useNotification } from '@/contexts/NotificationContext';

const { addNotification } = useNotification();

// Success
addNotification('Operation successful!', 'success', 3000);

// Error
addNotification('Something went wrong', 'error', 5000);

// Info
addNotification('Please note...', 'info', 3000);

// Warning
addNotification('Are you sure?', 'warning', 3000);
```

## Integration Checklist

For each screen you integrate, follow this checklist:

- [ ] Import context hooks needed (`useAuth`, `useEvent`, etc.)
- [ ] Import `useNotification` for error messages
- [ ] Add `useEffect` to fetch data on mount
- [ ] Handle loading state (show spinner)
- [ ] Handle error state (show error message + retry button)
- [ ] Handle empty state (show empty message)
- [ ] Handle success state (show data)
- [ ] Add error notifications via `addNotification`
- [ ] Test with network disconnected
- [ ] Test with API errors
- [ ] Test with empty data

## Common Patterns

### Fetch Data on Mount
```typescript
useEffect(() => {
  fetchData();
}, []); // Empty dependency array = run once on mount
```

### Handle Errors
```typescript
useEffect(() => {
  if (error) {
    addNotification(error, 'error', 5000);
    clearError();
  }
}, [error]);
```

### Disable Button During Loading
```typescript
<Button 
  disabled={isLoading || !formik.isValid}
  loading={isLoading}
  onPress={handleSubmit}
/>
```

### Show Loading Indicator
```typescript
{isLoading && <ActivityIndicator size="large" color={Colors.primary} />}
```

## Context Hooks Reference

### useAuth
```typescript
const { user, token, isLoading, error, login, register, logout, clearError } = useAuth();
```

### useEvent
```typescript
const { 
  events, 
  currentEvent, 
  isLoading, 
  error,
  fetchEvents,
  fetchRecentEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  clearError
} = useEvent();
```

### useTicket
```typescript
const {
  availableTickets,
  myTickets,
  isLoading,
  error,
  fetchAvailableTickets,
  fetchMyTickets,
  bookTicket,
  cancelTicket,
  clearError
} = useTicket();
```

### useOrder
```typescript
const {
  myOrders,
  isLoading,
  error,
  fetchMyOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  clearError
} = useOrder();
```

### useNotification
```typescript
const { addNotification, removeNotification, notifications } = useNotification();
```

### useCart
```typescript
const { items, totalPrice, addItem, removeItem, updateItemQuantity, clearCart } = useCart();
```

## Best Practices

1. **Always handle errors**: Show user-friendly error messages
2. **Show loading states**: Users should know something is happening
3. **Provide retry options**: Network errors are temporary
4. **Validate forms**: Prevent invalid submissions
5. **Clear errors**: After showing, clear error state
6. **Use notifications**: Toast for temporary messages
7. **Type safety**: Use TypeScript types from `/types/backend.ts`
8. **Dependency arrays**: Include all dependencies in useEffect
9. **Cleanup**: Remove listeners/timers in cleanup functions
10. **Test offline**: Verify behavior with no network

## Testing Checklist

- [ ] Test with successful API response
- [ ] Test with API error response
- [ ] Test with network timeout
- [ ] Test with network disconnected
- [ ] Test with empty data
- [ ] Test form validation
- [ ] Test loading states
- [ ] Test error recovery (retry)
- [ ] Test navigation after success
- [ ] Test multiple rapid requests

## Next Steps

1. **Integrate remaining screens** using the same patterns
2. **Add more error handling** for specific error codes
3. **Implement offline support** with local caching
4. **Add analytics** to track errors
5. **Create custom error boundaries** for crash handling
6. **Add request interceptors** for logging
7. **Implement retry logic** for failed requests
8. **Add loading skeletons** for better UX

## Files Modified

- `/app/_layout.tsx` - Added RootProvider
- `/app/auth/login.tsx` - Integrated authentication
- `/app/(tabs)/events/upcoming.tsx` - Integrated event fetching

## Documentation References

- See `INTEGRATION_GUIDE.md` for detailed API usage
- See `QUICK_START.md` for quick examples
- See `/types/backend.ts` for all available types
- See `/contexts/` for context implementations
- See `/services/` for service implementations
