import { config } from 'dotenv';
config();
import app from './app.js';
import ordersRouter from './routes/orders.js'
app.use('/api/orders', ordersRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
