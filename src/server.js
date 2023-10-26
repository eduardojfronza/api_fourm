const app = require('./app');
const port = app.get('port');

// Testar API
app.listen(port, () => console.log(`Run on port ${port}!`));