# Backup Stock Feature: Same Item in Different Rooms

## Overview
The system has been updated to allow the same item code to exist in different rooms, enabling backup stock management across multiple locations. This feature allows businesses to maintain inventory of the same product in various rooms for redundancy and better stock distribution.

## Key Changes Made

### 1. Database Schema Updates
- **Primary Key Change**: Modified the `products` table to use a composite primary key `(item_code, room_id)` instead of just `item_code`
- **Unique Constraint**: Each combination of item_code and room_id is now unique, allowing the same item in different rooms
- **Migration Script**: Created `backend/migrations/update-products-composite-key.js` to handle the schema transition

### 2. Backend API Updates
- **GET `/api/products/:item_code`**: 
  - Without `room_id` query parameter: Returns array of all products with that item_code
  - With `room_id` query parameter: Returns specific product from that room
- **PUT `/api/products/:item_code`**: Now requires `original_room_id` query parameter to identify which product to update
- **DELETE `/api/products/:item_code`**: Now requires `room_id` query parameter to identify which product to delete
- **Product Model**: Updated all methods to work with composite keys

### 3. Frontend Updates
- **ManageProducts.html**: Updated edit/delete functionality to work with room-specific operations
- **Room Movement**: Enhanced room dropdown with visual feedback when moving products between rooms
- **Error Handling**: Added graceful fallback for both old and new API responses
- **Visual Indicators**: Added clear labeling and success messages for room operations

### 4. Sales Integration
- **Stock Updates**: Sales processing now correctly updates stock for specific room instances
- **Room Tracking**: Sales records now track which room products were sold from

## How to Use the New Feature

### Adding Same Item to Different Rooms
1. Go to **Manage Products** page
2. Click **"Add Product"**
3. Enter the same item code but select a different room
4. Fill in the product details (can be different for each room)
5. Click **"Add Product"**

### Moving Products Between Rooms
1. In **Manage Products**, click **"Edit"** on any product
2. Change the **Room** dropdown to a different room
3. The system will show visual feedback indicating the product will be moved
4. Click **"Update Product"**
5. Success message will confirm: "Product moved to [Room Name] successfully!"

### Managing Room-Specific Stock
- Each room instance of an item has its own stock level
- Stock updates only affect the specific room's inventory
- Sales automatically deduct from the correct room's stock

## Benefits

### ✅ Backup Stock Management
- Maintain the same item in multiple rooms for redundancy
- Distribute popular items across different locations
- Reduce risk of stockouts by having backup inventory

### ✅ Flexible Inventory Organization
- Different rooms can have different stock levels of the same item
- Each room instance can have different locations within the room
- Separate low stock thresholds per room if needed

### ✅ Improved Stock Visibility
- See all room instances of an item at once
- Track which rooms have specific items
- Better inventory distribution planning

## Testing the Feature

### Test Page
A comprehensive test page has been created: `test-duplicate-items.html`

**Test Steps:**
1. Open `https://shans-backend.onrender.com/test-duplicate-items.html`
2. Load available rooms
3. Add the same item code to different rooms
4. Search for the item to see all room instances
5. View all products to see duplicate items summary

### Manual Testing in Manage Products
1. Add a product with item code "TEST-001" to Room A
2. Add another product with the same item code "TEST-001" to Room B
3. Verify both products appear in the products list
4. Edit one product and move it to a different room
5. Delete one specific room instance

## Database Migration

### For New Installations
- New installations automatically use the composite primary key schema
- No migration needed

### For Existing Installations
Run the migration script:
```bash
cd backend
node migrations/update-products-composite-key.js
```

**Migration Process:**
1. Checks current database schema
2. Creates backup of existing products table
3. Updates primary key to composite key (item_code, room_id)
4. Preserves all existing data

## API Examples

### Get All Instances of an Item
```javascript
// Returns array of all products with item_code "ABC-123"
GET /api/products/ABC-123
```

### Get Specific Room Instance
```javascript
// Returns single product from room 1
GET /api/products/ABC-123?room_id=1
```

### Update Product (Move to Different Room)
```javascript
// Update product ABC-123 from room 1, moving it to room 2
PUT /api/products/ABC-123?original_room_id=1
{
  "room_id": 2,
  "item_name": "Updated Product",
  // ... other fields
}
```

### Delete Specific Room Instance
```javascript
// Delete ABC-123 from room 1 only
DELETE /api/products/ABC-123?room_id=1
```

## Error Handling

The system includes comprehensive error handling:
- **Graceful Fallback**: Works with both old and new database schemas
- **Clear Error Messages**: Specific messages for room-related operations
- **Visual Feedback**: UI indicators for room changes and moves
- **Validation**: Ensures required room_id parameters are provided

## Future Enhancements

Potential improvements for this feature:
- **Bulk Room Transfer**: Move multiple items between rooms at once
- **Room Stock Reports**: Generate reports showing stock distribution across rooms
- **Auto-Rebalancing**: Automatically suggest stock transfers between rooms
- **Room-Specific Pricing**: Allow different prices for the same item in different rooms

## Support

If you encounter any issues with the backup stock feature:
1. Check the browser console for error messages
2. Verify the database migration completed successfully
3. Ensure all API endpoints are responding correctly
4. Use the test page to validate functionality
