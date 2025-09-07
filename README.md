# Diocese Infrastructure Management System (CDIMS)

## Project Overview

The Diocese Infrastructure Management System (CDIMS) is a comprehensive web-based application designed to manage infrastructure maintenance requests, material procurement, and inventory management for the Catholic Diocese of Cyangugu.

## System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Frontend**: React.js
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system for attachments

### User Roles & Permissions

1. **Site Engineer** (`SITE_ENGINEER`)
   - Create and manage material requests
   - Track request progress
   - View approved materials

2. **Diocesan Site Engineer** (`DIOCESAN_SITE_ENGINEER`)
   - Review and modify site engineer requests
   - Manage users, materials, and categories
   - Approve or reject requests with modifications

3. **Brother/Padiri** (`PADIRI`)
   - Final approval authority for all requests
   - Comment on requests
   - Notify storekeeper of approved materials

4. **Storekeeper** (`STOREKEEPER`)
   - Manage stock inventory
   - Issue approved materials to site engineers
   - Update stock levels

5. Procurement (PROCUREMENT)
   - Purchase materials not in stock
   - Manage suppliers and purchase orders
   - Update inventory upon delivery

6. **Admin** (`ADMIN`)
   - System administration
   - User management
   - System configuration

## Workflow Process

```
Site Engineer → Creates Request
     ↓
Diocesan Engineer → Reviews & Modifies
     ↓
Brother (Padiri) → Final Approval
     ↓
Storekeeper → Issues Materials
     ↓
Procurement → Buys if needed
```

## Database Schema

The system uses a comprehensive MySQL database with the following main entities:

- **Users & Roles**: Authentication and authorization
- **Sites & Budget Lines**: Project and financial tracking
- **Materials & Categories**: Inventory catalog
- **Requests & Items**: Material request management
- **Approvals**: Workflow tracking
- **Stock Management**: Inventory tracking
- **Procurement**: Purchase order management
- **Issuance**: Material distribution

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Requests
- `GET /api/requests` - List requests (filtered by role)
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `GET /api/requests/:id` - Get request details
- `POST /api/requests/:id/approve` - Approve request
- `POST /api/requests/:id/reject` - Reject request

### Materials
- `GET /api/materials` - List materials
- `POST /api/materials` - Create material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Stock
- `GET /api/stock` - List stock levels
- `POST /api/stock/adjust` - Adjust stock levels
- `GET /api/stock/movements` - Stock movement history

### Procurement
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `POST /api/goods-receipts` - Record goods receipt

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run migrate
npm run seed
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Development Guidelines

### Code Structure
- Follow MVC pattern for backend
- Use component-based architecture for frontend
- Implement proper error handling
- Write comprehensive tests
- Follow RESTful API conventions

### Security
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- File upload security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is proprietary software for the Catholic Diocese of Cyangugu.
