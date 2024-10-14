// authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth'); 
const { Users } = require('../Models');
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
});
