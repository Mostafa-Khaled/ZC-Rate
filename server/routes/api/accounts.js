const express = require('express');
const { Pool, Client } = require('pg');
const router = express.Router();
const crypto = require('crypto');
const connectionString = 'postgres://rmwbhopojlulnj:83c43890632dedd5269a86eda01ea9cf7f154a394f541bc658ac12b260ef0510@ec2-52-6-178-202.compute-1.amazonaws.com:5432/dam8ptcn1gu4bg';
let client;
async function connect(){
   client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
};
connect();
client.connect();
router.get('/',async(req, res)=>{
  let accounts = await getAccount(req.query.google_id);
  let data = accounts.rows.length ? accounts.rows[0] : [];
  res.send(data);
})
router.post('/',async(req, res)=>{
  addAccount(req.body);
  res.send("Done");
})
router.get('/instructors',async(req, res)=>{
  let result = await client.query("SELECT DISTINCT f_name, l_name, ins_id FROM INSTRUCTOR, ACCOUNT WHERE Instructor.google_id = ACCOUNT.google_id ");
  res.send(result);
})
router.get('/crypt',async(req, res)=>{
  let type = req.query.type;
  let result;
  if(type=="encrypt"){
    result = encrypt(req.query.string,req.query.pass)
  }else if(type=="decrypt"){
    result = decrypt(req.query.string,req.query.pass)
  }else{
    result = hash(req.query.string)
  }
  res.send(result);
})
async function getAccount(id){
  return client.query("SELECT * FROM ACCOUNT WHERE google_id = $1",[id]);
}
async function addAccount(accountData){
  if(!await doesExist(accountData.google_id)){
    data = [accountData.google_id,accountData.email,accountData.f_name,accountData.l_name,accountData.role_];
    await client.query("INSERT INTO ACCOUNT VALUES ($1,$2,$3,$4,$5)",data,(err, res)=>{
      if(err) throw err;
      if(data[4]=="student"){
        client.query("INSERT INTO STUDENT VALUES ($1,$2)",[accountData.id,accountData.google_id],(err,res)=>{
          if(err) throw err;
        })
      }else{
        client.query("INSERT INTO INSTRUCTOR VALUES ($1,$2)",[accountData.id,accountData.google_id],(err,res)=>{
          if(err) throw err;
        })
      }
    })
  }else{
    client.query("SELECT * FROM ACCOUNT WHERE google_id = $1",[accountData.google_id],(err,res)=>{
    })
  }
}
async function doesExist(id){
  let result =  await client.query("SELECT * FROM ACCOUNT WHERE google_id = $1",[id]);
  return result.rows.length
}
function hash(string,method = 'sha256',base = 'base64'){
  if(!string) return '';
  return crypto.createHash(method).update(string).digest(base);
}
function encrypt(string, passkey){
  let mykey = crypto.createCipheriv('aes-256-gcm', passkey,"thedatahasdwasdnflasndlkfasld1sf");
  let mystr = mykey.update(string, 'utf8', 'hex')
  mystr += mykey.final('hex');
  return mystr;
}
function decrypt(string, passkey){
  let mykey = crypto.createCipheriv('aes-256-gcm', passkey,"thedatahasdwasdnflasndlkfasld1sf");
  let mystr = mykey.update(string, 'hex', 'utf8');
  mystr += mykey.final('utf8');
  return mystr;
}
module.exports = router;