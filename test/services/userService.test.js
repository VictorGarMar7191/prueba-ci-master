const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const userService = require('../../services/UserServices');
const userModel = require('../../models/Users');

// antes de cualquier test que vayamos a hacer, nos conectamos al BD
beforeAll(async () => await dbHandler.connect());


afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

// voy a hacer test de User services
describe('User services', () => {
    // Quiero probar todo User Services

    // se puede usar it o test
    // cuando uso describe debe tener it adentro para decir que tiene casos
    // test también puede funcionar, pero son más aislados, es decir que
    // los resultados no dependen de otros casos

    // it va a ser cada test
    it('Debo poder crear un usuario', async() => {

        // expect(true).toBe(true);    // sólo es para probar que todo está funcionando
        // esto es un usuario fake
        const mockUser = {
            name: "test User",
            email: "testuser@gmail.com",
            password: "test123"
        }
         const userDb = await userService.createUser(mockUser);

         // ahora ya podemos hacer la aserción
         expect(mockUser.email).toBe(userDb.email);
         expect(userDb).toHaveProperty('_id');
    })

    it('Esto no debe generar un usuario', async() => {
        // toThrow sólo es para funciones síncronas, pero esta función es una promesa
        // así que debo esperar a que haga reject y haga un throw
        expect(async () => await userService.createUser()).rejects.toThrow();
    })

    it('Esto debe devolver un arreglo de usuarios', async() => {
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

        await userService.createUser(mockUser1);
        await userService.createUser(mockUser2);

        const users = await userService.findUsers();

        expect(users).toHaveLength(2);
        expect(users[0]).toHaveProperty('_id');
    })
})