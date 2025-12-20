# Agura Ticketing Mobile App

The Agura Ticketing Mobile App is a comprehensive solution for event management and ticket purchasing, built with React Native and Expo. It is designed to provide a seamless ticketing experience for events, venues, and ticket management across Africa.

## Tech Stack

- Framework: React Native with Expo (SDK 54)
- Styling: NativeWind (Tailwind CSS)
- State Management: Zustand and Redux Toolkit
- Navigation: Expo Router
- Icons: Lucide (via @expo/vector-icons)
- Forms: Formik and Yup
- API Client: Axios
- Maps: React Native Maps

## Prerequisites

- Node.js (v18 or newer)
- pnpm (recommended) or npm/yarn
- Expo Go app on your mobile device (for development)

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd agura-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open the app:
   Scan the QR code shown in the terminal with your device's camera (iOS) or the Expo Go app (Android).

## Project Structure

- app: Main application routes and screens (using Expo Router)
- components: Reusable UI components
- constants: Global constants and configuration
- contexts: React contexts for global state
- hooks: Custom React hooks
- services: API service abstractions
- types: TypeScript type definitions
- utils: Helper functions and utility modules

## Key Features

- User Authentication (Email, Phone, Google OAuth)
- Event Discovery and Search
- Interactive Seat Selection
- Secure Ticket Purchasing (Mobile Money, Cards, Bank Transfers)
- Food and Beverage Ordering
- Ticket Management with QR Codes
- Real-time Notifications
- Venue Map Integration

## Environment Variables

The application uses the following environment variables. Create a .env file in the root directory:

- EXPO_PUBLIC_API_URL: The base URL for the Agura Ticketing backend API.

## Support

For technical support or inquiries, contact the development team at <support@agura.com>.

---
Built for the African continent.
Version: 1.0.0
Status: Production Ready
