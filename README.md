# Product Management System

A full-stack e-commerce product management system built with React, TypeScript, Node.js, and MongoDB. This system provides a robust solution for managing products, including advanced filtering, sorting, and category-specific validation.

---

## 🚀 Features

### Frontend Features
- 🎯 Complete CRUD operations for products
- 🔄 Multiple view modes (Grid, List, Detailed)
- 🔍 Advanced filtering and search capabilities
- 📊 Sorting and pagination support
- 🌓 Dark/Light mode toggle
- 🎨 Responsive design using Tailwind CSS
- 🔒 Form validation with React Hook Form
- ⚡ Real-time updates with React Query
- 🚀 Performance optimization through pagination

### Backend Features
- 📝 RESTful API built with Express
- 🛡️ TypeScript for type safety
- 🔒 Input validation using Joi
- 📊 MongoDB integration with Mongoose ODM
- 🔄 Rate limiting for security
- 📝 Winston logging for detailed error and activity tracking
- ⚡ Centralized error handling middleware
- 🔍 Advanced query features for filtering and sorting

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- React Router
- Heroicons

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Joi
- Winston
- CORS

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kishan-Vadaliya/Product-Module-With-UI.git
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:

Backend (.env):
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:3000/api
PORT=3001
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

---

## 📁 Project Structure

```
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── error-handler/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validation/
│   └── index.ts
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── App.tsx
```

---

## 🔄 API Documentation

### Product Endpoints
| Method | Endpoint                              | Description               |
|--------|--------------------------------------|---------------------------|
| GET    | `/api/products/GetAllProducts`       | Get all products (with filters) |
| GET    | `/api/products/GetProductById/:id`   | Get product by ID         |
| POST   | `/api/products/CreateProduct`        | Create new product        |
| PUT    | `/api/products/UpdateProductById/:id`| Update product            |
| DELETE | `/api/products/DeleteProductById/:id`| Delete product            |
| DELETE | `/api/products/DeleteMultipleProducts` | Delete multiple products |

### Query Parameters
- `search`: Search in product names and descriptions
- `priceMin`: Minimum price filter
- `priceMax`: Maximum price filter
- `category`: Filter by category
- `sort`: Sort by various fields
- `page`: Page number
- `limit`: Items per page
- `colors`: Filter by colors
- `variants`: Filter by variants (electronics)
- `size`: Filter by sizes (clothing)

---

## 🔍 Features in Detail

### View Modes
- **Grid View**: Displays 12 products per page
- **List View**: Displays 25 products per page
- **Detailed View**: Displays 10 products per page

### Product Categories
- **Electronics**: Includes attributes like brand, variants, and warranty.
- **Clothing**: Includes attributes like size, material, and color.

Category-specific validation ensures data integrity for each product type.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📖 Acknowledgments
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)


## 👥 Authors

- [Kishan Vadaliya](https://github.com/Kishan-Vadaliya/)
# vercel-deployment
