const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('../middleware/auth'); 
const { Users, Roles } = require('../Models');
const express = require('express');
const request = require('supertest');

// Mock User model
jest.mock('../Models', () => {
    return {
        Users: {
            findByPk: jest.fn()
        },
        Roles: {}
    };
});

const app = express();
app.use(express.json());
app.use(authMiddleware); 

app.get('/protected', (req, res) => res.json({ message: 'Protected route accessed' }));
app.get('/admin', adminMiddleware, (req, res) => res.json({ message: 'Admin route accessed' }));

describe('Auth Middleware', () => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const mockUser = { id: 1, role: { role_name: 'user' } };
    let token;

    beforeAll(() => {
        token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('should allow access to protected route with valid token', async () => {
        Users.findByPk.mockResolvedValue(mockUser);

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Protected route accessed');
    });

    test('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/protected');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token d'authentification manquant ou invalide");
    });

    test('should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token invalide');
    });

    test('should return 401 if token is expired', async () => {
        const expiredToken = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: '0s' });

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token expiré');
    });

    test('should return 401 if user is not found', async () => {
        Users.findByPk.mockResolvedValue(null); 

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Utilisateur non trouvé');
    });

    test('should return 401 if token is malformed', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer '); // Malformed token

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token d'authentification manquant ou invalide");
    });

    test('should return 500 if there is an unexpected error in the middleware', async () => {
        Users.findByPk.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Erreur serveur lors de l'authentification");
    });

    // test('should throw an error if JWT_SECRET is not defined', () => {
    //     const originalSecret = process.env.JWT_SECRET;
    //     delete process.env.JWT_SECRET;

    //     expect(() => {
    //         jest.resetModules();
    //         require('../middleware/auth');
    //     }).toThrow('JWT_SECRET must be defined in environment variables');

    //     process.env.JWT_SECRET = originalSecret;
    // });

    test('should allow access to admin route for admin user', async () => {
        const adminUser = { id: 4, role: { role_name: 'admin' } };
        Users.findByPk.mockResolvedValue(adminUser);

        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin route accessed');
    });

    test('should deny access to admin route for non-admin user', async () => {
        const regularUser = { id: 1, role: { role_name: 'user' } };
        Users.findByPk.mockResolvedValue(regularUser);

        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Accès refusé, utilisateur non autorisé.');
    });

    // test('should deny access to admin route for unauthenticated user', async () => {
        
    //     app.use((req, res, next) => {
    //         req.user = undefined;
    //         next();
    //     });

    //     const response = await request(app)
    //         .get('/admin')

    //     expect(response.status).toBe(403);
    //     expect(response.body.message).toBe('Accès refusé, utilisateur non authentifié.');
    // });
});