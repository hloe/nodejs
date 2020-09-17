import pg from 'pg';
import { configUrl } from '../config.js';

const { Client } = pg;
const client = new Client(configUrl);

const group = () => {
    const query = {
        text: `
          CREATE TABLE IF NOT EXISTS Groups (
            id uuid DEFAULT uuid_generate_v4(),
            name VARCHAR( 30 ) UNIQUE NOT NULL,
            permission VARCHAR( 30 )[] NOT NULL
          );
          
          INSERT INTO Groups
          SELECT * FROM json_populate_recordset (NULL::Groups,
            '[
              { "id": "5ba15775-6b75-42c0-8503-d82777770220", "name": "Gryffindor", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES" ] },
              { "id": "65d64837-0025-401f-8bef-7eebe76b19cd", "name": "Hufflepuff", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES" ] },
              { "id": "d2a80682-767d-407a-9afd-b5f962f184f6", "name": "Ravenclaw", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES" ] },
              { "id": "48292509-c580-40bb-ac5f-6ce20afe76cc", "name": "Slytherin", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES" ] },
              { "id": "332fdaf4-3420-451c-a7a0-0ff1e64c5225", "name": "professors", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES", "DELETE" ] },
              { "id": "b82eea67-fd2b-47c1-9452-18ac3ae3645f", "name": "students", "permission": [ "READ", "WRITE", "SHARE", "UPLOAD_FILES" ] },
              { "id": "4e0b20df-c823-43c4-82ff-7612c79d5872", "name": "ghosts", "permission": [ "READ" ] }
          ]')
          WHERE NOT EXISTS (SELECT * FROM Groups);
      `
    };

    client.connect();
    client.query(query, (err) => {
        if (err) {
            console.error(err);
        }
        client.end();
    });
};

export { group };
