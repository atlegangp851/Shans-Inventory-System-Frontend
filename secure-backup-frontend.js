// Secure frontend implementation that calls backend endpoint
// Replace the current backup function with this secure version

// Configuration - only contains non-sensitive information
const BACKUP_CONFIG = {
    backupEndpoint: '/api/backup-sales-data', // Your backend endpoint
    listBackupsEndpoint: '/api/list-backups'
};

// Secure backup function that calls backend
async function backupMonthToCloudinary(monthYear, salesData) {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Disable button and show loading state
        button.disabled = true;
        button.textContent = 'Preparing...';
        showToast(`🔄 Preparing backup for ${monthYear}...`, 'info', 3000);
        
        // Get authentication token (implement based on your auth system)
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Authentication required. Please log in again.');
        }
        
        button.textContent = 'Uploading...';
        showToast(`📤 Uploading backup for ${monthYear} to cloud storage...`, 'info', 3000);
        
        // Send data to backend for secure processing
        const response = await fetch(BACKUP_CONFIG.backupEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // or however your auth works
            },
            body: JSON.stringify({
                monthYear: monthYear,
                salesData: salesData
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `Backup failed: ${response.statusText}`);
        }
        
        // Show success message
        showToast(
            `✅ Backup successful! File "${result.filename}" has been saved to cloud storage. ${result.recordCount} records backed up.`, 
            'success', 
            7000
        );
        console.log('Backup details:', result);
        
    } catch (error) {
        console.error('Backup failed:', error);
        
        // Handle specific error types
        if (error.message.includes('Authentication')) {
            showToast(`🔒 ${error.message}`, 'error', 8000);
        } else {
            showToast(`❌ Backup failed: ${error.message}. Please try again or contact support.`, 'error', 8000);
        }
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Function to list all available backups
async function listAvailableBackups() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        const response = await fetch(BACKUP_CONFIG.listBackupsEndpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch backups');
        }
        
        return result.backups;
        
    } catch (error) {
        console.error('Failed to list backups:', error);
        showToast(`❌ Failed to load backup list: ${error.message}`, 'error', 5000);
        return [];
    }
}

// Function to display backup history (optional feature)
async function showBackupHistory() {
    const backups = await listAvailableBackups();
    
    if (backups.length === 0) {
        showToast('📁 No backups found', 'info', 3000);
        return;
    }
    
    // Create a modal or section to display backup history
    const historyHtml = backups.map(backup => `
        <div class="backup-item">
            <strong>${backup.filename}</strong><br>
            Month: ${backup.month}<br>
            Uploaded: ${new Date(backup.uploadedAt).toLocaleString()}<br>
            Size: ${(backup.size / 1024).toFixed(1)} KB<br>
            <a href="${backup.url}" target="_blank" download>Download</a>
        </div>
    `).join('');
    
    // You can implement a modal or dedicated section to show this
    console.log('Backup History:', backups);
    showToast(`📋 Found ${backups.length} backup(s). Check console for details.`, 'info', 5000);
}

// Test connection function (updated for backend)
async function testCloudinaryConnection() {
    const button = document.getElementById('test-cloudinary');
    const originalText = button.textContent;
    
    try {
        button.disabled = true;
        button.textContent = 'Testing...';
        showToast('🔧 Testing backup system...', 'info', 3000);
        
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }
        
        // Test with a small sample data
        const testData = [{
            reference_number: 'TEST-001',
            date: new Date().toISOString(),
            billing_name: 'Test Client',
            billing_address: 'Test Address',
            billing_email: 'test@example.com',
            salesperson_name: 'Test User',
            company_name: 'Test Company',
            payment_method: 'Test',
            items: [{
                item_name: 'Test Item',
                room_name: 'Test Room',
                quantity: 1,
                total_price: 100,
                unit_price_excluding_tax: 100,
                unit_cost: 50,
                tax_per_product: 15
            }]
        }];
        
        const response = await fetch(BACKUP_CONFIG.backupEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                monthYear: 'Test Connection',
                salesData: testData
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Test failed');
        }
        
        showToast('✅ Backup system test successful! The system is ready to use.', 'success', 7000);
        console.log('Test backup created:', result);
        
    } catch (error) {
        console.error('Test failed:', error);
        showToast(`❌ Test failed: ${error.message}. Please check your setup.`, 'error', 8000);
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Export functions for use in your main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        backupMonthToCloudinary,
        listAvailableBackups,
        showBackupHistory,
        testCloudinaryConnection
    };
}
