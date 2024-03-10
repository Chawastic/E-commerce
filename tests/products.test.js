const request = require('supertest');
const app = require('../app');
const db = require('../models');

let token;
let productId;

describe('API tests with auth for product CRUD operations', () => {
    beforeAll(async () => {
        const validCredentials = {
            login: 'admin',
            password: 'P@ssword2023'
        };
        const loginResponse = await request(app)
            .post('/auth/login')
            .send(validCredentials);
        expect(loginResponse.statusCode).toBe(200);
        token = loginResponse.body.data.token;
    });

    it('POST /products - should create a product with the obtained token', async () => {
        const newProductData = {
            name: "New Product",
            description: "Product Description",
            price: 11,
            stockQuantity: 111,
            brandId: 3,
            categoryId: 1
        };
        const createProductResponse = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(newProductData);
        expect(createProductResponse.statusCode).toBe(200);
        productId = createProductResponse.body.data.newProduct.id;
    });

    it('GET /products - should retrieve all products including the newly created product and return status 200', async () => {
        const response = await request(app).get('/products');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.products).toEqual(expect.arrayContaining([expect.objectContaining({name: "New Product"})]));
    });

    it('PATCH /products/:id - update the product with a new description using token', async () => {
        const updatedProductData = {
            description: "New product descripton",
            price: 111
        };
        const updateProductResponse = await request(app)
            .patch(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProductData);
        expect(updateProductResponse.statusCode).toBe(200);
        expect(updateProductResponse.body.status).toBe('success');
        expect(updateProductResponse.body.data.updatedProduct.description).toBe(updatedProductData.description);
        expect(updateProductResponse.body.data.updatedProduct.price).toBe(updatedProductData.price);
    });

    it('DELETE /products/:id - delete the product using token', async () => {
        const deleteProductResponse = await request(app)
            .delete(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteProductResponse.statusCode).toBe(200);
        expect(deleteProductResponse.body.status).toBe('success');
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});
