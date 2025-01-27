# Product Management System - Frontend

The frontend application for the Product Management System built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- 💫 Modern React with TypeScript
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔍 Advanced filtering and search
- 📊 Pagination
- 🎯 Form validation with React Hook Form
- ⚡ Real-time updates with React Query
- 🚨 Error handling and validation
- 🔄 State management with React Query
- 📱 Mobile-friendly interface

## 🛠️ Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Router DOM
- React Hook Form
- Axios
- HeadlessUI
- HeroIcons

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ErrorAlert.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── Pagination.tsx
│   │   └── Spinner.tsx
│   ├── layout/
│   │   └── Header.tsx
│   └── products/
│       ├── AddProduct.tsx
│       ├── EditProduct.tsx
│       ├── ProductCard.tsx
│       ├── ProductDetail.tsx
│       ├── ProductFilters.tsx
│       ├── ProductForm.tsx
│       └── ProductList.tsx
├── hooks/
│   └── useLoadingState.ts
├── services/
│   └── api.ts
├── types/
│   └── product.ts
└── utils/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Environment Setup

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000/api
PORT=3001
```

3. Start the development server
```bash
npm start
```

## 📝 Available Scripts

- `npm start` - Starts the development server
- `npm build` - Creates a production build
- `npm test` - Runs tests
- `npm eject` - Ejects from Create React App

## 🔍 Key Components

### Product Management
- `ProductList` - Main product listing with filtering and pagination
- `ProductForm` - Reusable form for creating and editing products
- `ProductCard` - Individual product display component
- `ProductDetail` - Detailed view of a single product

### Common Components
- `ErrorBoundary` - Catches and handles React errors
- `LoadingOverlay` - Loading state display
- `Pagination` - Reusable pagination component
- `ErrorAlert` - Error message display

## 🎨 Styling

The project uses Tailwind CSS for styling with a custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

## 🔄 API Integration

The application uses Axios for API calls with a centralized API service:

```typescript
const API = axios.create({
  baseURL: 'http://localhost:3000/api/products'
});
```

## 📊 State Management

- React Query for server state management
- React Hook Form for form state
- Local state with useState for UI state

## 🚨 Error Handling

- Global error boundary
- Form validation errors
- API error handling
- Network error detection
- Toast notifications for user feedback

## 🔐 Type Safety

The project uses TypeScript for type safety with interfaces for all major data structures:

```typescript
interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: 'electronics' | 'clothing' | 'others';
  price: number;
  // ... other properties
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 