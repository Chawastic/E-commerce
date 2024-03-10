const request = require('supertest');
const app = require('../app');
const db = require('../models'); 

let token;
let categoryId;

describe('API tests with authentication for category CRUD operations', () => {
    // Setting auth credentials to be able to test endpoints since they require admin access
    beforeAll(async () => {
        const validCredentials = {
            login: 'admin',
            password: 'P@ssword2023'
        };
        // Logging in with login route in /routes/auth
        const loginResponse = await request(app)
            .post('/auth/login')
            .send(validCredentials);
        // Getting token response so we can use it later on when testing post/patch/delete endpoints
        expect(loginResponse.statusCode).toBe(200);
        token = loginResponse.body.data.token;
    });

    // POST category test
    it('POST /category - create a category named "TEST_CATEGORY" with the token', async () => {
        const newCategoryData = {
            name: "TEST_CATEGORY",
        };

        const createCategoryResponse = await request(app)
            .post('/category')
            .set('Authorization', `Bearer ${token}`)
            .send(newCategoryData);

        expect(createCategoryResponse.statusCode).toBe(200);
        categoryId = createCategoryResponse.body.data.category.id;
    });

    // GET categories test
    it('GET /category - get all categories including "TEST_CATEGORY" and return status 200', async () => {
        const response = await request(app).get('/category');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.categories).toEqual(expect.arrayContaining([expect.objectContaining({name: "TEST_CATEGORY"})]));
    });

    // UPDATE categories test
    it('PATCH /category/:id - update "TEST_CATEGORY" with a new name using token', async () => {
        const updatedCategoryData = {
            name: "UPDATED_TEST_CATEGORY",
        };

        const updateCategoryResponse = await request(app)
            .patch(`/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedCategoryData);

        expect(updateCategoryResponse.statusCode).toBe(200);
        expect(updateCategoryResponse.body.data.updatedCategory.name).toBe(updatedCategoryData.name);
    });

    // DELETE categories test
    it('DELETE /category/:id - delete the "UPDATED_TEST_CATEGORY" usingtoken', async () => {
        const deleteCategoryResponse = await request(app)
            .delete(`/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteCategoryResponse.statusCode).toBe(200);
        expect(deleteCategoryResponse.body.status).toBe('success');
    });

    // Close database after tests have run
    afterAll(async () => {
        await db.sequelize.close();
    });
});
