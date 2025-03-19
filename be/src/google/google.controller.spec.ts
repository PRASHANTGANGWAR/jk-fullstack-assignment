import { Test, TestingModule } from '@nestjs/testing';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { message } from '../helper/contant.message';
import { Response } from 'express';

describe('GoogleController', () => {
    let googleController: GoogleController;
    let googleService: GoogleService;
    let authService: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => { });

        const module: TestingModule = await Test.createTestingModule({
            controllers: [GoogleController],
            providers: [
                {
                    provide: GoogleService,
                    useValue: {
                        googleLogin: jest.fn().mockReturnValue({ email: 'test@example.com', firstName: 'Test', lastName: 'User' }),
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        checkUserExists: jest.fn().mockResolvedValue(false),
                        createUser: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mocked-jwt-token'),
                    },
                },
            ],
        }).compile();

        googleController = module.get<GoogleController>(GoogleController);
        googleService = module.get<GoogleService>(GoogleService);
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(googleController).toBeDefined();
    });

    it('should initiate Google authentication', async () => {
        const result = await googleController.googleAuth();
        expect(result).toEqual({ msg: message.googleAuthInitiated });
    });

    it('should handle Google authentication redirect', async () => {
        const req = {};
        const res = { redirect: jest.fn() } as unknown as Response;

        await googleController.googleAuthRedirect(req, res);

        expect(googleService.googleLogin).toHaveBeenCalledWith(req);
        expect(authService.checkUserExists).toHaveBeenCalledWith({
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
        });
        expect(authService.createUser).toHaveBeenCalled();
        expect(jwtService.sign).toHaveBeenCalledWith(
            { id: 1, email: 'test@example.com' },
            { expiresIn: '1h' }
        );
        expect(res.redirect).toHaveBeenCalledWith(
            `${process.env.FRONTEND_URL}?token=mocked-jwt-token&email=test@example.com`
        );
    });

    it('should redirect to login on error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => { });

        const req = {};
        const res = { redirect: jest.fn() } as unknown as Response;

        jest.spyOn(googleService, 'googleLogin').mockImplementation(() => {
            throw new Error('Google Auth Error');
        });

        await googleController.googleAuthRedirect(req, res);

        expect(res.redirect).toHaveBeenCalledWith(
            `${process.env.FRONTEND_URL}/login?error=ServerError`
        );
    });
});
