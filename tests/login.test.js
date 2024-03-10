const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Login API Tests', () => {
    it('should login with valid user credentials', async () => {
        const validCredentials = {
            login: 'admin',
            password: 'P@ssword2023'
        };
        
        const response = await request(app)
            .post('/auth/login')
            .send(validCredentials);
            
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('token');
    });

    it('should not login with invalid user credentials', async () => {
        const invalidCredentials = {
            login: 'bob',
            password: '123'
        };
        
        const response = await request(app)
            .post('/auth/login')
            .send(invalidCredentials);
            
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('error');
        expect(response.body.data.result).toMatch(/Login failed/);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});
