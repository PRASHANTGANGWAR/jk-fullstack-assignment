import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Defines this class as a controller
export class AppController {
  constructor(private readonly appService: AppService) { }

  /**
   * Handles GET requests to the root URL.
   * @returns A greeting message from the AppService.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello(); // Calls the service method to return a response
  }
}
