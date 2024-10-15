const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { validateUserCreation, validateUserLogin, validateClientCreation } = require('../middleware/validator');

const app = express();
app.use(bodyParser.json());

// Routes pour les tests
app.post('/api/auth/register', validateUserCreation, (req, res) => {
    res.status(201).send({ message: 'Utilisateur créé avec succès' });
});

app.post('/api/auth/login', validateUserLogin, (req, res) => {
    res.status(200).send({ message: 'Connexion réussie' });
});

app.post('/api/client/add', validateClientCreation, (req, res) => {
    res.status(201).send({ message: 'Client ajouté avec succès' });
});

// Tests
describe('User Creation Validation', () => {
    it('should fail if the email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ mail_user: 'invalid-email', password: 'validPassword123' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Email invalide', path: 'mail_user' })
        );
    });

    it('should fail if the password is too short', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ mail_user: 'test@example.com', password: '123' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Le mot de passe doit comporter entre 4 et 100 caractères', path: 'password' })
        );
    });

    it('should fail if the password exceeds maximum length', async () => {
        const longPassword = 'a'.repeat(101);
        const response = await request(app)
            .post('/api/auth/register')
            .send({ mail_user: 'test@example.com', password: longPassword });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Le mot de passe doit comporter entre 4 et 100 caractères', path: 'password' })
        );
    });

    it('should succeed with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ mail_user: 'valid@example.com', password: 'validPassword123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Utilisateur créé avec succès');
    });
});

describe('Client Creation Validation', () => {
    it('should fail if the client name is empty', async () => {
        const response = await request(app)
            .post('/api/client/add')
            .send({
                client_name: '',
                client_last_name: 'Doe',
                client_address: '123 Example St',
                client_phone_number: '1234567890',
                client_image_name: 'image.png',
                mail_user: 'valid@example.com', 
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Le nom du client doit comporter entre 1 et 100 caractères', path: 'client_name' })
        );
    });

    it('should fail if the client last name is empty', async () => {
        const response = await request(app)
            .post('/api/client/add')
            .send({
                client_name: 'Client Example',
                client_last_name: '',
                client_address: '123 Example St',
                client_phone_number: '1234567890',
                client_image_name: 'image.png',
                mail_user: 'valid@example.com', 
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Le nom de famille doit comporter entre 1 et 100 caractères', path: 'client_last_name' })
        );
    });

    it('should fail if the client address is empty', async () => {
        const response = await request(app)
            .post('/api/client/add')
            .send({
                client_name: 'Client Example',
                client_last_name: 'Doe',
                client_address: '',
                client_phone_number: '1234567890',
                client_image_name: 'image.png',
                mail_user: 'valid@example.com', 
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'L\'adresse du client doit comporter entre 1 et 255 caractères', path: 'client_address' })
        );
    });

    it('should fail if the client phone number is invalid', async () => {
        const response = await request(app)
            .post('/api/client/add')
            .send({
                client_name: 'Client Example',
                client_last_name: 'Doe',
                client_address: '123 Example St',
                client_phone_number: 'invalid-phone',
                client_image_name: 'image.png',
                mail_user: 'valid@example.com',
            });
    
        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: 'Le numéro de téléphone doit contenir uniquement des chiffres', path: 'client_phone_number' })
        );
    });

    it('should succeed with valid client data', async () => {
        const response = await request(app)
            .post('/api/client/add')
            .send({
                client_image_name: 'image.png',
                client_name: 'Client Example',
                client_last_name: 'Doe',
                client_phone_number: '0123456789',
                client_address: '123 Example St',
                mail_user: 'valid@example.com' 
            });
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Client ajouté avec succès');
    });
});
