# Shans Inventory & Sales Management System

A comprehensive web-based inventory management and sales system designed for automotive parts businesses. The system provides both user-facing and administrative interfaces for managing products, generating quotations, processing sales, and maintaining inventory records.

## 🚀 Features

### 📦 Inventory Management
- **Product Management**: Add, edit, and delete products with detailed specifications
- **Room-based Organization**: Organize products by physical location/rooms
- **Stock Tracking**: Real-time inventory levels with low-stock alerts
- **Category Management**: Organize products by categories and car brands/models
- **Supplier Information**: Track supplier codes and pricing

### 💰 Sales & Documentation
- **Quotation Generation**: Create professional PDF quotations
- **Invoice Generation**: Generate detailed invoices with tax calculations
- **Receipt Generation**: Print receipts for completed sales
- **Sales History**: Track all sales with detailed reporting
- **Profit Tracking**: Monitor profit margins per product and sale

### 👥 User Management
- **Role-based Access**: Admin and regular user roles
- **Unified Login**: Single login page with automatic role-based redirection
- **Admin Dashboard**: Comprehensive administrative interface
- **User Dashboard**: Streamlined interface for sales operations

### 📊 Reporting & Analytics
- **Sales Reports**: Detailed sales history and analytics
- **Low Stock Alerts**: Automatic notifications for products running low
- **Profit Analysis**: Track profitability across products and time periods

## 🏗️ System Architecture

### Frontend
- **Technology**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Responsive, mobile-friendly interface
- **Components**:
  - User Dashboard (`index.html`)
  - Admin Dashboard (`Admin/index.html`)
  - Unified Login (`login.html`)
  - Document Generators (`quotation.html`, `invoice.html`, `receipt.html`)

### Backend
- **Technology**: Node.js with Express.js
- **Database**: PostgreSQL (hosted on Neon)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Email**: Nodemailer for notifications
- **PDF Generation**: Playwright for document generation

### Database Schema
```sql
-- Core Tables
users (id, email, password_hash, is_admin, created_at, updated_at)
rooms (id, name, color, location)
products (item_code, room_id, item_name, car_brand, car_model, ...)
sales (id, reference_number, date, billing_info, totals, ...)
sale_items (id, sale_id, item_code, quantity, pricing, ...)

-- Reference Tables
categories (id, category_id, name)
car_brands (id, brand_id, name)
car_models (id, model_id, name, brand_id)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18.x recommended)
- PostgreSQL database (or Neon account)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shans-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 4. Database Initialization
The system automatically creates all required tables on first startup.

### 5. Start the Server
```bash
npm start
# or for development
npm run dev
```

### 6. Access the Application
- **Frontend**: Open `index.html` in a web browser
- **API**: Backend runs on `https://shans-backend.onrender.com/`

## 👤 Default Admin Account

The system creates a default admin account on first startup:
- **Email**: `atlegangp851@gmail.com`
- **Password**: `admin123`
- **Role**: Administrator

⚠️ **Important**: Change the default admin password after first login!

## 🎯 User Guide

### For Regular Users
1. **Login**: Use the unified login page
2. **Product Selection**: Browse and select products for quotations/sales
3. **Document Generation**: Create quotations, invoices, or receipts
4. **Customer Management**: Enter customer details for each transaction

### For Administrators
1. **Login**: Use admin credentials on the unified login page
2. **Product Management**: Add, edit, or remove products
3. **Room Management**: Organize products by physical locations
4. **User Management**: Create and manage user accounts
5. **Sales Monitoring**: View sales history and analytics
6. **Inventory Control**: Monitor stock levels and low-stock alerts

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Sales
- `GET /api/sales` - Get sales history (Admin)
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get specific sale

### Document Generation
- `POST /api/generate-quotation` - Generate PDF quotation
- `POST /api/generate-invoice` - Generate PDF invoice
- `POST /api/generate-pdf` - Generate PDF receipt

### Admin Only
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin and user role separation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: API rate limiting for security

## 📱 Responsive Design

The system is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Mobile-friendly design for on-the-go access

## 🔄 Navigation Flow

### Unified Login System
- Single login page for all users
- Automatic redirection based on user role:
  - **Admin users** → Admin Dashboard
  - **Regular users** → User Dashboard
- Cross-navigation between admin and user interfaces

### Admin Navigation
- Admin Dashboard → User Page (via "Go to User Page" button)
- User Page → Admin Dashboard (via "Admin Dashboard" button, visible only to admins)

## 📊 Database Migration

The system has been migrated from SQLite to PostgreSQL for:
- **Better Performance**: Optimized for concurrent access
- **Scalability**: Handle larger datasets and more users
- **Reliability**: ACID compliance and better data integrity
- **Cloud Integration**: Seamless deployment on cloud platforms

## 🚀 Deployment

### Local Development
1. Follow installation steps above
2. Use `npm run dev` for development with auto-restart

### Production Deployment
1. Set `NODE_ENV=production` in environment
2. Configure production database URL
3. Use `npm start` to run the server
4. Serve frontend files through a web server (nginx, Apache)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support or questions:
- Check the documentation above
- Review the API endpoints
- Contact the development team

## 🔧 Technical Details

### Frontend Architecture
```
├── index.html              # Main user dashboard
├── login.html              # Unified login page
├── quotation.html          # Quotation generator
├── invoice.html            # Invoice generator
├── receipt.html            # Receipt generator
├── Admin/
│   ├── index.html          # Admin dashboard
│   ├── ManageProducts.html # Product management
│   ├── ManageRooms.html    # Room management
│   ├── manage-users.html   # User management
│   ├── sales-history.html  # Sales reporting
│   ├── low-stock.html      # Low stock alerts
│   ├── script.js           # Admin utilities
│   └── auth.js             # Admin authentication
```

### Backend Architecture
```
backend/
├── index.js                # Main server file
├── database.js             # PostgreSQL connection
├── models/
│   ├── userModel.js        # User operations
│   ├── productModel.js     # Product operations
│   ├── salesModel.js       # Sales operations
│   ├── roomModel.js        # Room operations
│   ├── categoryModel.js    # Category operations
│   ├── carBrandModel.js    # Car brand operations
│   └── carModelModel.js    # Car model operations
├── middleware/
│   └── auth.js             # Authentication middleware
└── .env                    # Environment configuration
```

### Key Features Implementation

#### 1. Unified Authentication System
- **Single Login Page**: All users use the same login interface
- **Role-based Redirection**: Automatic routing based on user privileges
- **Cross-navigation**: Seamless movement between admin and user interfaces
- **Session Management**: JWT tokens with secure storage

#### 2. Real-time Inventory Management
- **Live Stock Updates**: Immediate inventory adjustments after sales
- **Low Stock Monitoring**: Automatic alerts when products run low
- **Batch Operations**: Bulk product updates and imports
- **Audit Trail**: Complete history of inventory changes

#### 3. Document Generation Pipeline
- **Template System**: Customizable PDF templates
- **Dynamic Content**: Real-time data integration
- **Multi-format Support**: Quotations, invoices, and receipts
- **Email Integration**: Automatic document delivery

#### 4. Advanced Search & Filtering
- **Multi-criteria Search**: Filter by brand, model, category, room
- **Real-time Results**: Instant search as you type
- **Saved Filters**: Store frequently used search criteria
- **Export Options**: Download filtered results

## 🎨 UI/UX Features

### Design Principles
- **Clean Interface**: Minimalist design for better usability
- **Consistent Navigation**: Uniform navigation patterns
- **Visual Hierarchy**: Clear information organization
- **Accessibility**: WCAG compliant design elements

### Interactive Elements
- **Loading Screens**: Visual feedback during operations
- **Toast Notifications**: Non-intrusive status messages
- **Modal Dialogs**: Focused interaction windows
- **Responsive Tables**: Mobile-optimized data display

### Color Coding System
- **Admin Elements**: Purple theme (`#9b59b6`)
- **User Elements**: Blue theme (`#3498db`)
- **Success Actions**: Green indicators
- **Warning/Alerts**: Orange/red indicators

## 📈 Performance Optimizations

### Frontend Optimizations
- **Lazy Loading**: Load content as needed
- **Caching Strategy**: Local storage for frequently accessed data
- **Minified Assets**: Compressed CSS and JavaScript
- **Image Optimization**: Optimized graphics and icons

### Backend Optimizations
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed database queries
- **Caching Layer**: Redis for session and data caching
- **Rate Limiting**: API protection against abuse

### Database Optimizations
- **Proper Indexing**: Optimized query performance
- **Foreign Key Constraints**: Data integrity enforcement
- **Connection Pooling**: Efficient resource utilization
- **Query Optimization**: Efficient SQL queries

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database URL format
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Verify network connectivity
ping your-database-host

# Check firewall settings
# Ensure port 5432 (PostgreSQL) is accessible
```

#### 2. Authentication Problems
```javascript
// Clear browser storage
localStorage.clear();
sessionStorage.clear();

// Check JWT token expiration
// Tokens expire after 24 hours by default
```

#### 3. PDF Generation Issues
```bash
# Ensure Playwright is properly installed
npm run postinstall

# Check browser dependencies
npx playwright install
```

#### 4. Email Configuration
```env
# For Gmail, use app-specific passwords
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 🔄 Backup & Recovery

### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### File System Backup
- Backup the entire project directory
- Include `.env` file (store securely)
- Document any custom configurations

## 🚀 Scaling Considerations

### Horizontal Scaling
- **Load Balancing**: Multiple server instances
- **Database Clustering**: PostgreSQL read replicas
- **CDN Integration**: Static asset delivery
- **Microservices**: Split functionality into services

### Vertical Scaling
- **Server Resources**: Increase CPU/RAM
- **Database Optimization**: Better hardware
- **Caching Solutions**: Redis/Memcached
- **SSD Storage**: Faster disk I/O

## 📊 Monitoring & Analytics

### System Monitoring
- **Server Health**: CPU, memory, disk usage
- **Database Performance**: Query times, connections
- **API Response Times**: Endpoint performance
- **Error Tracking**: Application errors and exceptions

### Business Analytics
- **Sales Metrics**: Revenue, profit margins
- **Inventory Turnover**: Product movement rates
- **User Activity**: Login patterns, feature usage
- **Customer Insights**: Purchase patterns

---

**Shans System** - Streamlining inventory management and sales operations for automotive businesses.

*Built with ❤️ for efficient business operations*
