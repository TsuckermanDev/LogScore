import { LogModel } from '../models/log.model.js';
import { TypeModel } from '../models/type.model.js';

export class LogService {
  static async createLog(logType, serverId, datetime, data) {
    // Get log type configuration
    const typeConfig = await TypeModel.findByServerAndType(serverId, logType);
    if (!typeConfig) {
      throw new Error('Log type not registered for this server');
    }
    
    // Calculate expiration date
    const datetimeObj = new Date(datetime);
    const expiresAt = new Date(datetimeObj);
    expiresAt.setDate(expiresAt.getDate() + typeConfig.expires);
    
    const logId = await LogModel.create(
      logType,
      serverId,
      datetime,
      expiresAt,
      data
    );
    
    return { success: true, logId };
  }

  static async createBatchLogs(logs) {
    const processedLogs = [];
    
    for (const log of logs) {
      const typeConfig = await TypeModel.findByServerAndType(log.serverId, log.logType);
      if (!typeConfig) {
        throw new Error(`Log type ${log.logType} not registered for server ${log.serverId}`);
      }
      
      const datetimeObj = new Date(log.datetime);
      const expiresAt = new Date(datetimeObj);
      expiresAt.setDate(expiresAt.getDate() + typeConfig.expires);
      
      processedLogs.push({
        logType: log.logType,
        serverId: log.serverId,
        datetime: log.datetime,
        expiresAt: expiresAt,
        data: log.data
      });
    }
    
    const logIds = await LogModel.createBatch(processedLogs);
    return { success: true, logIds };
  }

  static async searchLogs(filters) {
    const logs = await LogModel.search(filters);
    const total = await LogModel.count(filters);
    
    return {
      logs,
      total,
      page: Math.floor(filters.offset / filters.limit) + 1,
      totalPages: Math.ceil(total / filters.limit)
    };
  }

  static async getLogById(id) {
    const log = await LogModel.findById(id);
    if (!log) {
      throw new Error('Log not found');
    }
    return log;
  }

  static async formatLog(log) {
    const typeConfig = await TypeModel.findByServerAndType(log.serverId, log.logType);
    if (!typeConfig) {
      return null;
    }
    
    let formatted = typeConfig.format;
    
    // Replace data placeholders
    for (const [key, value] of Object.entries(log.data)) {
      formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    
    // Replace datetime placeholder - НАТИВНЫЙ JS
    const date = new Date(log.datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDatetime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    
    formatted = formatted.replace(/\{datetime\}/g, formattedDatetime);
    
    return formatted;
  }

  static async deleteLog(id) {
    const deleted = await LogModel.delete(id);
    if (!deleted) {
      throw new Error('Log not found');
    }
    return { success: true };
  }
}
