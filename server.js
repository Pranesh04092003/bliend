const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blind')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Schema
const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const Data = mongoose.model('Data', dataSchema);

// POST API - Create new data
app.post('/api/data', async (req, res) => {
    try {
        const newData = new Data(req.body);
        const savedData = await newData.save();
        res.status(201).json({
            success: true,
            data: savedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// GET API - Fetch all data
app.get('/api/data', async (req, res) => {
    try {
        const allData = await Data.find();
        res.status(200).json({
            success: true,
            count: allData.length,
            data: allData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET API - Fetch single data by ID
app.get('/api/data/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Data not found'
            });
        }
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
