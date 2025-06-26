# 🚀 Quick Start Guide - Shans System

## ⚡ 5-Minute Setup

### 1. Prerequisites Check
```bash
node --version  # Should be v18.x or higher
git --version   # Any recent version
```

### 2. Clone & Install
```bash
git clone <repository-url>
cd shans-system
cd backend
npm install
```

### 3. Environment Setup
Create `backend/.env`:
```env
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 4. Start Server
```bash
npm start
```

### 5. Access Application
- Open `index.html` in your browser
- Login with: `atlegangp851@gmail.com` / `admin123`

## 🎯 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| User Dashboard | `index.html` | Main sales interface |
| Admin Dashboard | `Admin/index.html` | Administrative interface |
| Login | `login.html` | Unified authentication |
| API | `https://shans-backend.onrender.com/api` | Backend API |

## 🔑 Default Accounts

### Admin Account
- **Email**: `atlegangp851@gmail.com`
- **Password**: `admin123`
- **Access**: Full system access

## 📋 Common Tasks

### Adding Products (Admin)
1. Login as admin
2. Go to "Manage Products"
3. Click "Add Product"
4. Fill in product details
5. Save

### Creating Quotation (User)
1. Login as user
2. Select products from catalog
3. Enter customer details
4. Click "Generate Quotation"
5. Download PDF

### Managing Users (Admin)
1. Login as admin
2. Go to "Manage Users"
3. Add/Edit/Delete users
4. Set admin privileges

## 🔧 API Quick Reference

### Authentication
```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Get current user
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
```

### Products
```javascript
// Get all products
GET /api/products

// Add product (Admin only)
POST /api/products
Headers: { Authorization: "Bearer <admin-token>" }
{
  "item_code": "ABC123",
  "item_name": "Product Name",
  "car_brand": "Toyota",
  // ... other fields
}
```

### Sales
```javascript
// Create sale
POST /api/sales
{
  "customer_info": { /* customer details */ },
  "items": [ /* sale items */ ],
  "totals": { /* pricing totals */ }
}
```

## 🎨 UI Components

### Navigation
- **Admin Button**: Purple (`#9b59b6`) - Only visible to admins
- **User Button**: Blue (`#3498db`) - Navigation elements
- **Success**: Green - Successful operations
- **Warning**: Orange/Red - Alerts and errors

### Key Features
- **Responsive Design**: Works on desktop, tablet, mobile
- **Real-time Search**: Instant product filtering
- **PDF Generation**: Automatic document creation
- **Role-based Access**: Admin vs user permissions

## 🔍 Troubleshooting

### Server Won't Start
```bash
# Check if port 8000 is in use (for local development)
netstat -ano | findstr :8000

# Kill existing process
taskkill /PID <process-id> /F

# Restart server
npm start
```

### Database Connection Failed
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT NOW();"
```

### Login Issues
```javascript
// Clear browser storage
localStorage.clear();
sessionStorage.clear();

// Try default admin account
// Email: atlegangp851@gmail.com
// Password: admin123
```

### PDF Generation Not Working
```bash
# Reinstall Playwright
npm run postinstall
npx playwright install
```

## 📁 File Structure

```
shans-system/
├── README.md                 # Complete documentation
├── QUICK_START.md            # This file
├── index.html                # User dashboard
├── login.html                # Unified login
├── quotation.html            # Quotation generator
├── invoice.html              # Invoice generator
├── receipt.html              # Receipt generator
├── Admin/                    # Admin interface
│   ├── index.html            # Admin dashboard
│   ├── ManageProducts.html   # Product management
│   ├── ManageRooms.html      # Room management
│   ├── manage-users.html     # User management
│   └── ...                   # Other admin pages
└── backend/                  # Server code
    ├── index.js              # Main server
    ├── database.js           # Database connection
    ├── models/               # Data models
    ├── middleware/           # Authentication
    └── .env                  # Environment config
```

## 🚀 Development Workflow

### 1. Make Changes
- Edit frontend files directly
- Modify backend code in `backend/` directory

### 2. Test Changes
- Restart server if backend changes: `npm start`
- Refresh browser for frontend changes

### 3. Database Changes
- Modify `backend/database.js` for schema changes
- Restart server to apply changes

### 4. Add New Features
- Create new HTML pages for frontend
- Add API endpoints in `backend/index.js`
- Create models in `backend/models/`

## 📞 Support

### Quick Help
- Check the main `README.md` for detailed documentation
- Review API endpoints for integration
- Check browser console for frontend errors
- Check server logs for backend issues

### Common Solutions
- **CORS Issues**: Check backend CORS configuration
- **Auth Problems**: Verify JWT token and expiration
- **Database Errors**: Check PostgreSQL connection
- **PDF Issues**: Ensure Playwright is installed

---

**Ready to go!** 🎉 Your Shans System should now be running successfully.

For detailed documentation, see the main [README.md](README.md) file.
