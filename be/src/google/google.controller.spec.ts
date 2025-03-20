import { Test, TestingModule } from '@nestjs/testing';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('GoogleController', () => {
    let googleController: GoogleController;
    let googleService: GoogleService;
    let authService: AuthService;
    let jwtService: JwtService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GoogleController],
            providers: [
                {
                    provide: GoogleService,
                    useValue: {
                        googleLogin: jest.fn(),
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        checkUserExists: jest.fn(),
                        createUser: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockJwtToken'),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'jwtExpiry') return '3600s';
                            if (key === 'frontendUrl') return 'http://localhost:3000';
                            return null;
                        }),
                    },
                },
            ],
        }).compile();

        googleController = module.get<GoogleController>(GoogleController);
        googleService = module.get<GoogleService>(GoogleService);
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should handle Google Auth Redirect properly', async () => {
        const req = { user: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' } };
        const res = {
            redirect: jest.fn(),
        };

        googleService.googleLogin = jest.fn().mockReturnValue(req.user);
        authService.checkUserExists = jest.fn().mockResolvedValue(null);
        authService.createUser = jest.fn().mockResolvedValue({
            id: 1,
            email: 'test@example.com',
        });

        await googleController.googleAuthRedirect(req, res);

        expect(res.redirect).toHaveBeenCalledWith(
            `http://localhost:3000?token=mockJwtToken&email=test@example.com`
        );
    });

    it('should handle DB error and redirect to login with error', async () => {
        const req = { user: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' } };
        const res = {
            redirect: jest.fn(), // Mocking redirect function
        };

        googleService.googleLogin = jest.fn().mockReturnValue(req.user);
        authService.checkUserExists = jest.fn().mockRejectedValue(new Error('DB Error'));

        // Mock console.error to avoid logging during tests
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await googleController.googleAuthRedirect(req, res);

        // Assert that res.redirect was called with the expected URL
        expect(res.redirect).toHaveBeenCalledWith(
            `http://localhost:3000/login?error=ServerError`
        );

        // Restore console.error after the test
        consoleErrorSpy.mockRestore();
    });

});