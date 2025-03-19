import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config(); // Load environment variables from .env file

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth Client ID
            clientSecret: process.env.GOOGLE_SECRET, // Google OAuth Client Secret
            callbackURL: `${process.env.BACKEND_URL}/google/redirect`, // URL where Google redirects after authentication
            scope: ['email', 'profile'], // Request access to email and profile information
        });
    }

    /**
     * This method is called when Google successfully authenticates the user.
     * It extracts relevant user details and passes them to the next middleware.
     *
     * @param accessToken - Token to access Google's API on behalf of the user
     * @param refreshToken - Token to refresh the access token (not used here)
     * @param profile - User profile information from Google
     * @param done - Callback function to pass the user data to the next step
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile; // Extract user details from the profile object

        // Create a user object with necessary details
        const user = {
            email: emails[0].value, // Extract email address
            firstName: name.givenName, // Extract first name
            lastName: name.familyName, // Extract last name
            picture: photos[0].value, // Extract profile picture URL
            accessToken, // Include access token
        };

        done(null, user); // Pass the user object to the authentication flow
    }
}
