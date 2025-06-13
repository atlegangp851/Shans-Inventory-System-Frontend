// Backend endpoint for secure Cloudinary backup
// This should be implemented in your existing backend (Node.js/Express example)

const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const XLSX = require('xlsx');

// Configure Cloudinary from environment variables
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

// Middleware for authentication (implement your auth logic)
const authenticateUser = (req, res, next) => {
    // Add your authentication logic here
    // Check if user is logged in and has permission to backup data
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token and user permissions
    // ... your auth logic ...
    
    next();
};

// POST endpoint for backing up sales data
router.post('/backup-sales-data', authenticateUser, async (req, res) => {
    try {
        const { monthYear, salesData } = req.body;
        
        // Validate input
        if (!monthYear || !salesData || !Array.isArray(salesData)) {
            return res.status(400).json({ 
                error: 'Invalid input. monthYear and salesData array required.' 
            });
        }
        
        // Process and flatten the sales data
        const flattenedData = salesData.flatMap(sale =>
            sale.items.map(item => {
                const quantity = parseFloat(item.quantity) || 0;
                const totalPrice = parseFloat(item.total_price) || 0;
                const unitPrice = parseFloat(item.unit_price_excluding_tax) || (quantity > 0 ? totalPrice / quantity : 0);
                const unitCost = parseFloat(item.unit_cost) || 0;
                const profitPerUnit = unitPrice - unitCost;
                const totalProfit = profitPerUnit * quantity;
                const totalRetailValue = unitPrice * quantity;
                const totalCost = unitCost * quantity;

                return {
                    "Reference Number": sale.reference_number,
                    "Date": sale.date,
                    "Client Name": sale.billing_name,
                    "Billing Address": sale.billing_address,
                    "Billing Email": sale.billing_email,
                    "Billing Phone": sale.billing_phone || 'N/A',
                    "Salesperson": sale.salesperson_name || 'N/A',
                    "Company": sale.company_name || 'Shans Accessories PTY LTD',
                    "Item Purchased": item.item_name,
                    "Room": item.room_name || 'N/A',
                    "Quantity": quantity,
                    "Unit Price (R)": Math.round(unitPrice),
                    "Unit Cost (R)": Math.round(unitCost),
                    "Profit per Unit (R)": Math.round(profitPerUnit),
                    "Tax per Unit (R)": Math.round(parseFloat(item.tax_per_product) || 0),
                    "Total Value (R)": Math.round(totalRetailValue),
                    "Total Cost (R)": Math.round(totalCost),
                    "Total Profit (R)": Math.round(totalProfit),
                    "Total Tax (R)": Math.round(parseFloat(item.tax_per_product || 0) * quantity),
                    "Payment Method": sale.payment_method,
                    "Total Price (R)": Math.round(totalPrice)
                };
            })
        );
        
        // Create Excel file
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Sales ${monthYear}`);
        
        // Generate Excel buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        
        // Create filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Sales_Backup_${monthYear.replace(/\s+/g, '_')}_${timestamp}.xlsx`;
        const publicId = `sales_backups/${filename}`; // Keep the .xlsx extension in the publicId

        // Upload to Cloudinary (server-side with full credentials)
        const uploadResult = await cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                public_id: publicId,
                folder: 'sales_backups',
                tags: ['sales_backup', 'excel', monthYear.replace(/\s+/g, '_')],
                context: {
                    month: monthYear,
                    backup_date: new Date().toISOString(),
                    record_count: flattenedData.length
                }
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ 
                        error: 'Failed to upload to cloud storage',
                        details: error.message 
                    });
                }
                
                // Success response
                res.json({
                    success: true,
                    message: `Backup successful for ${monthYear}`,
                    filename: filename,
                    url: result.secure_url,
                    publicId: result.public_id,
                    recordCount: flattenedData.length,
                    uploadedAt: new Date().toISOString()
                });
            }
        );
        
        // Write the buffer to the upload stream
        uploadResult.end(excelBuffer);
        
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ 
            error: 'Backup failed', 
            details: error.message 
        });
    }
});

// GET endpoint to list all backups
router.get('/list-backups', authenticateUser, async (req, res) => {
    try {
        let result;
        try {
            // Try the search API first
            result = await cloudinary.search
                .expression('folder:sales_backups AND tags:sales_backup')
                .sort_by([{created_at: 'desc'}])
                .max_results(100)
                .execute();
        } catch (searchError) {
            console.log('Search API failed, trying admin API fallback:', searchError.message);

            // Fallback to admin API
            result = await cloudinary.api.resources({
                type: 'upload',
                resource_type: 'raw',
                prefix: 'sales_backups/',
                max_results: 100,
                tags: true,
                context: true
            });
        }

        const backups = result.resources.map(resource => {
            const filename = resource.public_id.split('/').pop();
            const finalFilename = filename.endsWith('.xlsx') ? filename : filename + '.xlsx';

            return {
                filename: finalFilename,
                url: resource.secure_url,
                uploadedAt: resource.created_at,
                size: resource.bytes,
                month: resource.context?.month || 'Unknown',
                recordCount: resource.context?.record_count || 'Unknown',
                backedUpBy: resource.context?.backed_up_by || 'Unknown'
            };
        });

        // Sort by created_at descending
        backups.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.json({ backups });

    } catch (error) {
        console.error('List backups error:', error);
        res.status(500).json({
            error: 'Failed to list backups',
            details: error.message
        });
    }
});

module.exports = router;
