//import from supertest
const request = require('supertest');

//Importing server file
const app = require('../index');
const { response } = require('express');

//test token (for admin)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzdhNDRkYjE1ZGNiMDU4MmYyNjc3YSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkxMTY5MTd9.PW_sApOco2ixoGNxvPA6bIBllk43xGg802nIgvEM2_c'

//Describe (List of test cases)
describe('Testing API', () => {
    //testing '/test' api
    it('GET /test | Response with text', async () => {
        //request sending
        const response = await request(app).get('/test');

        //if its successful , status code
        expect(response.statusCode).toBe(200);

        //compare received test
        expect(response.text).toEqual('Test API is Working!...');
    })

    //get all products
    it('GET /api/product/get_all_products | Fetch all products', async () => {
        const response = await request(app).get('/api/product/get_all_products').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(201);
    })

    //Registration testing
    //1. sending request (With data)
    //2. expect: 201
    //3. If user already exists: handle accordingly
    //4: If not: success

    it('POST /api/user/create | Response with body', async () => {
        const response = await request(app).post('/api/user/create').send({
            "firstName": "John",
            "lastName": "Doe",
            "email": "John@gmail.com",
            "password": "123456"
        });

        //if condition:
        if(!response.body.success){
            expect(response.body.message).toEqual('User Already Exists!');
        } else{
            expect(response.body.message).toEqual('User Created Successfully!');
        }
    })

    //Login testing
    it('POST api/user/login | Response with body', async () => {
        const response = await request(app).post('/api/user/login').send({
            "email": "John@gmail.com",
            "password": "123456"
        });

        //if condition:
        if (!response.body.success) {
            expect(response.body.message).toEqual("User doesn't exist!!");
          } else {
            expect(response.body.message).toEqual("User Logged in Successfully");
            expect(response.body.userData.firstName).toEqual("John");
    }
    })
})
