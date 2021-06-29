const service = require('./services/service');

const FILE_PATH = process.argv.slice(2)[0]
const CLUB_KEYS= ['first_name', 'last_name', 'email', 'phone', 'membership_start_date', 'membership_end_date', 'membership_name'];

try{
    const users = service.getUsersData(FILE_PATH);
    const dataReadyToUse = service.generateRowsAsObjs(CLUB_KEYS, users);
    service.generateSQLScripts(dataReadyToUse);
}
catch (error){
    console.error(`Failed to generate SQL Queries, ${error}`);
}


