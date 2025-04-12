// frontend/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Define the base URL for the API
    const API_URL = 'https://shans-backend-1.onrender.com/api';

    // **Element References**
    // Add Product Modal Elements
    const addProductBlock = document.getElementById('addProductBlock');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopup = document.getElementById('closePopup');
    const addProductForm = document.getElementById('addProductForm');
    const colourTape = document.getElementById('colourTape');
    const colourTapeText = document.getElementById('colourTapeText');

    // Edit Product Modal Elements
    const editProductOverlay = document.getElementById('editProductOverlay');
    const closeEditPopup = document.getElementById('closeEditPopup');
    const editProductForm = document.getElementById('editProductForm');
    const editColourTape = document.getElementById('editColourTape');
    const editColourTapeText = document.getElementById('editColourTapeText');

    // Products Table and Status Message
    const productsTableBody = document.querySelector('#productsTable tbody');
    const statusMessage = document.getElementById('statusMessage');
    const searchInput = document.getElementById('searchInput');

    // Filter Menu Elements
    const filterCarBrand = document.getElementById('filterCarBrand');
    const filterProductCategory = document.getElementById('filterProductCategory');
    const filterCarModel = document.getElementById('filterCarModel'); // New
    const filterRoom = document.getElementById('filterRoom'); // New
    const filterColourTape = document.getElementById('filterColourTape'); // New

    // **Data Storage**
    let allProducts = []; // To store all fetched products

    // **Helper Functions**

    /**
     * Function to determine appropriate text color based on background color for readability
     * @param {string} hexcolor - The background color in hex format (e.g., "#FFFFFF")
     * @returns {string} - Returns 'black' or 'white' based on the background color
     */
    function getContrastYIQ(hexcolor){
        hexcolor = hexcolor.replace("#", "");
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(char => char + char).join('');
        }
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    // **Functions**

    /**
     * Function to open the Add Product modal
     */
    function openAddModal() {
        popupOverlay.style.display = 'flex';
        popupOverlay.setAttribute('aria-hidden', 'false');
    }

    /**
     * Function to close the Add Product modal
     */
    function closeAddModal() {
        popupOverlay.style.display = 'none';
        popupOverlay.setAttribute('aria-hidden', 'true');
        addProductForm.reset();
        colourTape.value = '#000000';
        colourTapeText.value = '#000000';
    }

    /**
     * Function to open the Edit Product modal
     * @param {Object} product - The product data to edit
     */
    function openEditModal(product) {
        editProductOverlay.style.display = 'flex';
        editProductOverlay.setAttribute('aria-hidden', 'false');

        // Prefill the form with product data
        document.getElementById('editItemCode').value = product.item_code;
        document.getElementById('editRoom').value = product.room_id;
        document.getElementById('editItemName').value = product.item_name;
        document.getElementById('editCarBrand').value = product.car_brand;
        document.getElementById('editCarModel').value = product.car_model;
        document.getElementById('editProductCategory').value = product.product_category;
        document.getElementById('editAvailableStock').value = product.available_stock;
        document.getElementById('editLocation').value = product.location;
        document.getElementById('editUnitRetailPrice').value = product.unit_retail_price;
        document.getElementById('editWholesalePrice').value = product.wholesale_price;
        document.getElementById('editUnitCost').value = product.unit_cost;
        document.getElementById('editSupplierCode').value = product.supplier_code;
        document.getElementById('editAdditionalComments').value = product.additional_comments || '';

        editColourTape.value = product.colour_tape;
        editColourTapeText.value = product.colour_tape;
    }

    /**
     * Function to close the Edit Product modal
     */
    function closeEditModal() {
        editProductOverlay.style.display = 'none';
        editProductOverlay.setAttribute('aria-hidden', 'true');
        editProductForm.reset();
        editColourTape.value = '#000000';
        editColourTapeText.value = '#000000';
    }

    /**
     * Fetch all rooms from the backend and populate the room dropdowns
     */
    async function fetchRooms() {
        try {
            const response = await fetch(`${API_URL}/rooms`);
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();

            const roomSelect = document.getElementById('room');
            const editRoomSelect = document.getElementById('editRoom');

            // Clear existing options except the first
            roomSelect.innerHTML = '<option value="">Select a room</option>';
            editRoomSelect.innerHTML = '<option value="">Select a room</option>';

            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = room.name;
                roomSelect.appendChild(option.cloneNode(true));
                editRoomSelect.appendChild(option.cloneNode(true));
            });
        } catch (error) {
            console.error('Error fetching rooms:', error);
            showStatusMessage('Failed to load rooms. Please try again later.', 'error');
        }
    }

    /**
     * Fetch all products from the backend and populate the products table
     */
    async function fetchProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const products = await response.json();
            allProducts = products; // Store all products

            renderProductsTable(allProducts);
            populateFilters(); // Populate filter options after fetching products
        } catch (error) {
            console.error('Error fetching products:', error);
            showStatusMessage('Failed to load products. Please try again later.', 'error');
        }
    }

    /**
     * Render the products table based on the provided products array
     * @param {Array} products - Array of product objects to display
     */
    function renderProductsTable(products) {
        // Clear existing table rows
        productsTableBody.innerHTML = '';

        // Populate table with products
        for (const product of products) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.item_code}</td>
                <td>${product.room_name}</td>
                <td>${product.item_name}</td>
                <td>${product.car_brand}</td>
                <td>${product.car_model}</td>
                <td>${capitalizeWords(product.product_category.replace(/_/g, ' '))}</td>
                <td>${product.available_stock}</td>
                <td><span style="display:inline-block;width:20px;height:20px;background-color:${product.colour_tape};border-radius:50%;"></span></td>
                <td>${product.location}</td>
                <td>${parseFloat(product.unit_retail_price).toFixed(2)}</td>
                <td>${parseFloat(product.wholesale_price).toFixed(2)}</td>
                <td>${parseFloat(product.unit_cost).toFixed(2)}</td>
                <td>${parseFloat(product.profit).toFixed(2)}</td>
                <td>${product.supplier_code}</td>
                <td>${product.additional_comments || ''}</td>
                <td class="actions-button">
                    <button class="edit-button" data-item-code="${product.item_code}" aria-label="Edit Product">&#9998;</button>
                    <button class="delete-button" data-item-code="${product.item_code}" aria-label="Delete Product">&#10006;</button>
                </td>
            `;

            productsTableBody.appendChild(row);
        }
    }

    /**
     * Function to capitalize words (for better display)
     * @param {string} str - The string to capitalize
     * @returns {string} - Capitalized string
     */
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Function to populate filter options dynamically
     */
    function populateFilters() {
        populateFilterOptions(filterCarBrand, 'car_brand');
        populateFilterOptions(filterProductCategory, 'product_category');
        populateFilterOptions(filterCarModel, 'car_model'); // New
        populateFilterOptions(filterRoom, 'room_name'); // New (assuming room_name is part of product data)
        populateColourTapeFilter(); // New for Colour Tape
    }

    /**
     * Helper function to populate a single filter dropdown
     * @param {HTMLElement} selectElement - The select element to populate
     * @param {string} key - The product attribute key to filter by
     */
    function populateFilterOptions(selectElement, key) {
        // Get unique values
        const uniqueValues = [...new Set(allProducts.map(product => product[key]).filter(value => value))].sort();

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = capitalizeWords(value.replace(/_/g, ' '));
            selectElement.appendChild(option);
        });
    }

    /**
     * Function to populate the Colour Tape filter with color swatches
     */
    function populateColourTapeFilter() {
        const uniqueColours = [...new Set(allProducts.map(product => product.colour_tape).filter(value => value))].sort();

        uniqueColours.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = capitalizeWords(color);

            // Set background color and text color for better visibility
            option.style.backgroundColor = color;
            option.style.color = getContrastYIQ(color);

            filterColourTape.appendChild(option);
        });
    }

    /**
     * Function to handle filter changes
     */
    function handleFilters() {
        const brand = filterCarBrand.value.toLowerCase();
        const category = filterProductCategory.value.toLowerCase();
        const model = filterCarModel.value.toLowerCase(); // New
        const room = filterRoom.value.toLowerCase(); // New
        const colour = filterColourTape.value.toLowerCase(); // New

        const query = searchInput.value.trim().toLowerCase();

        const filtered = allProducts.filter(product => {
            const matchesBrand = brand ? product.car_brand.toLowerCase() === brand : true;
            const matchesCategory = category ? product.product_category.toLowerCase() === category : true;
            const matchesModel = model ? product.car_model.toLowerCase() === model : true;
            const matchesRoom = room ? product.room_name.toLowerCase() === room : true;
            const matchesColour = colour ? product.colour_tape.toLowerCase() === colour : true;
            const matchesSearch = product.item_name.toLowerCase().includes(query);
            // Add more conditions as needed

            return matchesBrand && matchesCategory && matchesModel && matchesRoom && matchesColour && matchesSearch;
        });

        renderProductsTable(filtered);
    }

    /**
     * Handle the submission of the Add Product form
     * @param {Event} e - The form submission event
     */
    addProductForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            item_code: document.getElementById('itemCode').value.trim(),
            room_id: parseInt(document.getElementById('room').value),
            item_name: document.getElementById('itemName').value.trim(),
            car_brand: document.getElementById('carBrand').value.trim(),
            car_model: document.getElementById('carModel').value.trim(),
            unit_retail_price: parseFloat(document.getElementById('unitRetailPrice').value),
            wholesale_price: parseFloat(document.getElementById('wholesalePrice').value),
            unit_cost: parseFloat(document.getElementById('unitCost').value),
            supplier_code: document.getElementById('supplierCode').value.trim(),
            available_stock: parseInt(document.getElementById('availableStock').value),
            location: document.getElementById('location').value.trim(),
            colour_tape: document.getElementById('colourTape').value,
            product_category: document.getElementById('productCategory').value,
            additional_comments: document.getElementById('additionalComments').value.trim()
        };

        // Basic front-end validation
        if (!formData.item_code) {
            alert('Please enter an item code.');
            return;
        }

        if (isNaN(formData.room_id)) {
            alert('Please select a valid room.');
            return;
        }

        if (!formData.product_category) {
            alert('Please select a product category.');
            return;
        }

        // Send POST request to add product
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                showStatusMessage('Product added successfully!', 'success');
                addProductForm.reset();
                colourTape.value = '#000000';
                colourTapeText.value = '#000000';
                closeAddModal();
                // Refresh the products list
                fetchProducts();
            } else {
                const errorData = await response.json();
                showStatusMessage(`Error: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showStatusMessage('An error occurred while adding the product.', 'error');
        }
    });

    /**
     * Handle the submission of the Edit Product form
     * @param {Event} e - The form submission event
     */
    editProductForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect form data
        const item_code = document.getElementById('editItemCode').value;
        const formData = {
            room_id: parseInt(document.getElementById('editRoom').value),
            item_name: document.getElementById('editItemName').value.trim(),
            car_brand: document.getElementById('editCarBrand').value.trim(),
            car_model: document.getElementById('editCarModel').value.trim(),
            unit_retail_price: parseFloat(document.getElementById('editUnitRetailPrice').value),
            wholesale_price: parseFloat(document.getElementById('editWholesalePrice').value),
            unit_cost: parseFloat(document.getElementById('editUnitCost').value),
            supplier_code: document.getElementById('editSupplierCode').value.trim(),
            available_stock: parseInt(document.getElementById('editAvailableStock').value),
            location: document.getElementById('editLocation').value.trim(),
            colour_tape: document.getElementById('editColourTape').value,
            product_category: document.getElementById('editProductCategory').value,
            additional_comments: document.getElementById('editAdditionalComments').value.trim()
        };

        // Basic front-end validation
        if (isNaN(formData.room_id)) {
            alert('Please select a valid room.');
            return;
        }

        if (!formData.product_category) {
            alert('Please select a product category.');
            return;
        }

        // Send PUT request to update product
        try {
            const response = await fetch(`${API_URL}/products/${encodeURIComponent(item_code)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                showStatusMessage('Product updated successfully!', 'success');
                editProductForm.reset();
                editColourTape.value = '#000000';
                editColourTapeText.value = '#000000';
                closeEditModal();
                // Refresh the products list
                fetchProducts();
            } else {
                const errorData = await response.json();
                showStatusMessage(`Error: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            showStatusMessage('An error occurred while updating the product.', 'error');
        }
    });

    /**
     * Synchronize color input with text input for Add Product Form
     */
    if (colourTape && colourTapeText) {
        colourTape.addEventListener('input', function() {
            colourTapeText.value = colourTape.value;
        });

        colourTapeText.addEventListener('input', function() {
            if (/^#[0-9A-Fa-f]{6}$/.test(colourTapeText.value)) {
                colourTape.value = colourTapeText.value;
            }
        });
    } else {
        console.warn('Colour Tape elements are missing in the DOM.');
    }

    /**
     * Synchronize color input with text input for Edit Product Form
     */
    if (editColourTape && editColourTapeText) {
        editColourTape.addEventListener('input', function() {
            editColourTapeText.value = editColourTape.value;
        });

        editColourTapeText.addEventListener('input', function() {
            if (/^#[0-9A-Fa-f]{6}$/.test(editColourTapeText.value)) {
                editColourTape.value = editColourTapeText.value;
            }
        });
    } else {
        console.warn('Edit Colour Tape elements are missing in the DOM.');
    }

    /**
     * Function to show status messages
     * @param {string} message - The message to display
     * @param {string} type - 'success' or 'error'
     */
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }

    /**
     * Event listeners for opening and closing the modals
     */
    addProductBlock.addEventListener('click', openAddModal);
    closePopup.addEventListener('click', closeAddModal);
    closeEditPopup.addEventListener('click', closeEditModal);

    // Close modals when clicking outside the popup content
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closeAddModal();
        }
    });

    editProductOverlay.addEventListener('click', function(e) {
        if (e.target === editProductOverlay) {
            closeEditModal();
        }
    });

    /**
     * Event delegation for Edit and Delete buttons in the products table
     */
    productsTableBody.addEventListener('click', async function(e) {
        if (e.target.classList.contains('edit-button')) {
            const item_code = e.target.getAttribute('data-item-code');
            try {
                const response = await fetch(`${API_URL}/products/${encodeURIComponent(item_code)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const product = await response.json();
                openEditModal(product);
            } catch (error) {
                console.error('Error fetching product details:', error);
                showStatusMessage('Failed to load product details.', 'error');
            }
        }

        if (e.target.classList.contains('delete-button')) {
            const item_code = e.target.getAttribute('data-item-code');
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    const response = await fetch(`${API_URL}/products/${encodeURIComponent(item_code)}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        showStatusMessage('Product deleted successfully!', 'success');
                        fetchProducts();
                    } else {
                        const errorData = await response.json();
                        showStatusMessage(`Error: ${errorData.message}`, 'error');
                    }
                } catch (error) {
                    console.error('Error deleting product:', error);
                    showStatusMessage('An error occurred while deleting the product.', 'error');
                }
            }
        }
    });

    /**
     * Handle search input to filter products by name
     */
    searchInput.addEventListener('input', function(e) {
        handleFilters();
    });

    /**
     * Event listeners for filters
     */
    filterCarBrand.addEventListener('change', handleFilters);
    filterProductCategory.addEventListener('change', handleFilters);
    filterCarModel.addEventListener('change', handleFilters); // New
    filterRoom.addEventListener('change', handleFilters); // New
    filterColourTape.addEventListener('change', handleFilters); // New

    /**
     * Function to handle combined filter and search
     */
    // Removed duplicate handleFilters function to prevent conflicts

    /**
     * Initial fetching of rooms and products on page load
     */
    fetchRooms();
    fetchProducts();
});
