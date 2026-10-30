const apiBaseUrl = '/api/items';

const itemForm = document.getElementById('itemForm');
const itemIdInput = document.getElementById('itemId');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const itemsTableBody = document.getElementById('itemsTableBody');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

// Display temporary status messages
function showMessage(text) {
    messageDiv.textContent = text;
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
}

// Fetch all items from the REST API backend
async function fetchItems() {
    try {
        const res = await fetch(apiBaseUrl);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error fetching items:', err);
    }
}

// Render rows into the table
function renderTable(items) {
    itemsTableBody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <button class="btn-edit" onclick="editItem(${item.id}, '${item.name}', ${item.price})">Edit</button>
                <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        itemsTableBody.appendChild(tr);
    });
}

// Handle Form Submission (Create or Update)
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = itemIdInput.value;
    const name = nameInput.value;
    const price = priceInput.value;

    if (id) {
        // PUT Request (Update)
        await fetch(`${apiBaseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });
        showMessage('Item updated successfully');
    } else {
        // POST Request (Create)
        await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });
        showMessage('Item added successfully');
    }

    itemForm.reset();
    itemIdInput.value = '';
    submitBtn.textContent = 'Submit';
    fetchItems();
});

// Load item data into form for editing
function editItem(id, name, price) {
    itemIdInput.value = id;
    nameInput.value = name;
    priceInput.value = price;
    submitBtn.textContent = 'Update';
}

// DELETE Request
async function deleteItem(id) {
    await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
    showMessage('Item deleted successfully');
    fetchItems();
}

// Initial fetch on page load
fetchItems();