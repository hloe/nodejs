import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { secret } from '../../../config/config';

import controller from './../../controller.js';

const request = supertest(controller);

describe('UserController endpoints', () => {
    let jwtToken;

    beforeEach(async () => {
        const payload = {
            login: 'HarryPotter',
            password: '7feefe'
        };

        jwtToken = jwt.sign(payload, secret, { expiresIn: 120 });
    });

    describe('GetAllUsers endpoint', () => {
        it('GetAllUsers should send response with status code 200', async () => {
            const response = await request
                .get('/users/b0324518-2d4f-4748-af8e-75096c5488fc')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(200);
        });
    });

    describe('GetUserById endpoint', () => {
        it('should return user object when id is valid', async () => {
            const response = await request
                .get('/users/b0324518-2d4f-4748-af8e-75096c5488fc')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(200);
            expect(response.text).toBe(JSON.stringify({
                'id': 'b0324518-2d4f-4748-af8e-75096c5488fc',
                'login': 'HarryPotter',
                'password': '7feefe',
                'age': 15,
                'is_deleted': false
            }));
        });

        it('should return not found when id not found', async () => {
            const response = await request
                .get('/users/b0324518-2d4f-4748-af8e-75096c5488f8')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });

        it('should return "Bad Request" when id is invalid', async () => {
            const response = await request
                .get('/users/bad_id')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });
    });

    describe('GetUsersList endpoint', () => {
        it('shoud return "Bad Request" when limit is 0', async () => {
            const response = await request
                .get('/users/list/0/test')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });

        it('should return filtered array when length and pattern are set', async () => {
            const response = await request
                .get('/users/list/7/har')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(200);
            expect(response.text).toBe(JSON.stringify([
                {
                    'id': '18fda41b-b2d6-4606-a62a-49325a985daf',
                    'login': 'CharityBurbage',
                    'password': 'likeSummer',
                    'age': 80,
                    'is_deleted': false
                },
                {
                    'id': 'b0324518-2d4f-4748-af8e-75096c5488fc',
                    'login': 'HarryPotter',
                    'password': '7feefe',
                    'age': 15,
                    'is_deleted': false
                }
            ]));
        });
    });

    describe('CreateOrUpdate endpoint', () => {
        it('should return "Bad Request when id is not valid', async () => {
            const response = await request
                .post('/users/')
                .send({
                    id: 'invalid_id',
                    login: 'HarryPotter'
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });

        it('should return "Bad Request when login is occupied', async () => {
            const response = await request
                .post('/users/')
                .send({
                    id: 'dab4017c-0f16-4b14-9e29-f75e578ba572',
                    login: 'HarryPotter',
                    password: 'test28',
                    age: '23'
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
            expect(response.text).toBe('User with such login exists already');
        });

        it('should create user when it does not exist and login is free', async () => {
            const response = await request
                .post('/users/')
                .send({
                    id: 'bdbd669a-34f8-453c-aa36-ffd6b88e470d',
                    login: 'MarySue',
                    password: 'trest28',
                    age: '23'
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(204);
        });
    });

    describe('DeleteUser endpoint', () => {
        it('should return "Bad Request" when id is invalid', async () => {
            const response = await request
                .delete('/users/invalid_id')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });

        it('should return "Not Found" when user does not exist', async () => {
            const response = await request
                .delete('/users/881c96c0-44fd-4078-8dfa-64402a859301')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });
    });
});
