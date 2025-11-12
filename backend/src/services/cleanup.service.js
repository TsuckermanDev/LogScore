import { LogModel } from '../models/log.model.js';
import cron from 'node-cron';
import { config } from '../config/config.js';

export class CleanupService {
    static start() {
        console.log(`🧹 Starting cleanup service with cron: ${config.cleanup.cron}`);

        cron.schedule(config.cleanup.cron, async () => {
            try {
                console.log('🧹 Running cleanup task...');
                const deletedCount = await LogModel.deleteExpired();
                console.log(`✅ Cleanup completed. Deleted ${deletedCount} expired logs.`);
            } catch (error) {
                console.error('❌ Cleanup task failed:', error.message);
            }
        });
    }
}
