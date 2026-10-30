const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initial Array storing items in memory
let items = [
    { id: 1, name: 'Book', price: 250 },
    { id: 2, name: 'Pen', price: 25 }
];
let nextId = 3;

// READ: Get all items (GET)
app.get('/api/items', (req, res) => {
    res.json(items);
});

// CREATE: Add a new item (POST)
app.post('/api/items', (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and Price are required' });
    }
    const newItem = { id: nextId++, name, price: Number(price) };
    items.push(newItem);
    res.status(201).json(newItem);
});

// UPDATE: Update an item (PUT)
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const item = items.find(i => i.id === id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    if (name) item.name = name;
    if (price !== undefined) item.price = Number(price);

    res.json(item);
});

// DELETE: Remove an item (DELETE)
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items = items.filter(i => i.id !== id);
    res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server strictly running on http://localhost:${PORT}`);
});