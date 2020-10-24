const userTable = `
  CREATE TABLE IF NOT EXISTS Users (
    id uuid DEFAULT uuid_generate_v4(),
    login VARCHAR ( 30 ) PRIMARY KEY,
    password VARCHAR ( 30 ) NOT NULL,
    age INTEGER CHECK (age >= 4 AND age <= 130),
    is_deleted BOOLEAN DEFAULT FALSE
  );
  
  INSERT INTO Users
  SELECT * FROM json_populate_recordset (NULL::Users,
    '[
      { "id": "b0324518-2d4f-4748-af8e-75096c5488fc", "login": "HarryPotter", "password": "7feefe", "age": 15, "is_deleted": false },
      { "id": "fc70cfa1-16fa-4f2e-9e57-3d9156dcd2bf", "login": "HermioneGranger", "password": "winterIsComing", "age": 15, "is_deleted": false },
      { "id": "edfe53ea-3ba2-4c6d-8266-dfb09fd74d17", "login": "DracoMalfoy", "password": "lalala", "age": 15, "is_deleted": false },
      { "id": "226bd3c0-fe98-4910-9747-fbcd5491aff9", "login": "SeverusSnape", "password": "password", "age": 35, "is_deleted": false },
      { "id": "e051fcab-1377-40a2-82c9-498abc455479", "login": "SusanBones", "password": "dw33r43", "age": 15, "is_deleted": false },
      { "id": "4b9f0610-1982-426e-b8b4-58cf155702bb", "login": "TerryBoot", "password": "drowssap", "age": 15, "is_deleted": false },
      { "id": "bd14c1ec-0b7a-40cc-a8e9-d92a50b0ce59", "login": "LavenderBrown", "password": "g45gdww", "age": 15, "is_deleted": false },
      { "id": "7a75a90f-1831-4045-9662-7a70ffaadd04", "login": "AlbusDumbledore", "password": "ewsfww", "age": 122, "is_deleted": false },
      { "id": "94071714-e465-4cfc-972d-4ed0cb553352", "login": "MinervaMcGonagall", "password": "qwedw", "age": 110, "is_deleted": false },
      { "id": "72056431-5398-41a1-9d64-909cd9367502", "login": "AngelinaJohnson", "password": "likeSummer", "age": 17, "is_deleted": false },
      { "id": "5cff2258-04b9-4c4a-9fc7-1a3b2489ca47", "login": "PansyParkinson", "password": "*7feefe", "age": 15, "is_deleted": false },
      { "id": "111f9913-1174-4306-91b4-1d47698408fb", "login": "PadmaPatil", "password": "winterIsComing", "age": 15, "is_deleted": false },
      { "id": "296b08a6-a7b3-41db-bc62-77fe93457a87", "login": "CedricDiggory", "password": "lalala", "age": 18, "is_deleted": false },
      { "id": "d9b097b1-3255-45ac-9550-ab2074a3ff76", "login": "MillicentBulstrode", "password": "password", "age": 35, "is_deleted": false },
      { "id": "e302bdcb-ccc7-48f2-9c73-29271c61a048", "login": "VincentCrabbe", "password": "dw33r43", "age": 15, "is_deleted": false },
      { "id": "d0244a5d-48e0-4943-be15-87b5eba1dd4c", "login": "MarcusFlint", "password": "drowssap", "age": 17, "is_deleted": false },
      { "id": "91deb927-909d-452b-b270-511cd196557a", "login": "NevilleLongbottom", "password": "g45gdww", "age": 15, "is_deleted": false },
      { "id": "7c640bfd-4200-45c4-96c8-bc3f90578174", "login": "RemusLupin", "password": "ewsfww", "age": 43, "is_deleted": false },              
      { "id": "a1151795-df73-4757-9cd1-83d5bcbe0ab6", "login": "CuthbertBinns", "password": "qwedw", "age": 130, "is_deleted": false },
      { "id": "18fda41b-b2d6-4606-a62a-49325a985daf", "login": "CharityBurbage", "password": "likeSummer", "age": 80, "is_deleted": false },              
      { "id": "4e199ff8-0e55-4bb0-b211-ce44fc688dfd", "login": "TheGreyLady", "password": "iWereCrown", "age": 130, "is_deleted": false }              
  ]')
  WHERE NOT EXISTS (SELECT * FROM Users);
`;

export default userTable;
