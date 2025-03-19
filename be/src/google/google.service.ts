import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
    // Handles Google authentication response
    googleLogin(req) {
        // If no user data is found in the request, return an error message
        if (!req.user) {
            return 'No user from Google';
        }

        // Return the authenticated user details
        return req.user;
    }
}
