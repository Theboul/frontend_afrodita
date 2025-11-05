/**
 * Servicio de logging centralizado
 * En desarrollo: muestra logs en consola
 * En producción: puede integrarse con Sentry, LogRocket, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  stack?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Mantener solo los últimos 100 logs

  /**
   * Log informativo
   */
  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  /**
   * Log de advertencia
   */
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  /**
   * Log de error
   */
  error(message: string, error?: any) {
    const stack = error?.stack || new Error().stack;
    this.log('error', message, error, stack);
    
    // En producción, aquí se enviaría a un servicio externo
    if (!this.isDevelopment) {
      this.sendToExternalService('error', message, error, stack);
    }
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  /**
   * Método privado para registrar logs
   */
  private log(level: LogLevel, message: string, data?: any, stack?: string) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      stack,
    };

    // Guardar en memoria
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remover el más antiguo
    }

    // Mostrar en consola solo en desarrollo
    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}] ${logEntry.timestamp.toLocaleTimeString()}:`;
      
      switch (level) {
        case 'error':
          console.error(prefix, message, data || '');
          if (stack) console.error(stack);
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        case 'info':
          console.info(prefix, message, data || '');
          break;
        case 'debug':
          console.debug(prefix, message, data || '');
          break;
      }
    }
  }

  /**
   * Enviar a servicio externo (Sentry, LogRocket, etc.)
   */
  private sendToExternalService(
    level: LogLevel,
    message: string,
    data?: any,
    _stack?: string
  ) {
    // TODO: Integrar con Sentry u otro servicio
    // Ejemplo con Sentry:
    // if (level === 'error') {
    //   Sentry.captureException(new Error(message), {
    //     extra: { data, stack },
    //   });
    // }
    
    // Por ahora, solo almacenamos localmente en producción
    try {
      const productionLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      productionLogs.push({ level, message, data, timestamp: new Date().toISOString() });
      
      // Mantener solo los últimos 50 logs en localStorage
      if (productionLogs.length > 50) {
        productionLogs.splice(0, productionLogs.length - 50);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(productionLogs));
    } catch (e) {
      // Ignorar errores de localStorage
    }
  }

  /**
   * Obtener todos los logs almacenados
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logs = [];
    if (!this.isDevelopment) {
      localStorage.removeItem('app_logs');
    }
  }
}

// Exportar instancia singleton
export const logger = new Logger();

// Exportar tipo para TypeScript
export type { LogEntry, LogLevel };
