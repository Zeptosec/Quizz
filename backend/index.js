require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json()); // for parsing json
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "We're good to go!" });
});

mongoose.connect(process.env.MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'quiz',
}).then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`running on port ${process.env.PORT || 4000}!`);
    });
}).catch(err => {
    console.log(err);
});