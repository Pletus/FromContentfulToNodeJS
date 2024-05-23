const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.BACK_END || 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server running in port http://localhost:${PORT}`));

  
