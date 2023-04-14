var mysql = require('mysql');
var db=mysql.createConnection({
    host:'localhost',
    user:'ohs9902',
    password:'xjr2796@',
    database:'healthManagement'
});
db.connect((err)=>{
    if(err){
        console.log('mysql 연결 실패:'+err.stack);
        return;
    }
    console.log('mysql 연동 성공');
});
module.exports = db;