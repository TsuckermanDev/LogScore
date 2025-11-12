import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config/config.js';
import { createPool, testConnection } from './config/database.js';
import { DatabaseModel } from './models/database.model.js';
import { AdminModel } from './models/admin.model.js';
import { CleanupService } from './services/cleanup.service.js';

// Middleware
import { apiKeyMiddleware } from './middleware/apiKey.middleware.js';

// API Routes (для плагинов)
import serverRoutes from './routes/api/server.routes.js';
import typeRoutes from './routes/api/type.routes.js';
import logRoutes from './routes/api/log.routes.js';

// Web Routes (для веб-панели)
import authRoutes from './routes/web/auth.routes.js';
import apiKeyRoutes from './routes/web/apiKey.routes.js';
import statsRoutes from './routes/web/stats.routes.js';
import architectureRoutes from './routes/web/architecture.routes.js';
import settingsRoutes from './routes/web/settings.routes.js';
import webLogsRoutes from './routes/web/logs.routes.js';

// Create Fastify instances
const apiApp = Fastify({
    logger: {
        level: config.env === 'production' ? 'info' : 'debug'
    }
});

const webApp = Fastify({
    logger: {
        level: config.env === 'production' ? 'info' : 'debug'
    }
});

// Configure CORS
await apiApp.register(cors, {
    origin: config.cors.origin,
    credentials: config.cors.credentials
});

await webApp.register(cors, {
    origin: config.cors.origin,
    credentials: config.cors.credentials
});

// API App Routes (Port 3001) - для Minecraft плагинов
apiApp.register(async (instance) => {
    instance.addHook('preHandler', apiKeyMiddleware);

    instance.register(serverRoutes, { prefix: '/api/v1/servers' });
    instance.register(typeRoutes, { prefix: '/api/v1/types' });
    instance.register(logRoutes, { prefix: '/api/v1/logs' });
});

// Health check для API
apiApp.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'api' };
});

// Web App Routes (Port 3000) - для веб-панели
webApp.register(authRoutes, { prefix: '/api/auth' });
webApp.register(apiKeyRoutes, { prefix: '/api/api-keys' });
webApp.register(statsRoutes, { prefix: '/api/stats' });
webApp.register(architectureRoutes, { prefix: '/api/architecture' });
webApp.register(settingsRoutes, { prefix: '/api/settings' });
webApp.register(webLogsRoutes, { prefix: '/api/logs' });
webApp.register(serverRoutes, { prefix: '/api/servers' });
webApp.register(typeRoutes, { prefix: '/api/types' });

// Health check для Web
webApp.get('/api/health', async (request, reply) => {
    return { status: 'ok', service: 'web' };
});

// Root endpoint для Web
webApp.get('/', async (request, reply) => {
    return {
        name: 'LogScore Web API',
        version: '1.0.0',
        status: 'running'
    };
});

// Startup
async function start() {
    try {
        console.log('🚀 Starting LogScore...');
        console.log(`📝 Environment: ${config.env}`);

        // Initialize database
        console.log('🔌 Connecting to database...');
        createPool();
        await testConnection();

        // Initialize tables
        console.log('📊 Initializing database tables...');
        await DatabaseModel.initializeTables();

        // Create default admin
        console.log('👤 Creating default admin if not exists...');
        await AdminModel.createDefaultAdmin(
            config.defaultAdmin.login,
            config.defaultAdmin.password
        );

        // Start cleanup service
        console.log('🧹 Starting cleanup service...');
        CleanupService.start();

        // Start API server
        await apiApp.listen({
            port: config.api.port,
            host: config.api.host
        });
        console.log(`✅ API Server listening on http://${config.api.host}:${config.api.port}`);

        // Start Web server
        await webApp.listen({
            port: config.web.port,
            host: config.web.host
        });
        console.log(`✅ Web Server listening on http://${config.web.host}:${config.web.port}`);

        console.log('');
        console.log('🎮 LogScore is ready!');
        console.log(`📡 API Endpoint: http://localhost:${config.api.port}/api/v1`);
        console.log(`🌐 Web Panel: http://localhost:${config.web.port}`);
        console.log(`👤 Default Admin: ${config.defaultAdmin.login} / ${config.defaultAdmin.password}`);
        console.log('');

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
const shutdown = async (signal) => {
    console.log(`\n⚠️  Received ${signal}, shutting down gracefully...`);

    try {
        await apiApp.close();
        await webApp.close();
        console.log('✅ Servers closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start the application
start();
