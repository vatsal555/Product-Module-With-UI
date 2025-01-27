import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { errorTracking } from './services/errorTracking';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

// Component imports
import ProductList from './components/products/ProductList';
import AddProduct from './components/products/AddProduct';
import EditProduct from './components/products/EditProduct';
import ProductDetail from './components/products/ProductDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Initialize error tracking
errorTracking.init();

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'dark:bg-dark-card dark:text-dark-text',
                  duration: 3000,
                }}
              />
            </Layout>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App; 