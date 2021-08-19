import { LoggerService } from '../../lib/services/logger.service';

describe('LoggerService', () => {
  it('should log', () => {
    const logger = new LoggerService();
    const logSpy = spyOn(logger, 'log');

    logger.log('title1', { content: 'test1' });
    logger.log('title2', { content: 'test2' });

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith('title1', { content: 'test1' });
    expect(logSpy).toHaveBeenCalledWith('title2', { content: 'test2' });
  });
});
