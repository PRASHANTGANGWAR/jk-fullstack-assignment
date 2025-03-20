import { Injectable } from '@nestjs/common';
import { message } from '../helper/index';

@Injectable()
export class GoogleService {
    // Handles Google authentication response
    googleLogin(req) {
        // If no user data is found in the request, return an error message
        if (!req.user) {
            return message.googleAuthFailed;
        }

        // Return the authenticated user details
        return req.user;
    }
}
