import pg from 'pg';
import { configUrl } from '../config.js';

const { Client } = pg;
const client = new Client(configUrl);

const user = () => {
    const query = {
    // TODO: to pass SELECT * FROM to get request
        text: `
      CREATE TABLE IF NOT EXISTS Users (
        id serial PRIMARY KEY,
        login VARCHAR ( 30 ) UNIQUE NOT NULL,
        password VARCHAR ( 30 ) NOT NULL,
        age INTEGER CHECK (age >= 4 AND age <= 130),
        is_deleted BOOLEAN DEFAULT FALSE
      );
      
      INSERT INTO Users
      SELECT * FROM json_populate_recordset (NULL::Users,
        '[
          { "id": 1, "login": "ann", "password": "*7feefe", "age": 77, "is_deleted": false },
          { "id": 2, "login": "john_snow", "password": "winterIsComing", "age": 5, "is_deleted": false },
          { "id": 3, "login": "twinki", "password": "lalala", "age": 13, "is_deleted": false },
          { "id": 4, "login": "marySue", "password": "password", "age": 25, "is_deleted": false },
          { "id": 5, "login": "ivoBobul", "password": "dw33r43", "age": 33, "is_deleted": false },
          { "id": 6, "login": "luckyOne", "password": "drowssap", "age": 40, "is_deleted": false },
          { "id": 7, "login": "joua", "password": "g45gdww", "age": 15, "is_deleted": false },
          { "id": 8, "login": "jort_hank", "password": "ewsfww", "age": 22, "is_deleted": false },
          { "id": 9, "login": "john2", "password": "qwedw", "age": 17, "is_deleted": false },
          { "id": 10, "login": "joanna", "password": "likeSummer", "age": 130, "is_deleted": false }
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
