const xlsx = require("node-xlsx").default;
const _ = require("lodash");
const fs = require("fs");

const USERS_TABLE = 
  {
      name: 'users',
      cols: 'first_name, last_name, phone, email, joined_at, club_id'
  }
const MEMBERSHIPS_TABLE = 
  {
      name: 'memberships',
      cols: 'user_id, start_date, end_date, membership_name'
  }

  const DB_NAME = "ar_db";
  const CLUB_ID = 2400;

const getUsersData = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
      const workSheetFromFile = xlsx.parse(filePath, {type: 'binary', cellDates: true, dateNF: 'mm/dd/yyy', raw: false});
      workSheetFromFile[0].data.splice(0, 1);
      return workSheetFromFile[0].data;
  } else {
    throw Error(`File does not exists: ${filePath}`);
  }
};

const zipToObj = (keys, array) => {
  return _.zipObject(keys, array);
};

const generateRowsAsObjs = (keys, multiDArray) => {
  const newArr = [];
  multiDArray.forEach((arr) => {
    newArr.push(zipToObj(keys, arr));
  });
  return newArr;
};

const generateSQLScripts = (data) => {
  let existingEmails = [];
  console.log(`USE ${DB_NAME}`);
  data.forEach((obj) => {
    if (checkForExistingEmail(existingEmails, obj.email)) {
      console.error("Email already exists. We cannot add this user!");
    } else {
        console.log(`INSERT INTO ${USERS_TABLE.name} (${USERS_TABLE.cols}) VALUES (${obj.first_name}, ${obj.last_name},${obj.phone}, ${obj.email}, ${obj.membership_start_date}, ${CLUB_ID})`);
        console.log(`INSERT INTO ${MEMBERSHIPS_TABLE.name} (${MEMBERSHIPS_TABLE.cols}) VALUES ((SELECT id FROM ${MEMBERSHIPS_TABLE.name} where email=${obj.email}), ${obj.membership_start_date}, ${obj.membership_end_date}, ${obj.membership_name})`);
     
      existingEmails.push(obj.email);
    }
  });
};

checkForExistingEmail = (existingEmails, emailToCheck) => {
  return existingEmails.find((email) => email === emailToCheck);
};

module.exports = {getUsersData, generateRowsAsObjs, generateSQLScripts };

