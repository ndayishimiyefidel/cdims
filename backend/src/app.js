const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const requestRoutes = require('./routes/requests');
const materialRoutes = require('./routes/materials');
const stockRoutes = require('./routes/stock');
const procurementRoutes = require('./routes/procurement');
const reportRoutes = require('./routes/reports');
const siteAssignmentRoutes = require('./routes/siteAssignments');
const siteRoutes = require('./routes/sites');
const storeRoutes = require('./routes/stores');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3000', // Allow direct API testing
    'http://localhost:3001', // Frontend
    'http://cyangugudims.com', // Production domain
    'https://cyangugudims.com', // Production domain with SSL
    'http://www.cyangugudims.com', // WWW subdomain
    'https://www.cyangugudims.com', // WWW subdomain with SSL
    'https://cdims-frontend.onrender.com', // Production frontend (if deployed)
    'https://cdims.onrender.com', // Production backend (if needed for testing)
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {return callback(null, true);}

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // In development, be more permissive
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CDIMS API Documentation',
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'CDIMS API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'CDIMS Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
    });
});

// Main API route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'CDIMS API is running',
        version: '1.0.0',
        endpoints: [
            '/api/auth',
            '/api/users',
            '/api/requests',
            '/api/materials',
            '/api/stock',
            '/api/procurement',
            '/api/reports',
            '/api/site-assignments',
            '/api/sites',
            '/api/stores',
            '/api/admin',
        ],
    });
});

// Backend route
app.get('/backend', (req, res) => {
    res.json({
        success: true,
        message: 'CDIMS Backend is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/site-assignments', siteAssignmentRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Database connection test
testConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CDIMS API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
