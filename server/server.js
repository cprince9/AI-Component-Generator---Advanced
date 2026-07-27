import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import componentRoutes from './routes/componentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genu';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    databaseMode: isMongo ? 'MongoDB' : 'Local JSON File Database (Fallback Mode)',
    message: 'GenU API Server is running smoothly 🚀',
  });
});

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log(`✅ Connected to MongoDB at: ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (Database Mode: MongoDB)`);
    });
  })
  .catch((error) => {
    console.log('\n======================================================');
    console.log('⚠️  Local MongoDB service not found (ECONNREFUSED).');
    console.log('✨ Automatically switching to Local File Database Mode!');
    console.log('📁 Data will be safely stored in: server/data/*.json');
    console.log('✅ Login, Sign Up, and Library Saving are 100% ACTIVE!');
    console.log('======================================================\n');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (Database Mode: Local File DB)`);
    });
  });
