import pg from 'pg';
import { configUrl } from '../config.js';

const { Client } = pg;
const client = new Client(configUrl);

const user = () => {
    const query = {
        text: `
      CREATE TABLE IF NOT EXISTS Users (
        id uuid DEFAULT uuid_generate_v4(),
        login VARCHAR ( 30 ) UNIQUE NOT NULL,
        password VARCHAR ( 30 ) NOT NULL,
        age INTEGER CHECK (age >= 4 AND age <= 130),
        is_deleted BOOLEAN DEFAULT FALSE
      );
      
      INSERT INTO Users
      SELECT * FROM json_populate_recordset (NULL::Users,
        '[
          { "id": "b0324518-2d4f-4748-af8e-75096c5488fc", "login": "ann", "password": "*7feefe", "age": 77, "is_deleted": false },
          { "id": "fc70cfa1-16fa-4f2e-9e57-3d9156dcd2bf", "login": "john_snow", "password": "winterIsComing", "age": 5, "is_deleted": false },
          { "id": "edfe53ea-3ba2-4c6d-8266-dfb09fd74d17", "login": "twinki", "password": "lalala", "age": 13, "is_deleted": false },
          { "id": "226bd3c0-fe98-4910-9747-fbcd5491aff9", "login": "marySue", "password": "password", "age": 25, "is_deleted": false },
          { "id": "e051fcab-1377-40a2-82c9-498abc455479", "login": "ivoBobul", "password": "dw33r43", "age": 33, "is_deleted": false },
          { "id": "4b9f0610-1982-426e-b8b4-58cf155702bb", "login": "luckyOne", "password": "drowssap", "age": 40, "is_deleted": false },
          { "id": "bd14c1ec-0b7a-40cc-a8e9-d92a50b0ce59", "login": "joua", "password": "g45gdww", "age": 15, "is_deleted": false },
          { "id": "7a75a90f-1831-4045-9662-7a70ffaadd04", "login": "jort_hank", "password": "ewsfww", "age": 22, "is_deleted": false },
          { "id": "94071714-e465-4cfc-972d-4ed0cb553352", "login": "john2", "password": "qwedw", "age": 17, "is_deleted": false },
          { "id": "72056431-5398-41a1-9d64-909cd9367502", "login": "joanna", "password": "likeSummer", "age": 130, "is_deleted": false }
      ]')
      WHERE NOT EXISTS (SELECT * FROM Users);`
    };

    client.connect();
    client.query(query, (err) => {
        if (err) {
            console.log(err);
        }
        client.end();
    });
};

export { user };
