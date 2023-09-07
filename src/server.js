const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 1234;

// Статичні файли (HTML, CSS, JavaScript) будуть обслуговуватися з папки "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Обробка всіх запитів, які не знайдені у "dist/index.html"
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});