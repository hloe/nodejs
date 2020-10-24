import supertest from 'supertest';
import controller from './../../controller.js';
import jwt from 'jsonwebtoken';
import { secret } from '../../../config/config';

const request = supertest(controller);

describe('GroupController endpoints', () => {
    let jwtToken;

    beforeEach(async () => {
        const payload = {
            login: 'HarryPotter',
            password: '7feefe'
        };

        jwtToken = jwt.sign(payload, secret, { expiresIn: 120 });
    });

    it('GetAllGroups should send response with status code 200', async () => {
        const response = await request
            .get('/groups')
            .set('x-access-token', jwtToken);

        expect(response.status).toBe(200);
    });

    describe('GetGroupById endpoint', () => {
        it('should return group object when id is valid', async () => {
            const response = await request
                .get('/groups/5ba15775-6b75-42c0-8503-d82777770220')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(200);
            expect(response.text).toBe(JSON.stringify({
                'id': '5ba15775-6b75-42c0-8503-d82777770220',
                'name': 'Gryffindor',
                'permission': [
                    'READ',
                    'WRITE',
                    'SHARE',
                    'UPLOAD_FILES'
                ]
            }));
        });

        it('should return not found when id is not found', async () => {
            const response = await request
                .get('/groups/5ba15775-6b75-42c0-8503-d82777770227')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });

        it('should return "Bad request" when id is invalid', async () => {
            const response = await request
                .get('/groups/invalid_id')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });
    });

    describe('CreateOrUpdate endpoint', () => {
        it('should return "Bad Request when id is not valid', async () => {
            const response = await request
                .post('/groups/')
                .set('x-access-token', jwtToken)
                .send({
                    id: 'invalid_id',
                    name: 'ghosts'
                });

            expect(response.status).toBe(400);
        });

        it('should return "Bad Request when name is occupied', async () => {
            const response = await request
                .post('/groups/')
                .send({
                    id: 'cc21359e-c440-4b4f-84c1-596a7b26fb4d',
                    name: 'ghosts',
                    permission: ['READ', 'WRITE']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Group with such name exists already');
        });

        it('should create group when it does not exist and name is free', async () => {
            const response = await request
                .post('/groups/')
                .send({
                    id: '36023ae0-9a64-43f8-af70-cfb321e9d363',
                    name: 'fans',
                    permission: ['READ', 'WRITE']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(204);
        });
    });

    describe('DeleteGroup endpoint', () => {
        it('should return "Bad Request" when id is invalid', async () => {
            const response = await request
                .delete('/groups/invalid_id')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
        });

        it('should return "Not Found" when group does not exist', async () => {
            const response = await request
                .delete('/groups/f7a86163-e17a-400b-85f7-f9819482c7f5')
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });
    });

    describe('AddUsers endpoint', () => {
        it('should return "Bad Request" when array of users id is empty', async () => {
            const response = await request
                .post('/groups/add-users')
                .send({
                    groupId: '5ba15775-6b75-42c0-8503-d82777770220',
                    userIds: []
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Users array can not be empty');
        });

        it('should return "Bad Request" when group id is invalid', async () => {
            const response = await request
                .post('/groups/add-users')
                .send({
                    groupId: 'invalid_id',
                    userIds: ['edfe53ea-3ba2-4c6d-8266-dfb09fd74d17', '4b9f0610-1982-426e-b8b4-58cf155702bb']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Group id is not valid');
        });

        it('should return "Bad Request" when some of users id are invalid', async () => {
            const response = await request
                .post('/groups/add-users')
                .send({
                    groupId: '5ba15775-6b75-42c0-8503-d82777770220',
                    userIds: ['invalid_id', '4b9f0610-1982-426e-b8b4-58cf155702bb']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Some users id are not valid');
        });

        it('should return "Not Found" when group id does not exist', async () => {
            const response = await request
                .post('/groups/add-users')
                .send({
                    groupId: 'd8432fd4-6d43-4e5d-9c12-4337238e8b0d',
                    userIds: ['edfe53ea-3ba2-4c6d-8266-dfb09fd74d17', '4b9f0610-1982-426e-b8b4-58cf155702bb']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });

        it('should return "Not Found" when some users id do not exist', async () => {
            const response = await request
                .post('/groups/add-users')
                .send({
                    groupId: '5ba15775-6b75-42c0-8503-d82777770220',
                    userIds: ['edfe53ea-3ba2-4c6d-8266-dfb09fd74d17', '02f83a6c-c0d5-4270-93da-f7cc69bd92a7']
                })
                .set('x-access-token', jwtToken);

            expect(response.status).toBe(404);
        });
    });
});
