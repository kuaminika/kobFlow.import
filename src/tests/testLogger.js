// testLogger.js
import LogTool from '../LogTool.js';

// Create a logger with some default context
const logger = new LogTool({ service: 'TestService', env: 'dev' });

// Test each logging method
logger.log('This is a general log message');
logger.info('This is an info message', { userId: 123 });
logger.error('This is an error message', { errorCode: 'E001' });
logger.warn('This is a warning message', { warningCode: 'W001' });
logger.critical('This is a critical message', { system: 'Payments' });
logger.trace('This is a trace message', { traceId: 'abc-123' });
logger.debug('This is a debug message', { debugData: { a: 1, b: 2 } });

console.log('All log methods tested successfully.');