import pg from 'pg';
import { configUrl } from '../config.js';

import userTable from './tables/users.js';
import groupTable from './tables/groups.js';
import userGroupsTable from './tables/userGroups.js';

const { Client } = pg;
const client = new Client(configUrl);

const initData = () => {
    const query = {
        text: `
        ${userTable}
        ${groupTable}
        ${userGroupsTable}
      `
    };

    client.connect();
    client.query(query, (err) => {
        if (err) {
            console.log(err);
        }
        client.end();
    });
};

export { initData };
