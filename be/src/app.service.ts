import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a simple status message indicating that the application is running.
   * This can be useful for health checks.
   */
  getHello(): string {
    return 'Application running !!';
  }
}
