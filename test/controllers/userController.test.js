// super test hace peticiones en los test
// tipo axios pero para hacer test
// simula hacer la petición
const request = require('supertest');
const app = require('../../server');
const userServices = require('../../services/UserServices');
// esto me permitirá conectarnos a la BD
const dbHandler = require('../db-handler');

// aquí estoy simulando mi servidor
// ya que al correr test, el server no debe estar encendido
const agent = request.agent(app);

beforeAll(async () => await dbHandler.connect());


afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

// esto es un Test Suite
describe('UserController', () => {

    // en este caso es muy poco probable que falle, porque siempre regresará un 200
    it('Esto debe devolver usuarios', async() => {
        const mockUser1 = {
            name: "test User",
            email: "testuser1@gmail.com",
            password: "test123"
        }

        const mockUser2 = {
            name: "test User",
            email: "testuser2@gmail.com",
            password: "test123"
        }

        await userServices.createUser(mockUser1);
        await userServices.createUser(mockUser2);

        // simulo hacer get a users
        // aquí estoy simulando hacer una petición como en react o postman
       const response = await agent.get('/users').expect(200);

       expect(response.body).toHaveLength(2);
       expect(response.body[0]._id).toBeTruthy();

    });

    it('Esto debe crear un usario', async () => {

        const response = await agent.post('/users')
        // field es el Form Data dentro de postman: key,value
            .field('email','testuser@gmail.com')
            .field('name','test user')
            .field('password','testPassword')
            .expect(201)

        expect(response.body.email).toBe('testuser@gmail.com');
        expect(response.body._id).toBeTruthy();
    });


    it('Esto no debería crear un usario', async () => {

        const response = await agent.post('/users')
        // field es el Form Data dentro de postman: key,value
            .field('name','test user')
            .field('password','testPassword')
            .expect(400)

            // con un console log puedo ver qué tiene dentro el response.body
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveProperty('email');
    });


})