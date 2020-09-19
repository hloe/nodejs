const userGroupsTable = `
  CREATE TABLE IF NOT EXISTS UserGroups (
    id uuid DEFAULT uuid_generate_v4(),
    login VARCHAR ( 30 ) REFERENCES Users (login) ON UPDATE CASCADE ON DELETE CASCADE,
    groups VARCHAR ( 30 )[] NOT NULL
  );      
  
  INSERT INTO UserGroups
  SELECT * FROM json_populate_recordset (NULL::UserGroups,
        '[
          { "id": "c6a8acf9-51f6-4e12-9f50-c9e949752798", "login": "HarryPotter", "groups": [ "Gryffindor", "students" ] },
          { "id": "bd8a55ac-8b8e-485f-9c3e-51dde0160934", "login": "HermioneGranger", "groups": [ "Gryffindor", "students" ] },
          { "id": "09237aa7-5344-41d7-a339-dcdfc2eba142", "login": "DracoMalfoy", "groups": [ "Slytherin", "students" ] },
          { "id": "8eefe381-6d9f-4327-9b58-3d1cbe4fad65", "login": "SeverusSnape", "groups": [ "Slytherin", "professors" ] },
          { "id": "5babe569-f78f-4b09-924b-459da3a40255", "login": "SusanBones", "groups": [ "Hufflepuff", "students" ] },
          { "id": "cfbb29ae-f544-481c-ae63-d1c29bfd4094", "login": "TerryBoot", "groups": [ "Ravenclaw", "students" ] },
          { "id": "db644dcc-97f0-432c-95f0-598f5a6542be", "login": "LavenderBrown", "groups": [ "Gryffindor", "students" ] },
          { "id": "b52b5966-0404-475f-a1ca-dd433d323cf7", "login": "AlbusDumbledore", "groups": [ "professors" ] },
          { "id": "43f567b4-e93e-4ee9-9501-0653589ff044", "login": "MinervaMcGonagall", "groups": [ "Gryffindor", "professors" ] },
          { "id": "4829e163-a5aa-4c14-ab8d-17aa0eb4add2", "login": "AngelinaJohnson", "groups": [ "Gryffindor", "students" ] },
          { "id": "d99ca90a-3f5e-4cd5-a8b6-7e807dad4569", "login": "PansyParkinson", "groups": [ "Slytherin", "students" ] },
          { "id": "48c02936-0b96-4f44-ac6a-772d860f7603", "login": "PadmaPatil", "groups": [ "Ravenclaw", "students" ] },
          { "id": "049fa661-6057-4358-8588-7b5ce2523dd4", "login": "CedricDiggory", "groups": [ "Hufflepuff", "students" ] },
          { "id": "8532fb87-306b-42cf-8807-8950f4f4600b", "login": "MillicentBulstrode", "groups": [ "Slytherin", "students" ] },
          { "id": "90429b1b-1124-4fbf-a706-441c7f95b31b", "login": "VincentCrabbe", "groups": [ "Slytherin", "students" ] },
          { "id": "5dc11571-7abb-4054-96fd-dc1b998c8755", "login": "MarcusFlint", "groups": [ "Slytherin", "students" ] },
          { "id": "e096235d-797a-40e1-8ad0-b41fa0fe3b6a", "login": "NevilleLongbottom", "groups": [ "Gryffindor", "students" ]  },
          { "id": "58e3f974-cf0c-4d0f-9e26-551b092ee74d", "login": "RemusLupin", "groups": [ "Gryffindor", "professors" ]  },              
          { "id": "d47e9204-4f22-4619-a9a6-89e6d95a22d2", "login": "CuthbertBinns", "groups": [ "professors", "ghosts" ] },
          { "id": "c330d84d-7cd1-42d9-a2dd-61d1fb27a4b9", "login": "CharityBurbage", "groups": [ "Slytherin", "professors" ] },
          { "id": "6e5aae7f-1cb9-419e-ab6b-e5f9cd1f1002", "login": "TheGreyLady", "groups": [ "Ravenclaw", "ghosts" ] }
      ]')
  WHERE NOT EXISTS (SELECT * FROM UserGroups);
`;

export default userGroupsTable;
