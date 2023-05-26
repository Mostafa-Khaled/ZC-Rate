const express = require('express');
const { Pool, Client } = require('pg');
const router = express.Router();
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
client.connect()
router.get('/',async(req, res)=>{
    const comments = await loadComments(req.query);
    res.send(comments);
})
router.post("/add",async(req, res)=>{
  addComment(req.body);
  res.end("ADD")
})
router.post("/edit",async(req, res)=>{
  editComment(req.body);
  res.end("ADD")
})
router.post('/vote',async(req, res)=>{
  updateVotes(req.body);
  res.end("hi");
})
router.post('/report',async(req, res)=>{
  reportComment(req.body);
  res.end("hi");
})
router.post('/delete',async (req,res)=>{
  deleteComment(req.body.id);
  res.end("hi");
})

async function loadComments(data){
  let query, results;
  if(data.course_id){
    query = "SELECT DISTINCT *,coalesce(v.voted , 0) as voted,coalesce(r.student_id , 0) as reported, comment.comment_id,coalesce(comment.student_id, comment.student_id) as student_id FROM COMMENT  LEFT JOIN VOTE as v ON COMMENT.comment_id = v.comment_id and v.student_id = $5 LEFT JOIN REPORT as r ON Comment.comment_id = r.comment_id and r.student_id = $5 WHERE section_id = $1 AND course_id ILIKE $2 AND semester ILIKE $3 AND sec_year = $4 ORDER BY cdate";
    results = await client.query(query,[data.section_id, data.course_id, data.semester, data.sec_year, data.id]);
    results = results.rows;
  }else{
    if(data.id == "admin"){
      query = "SELECT * FROM COMMENT";
      results = await client.query(query);
      results = results.rows
      results = results.filter( row => data.course ? row.course_id == data.course : row )
      .filter( row => data.section ? row.section_id == data.section : row )
      .filter( row => data.semester ? row.semester == data.semester : row );
    }else if(data.id == "instructor"){
      query = "SELECT DISTINCT Comment.*,ins_id FROM COMMENT,Section WHERE section.ins_id = $1 and comment.course_id = section.course_id "
      results = await client.query(query,[data.ins_id]);
      results = results.rows
    }else if(data.id == "department"){
      query = "SELECT DISTINCT Comment.* FROM COMMENT,Department,course WHERE department.dp_id = $1 and comment.course_id = course.course_id and course.dp_id = department.dp_id ORDER BY vote DESC "
      results = await client.query(query,[data.dp_id]);
      results = results.rows
    }else{
      query = "SELECT * FROM COMMENT WHERE student_id = $1";
      results = await client.query(query,[data.id]);
      results = results.rows;
    }
  }
  return results;
}
async function addComment(data){
  const query = "INSERT INTO COMMENT VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP)";
  const data_ = [];
  for(let i of ["comment_id","sec_year","semester","section_id","course_id","id","archived","num_reports","num_upvotes","text"]){ data_.push(data[i]); }
  let random = generateRandomID();
  let exists = await client.query("SELECT * FROM COMMENT WHERE comment_id = $1",[random]);
  while(exists.rows.length){
    random = generateRandomID();
    exists = await client.query("SELECT * FROM COMMENT WHERE comment_id = $1",[random]);
  }
  data_[0] = random;
  client.query(query , data_, (err,res)=>{
    if(err) throw err;
  })
}
async function editComment(data){
  const data_ = [];
  for(let i of ["text","id","comment_id","section_id","course_id","semester"]){ data_.push(data[i]); }
  let query = "UPDATE COMMENT SET text = $1 , cdate = current_timestamp WHERE student_id = $2 AND comment_id = $3 AND section_id = $4 AND course_id = $5 AND semester = $6";
  client.query(query,data_);
}
function generateRandomID(){
  let result = "";
  for(let i = 0; i < 15; i++){
    randoms = [random(48,57),random(65,90),random(97,122)];
    result += randoms[~~(Math.random()*3)];
  }
  return result;
}
function random(a,b){
  return String.fromCharCode(~~(Math.random()*(b-a+1))+a)
}
async function updateVotes(voteData){
  let data = [];
  for(let prop of ["comment_id","sec_year","semester","section_id","course_id","id","vote"]) data.push(voteData[prop]);
  const selectQuery = "SELECT vote FROM COMMENT WHERE COMMENT_ID = $1" // Select Comment ( vote column )
  const comment = await client.query(selectQuery,[data[0]]);

  const selectQuery2 = "SELECT voted FROM vote WHERE COMMENT_ID = $1 AND Student_id = $2" // Select from table (Votes) voted ( up or down )
  const exists = await client.query(selectQuery2,[data[0],data[5]]);

  let vote = data[6]; // vote from client 
  let oldVoted = exists.rows.length ? exists.rows[0].voted : 0; // check if voted set oldVoted = old vote or set to zero

  let noVotes = comment.rows[0].vote; 
  
  let original = noVotes - oldVoted; 


  let newVotes = oldVoted == vote ? original : original + vote ;
  let newVoted = oldVoted == vote ? 0 : vote;
  const updateQuery = "UPDATE COMMENT SET vote = $1 WHERE comment_id = $2";
  await client.query(updateQuery,[newVotes,data[0]]);
  const insertQuery = "INSERT INTO vote VALUES($1,$2,$3) ON CONFLICT (comment_id,student_id) DO UPDATE SET voted = $3 ";
  await client.query(insertQuery,[data[0],data[5],newVoted]);
 
}
async function reportComment(data){
  const selectQuery = "SELECT * FROM COMMENT WHERE comment_id = $1";
  const comment = await client.query(selectQuery, [data.comment_id]);
  const reportQuery = "Insert INTO report VALUES($1,$2)";
  //const deleteQuery = "DELETE FROM Comment WHERE comment_id = $1"
  const archiveQuery = "UPDATE COMMENT SET archived = 1 WHERE comment_id = $1 "
  let data_ = [];
  for(let prop of ["comment_id","sec_year","semester","section_id","course_id"]) data_.push(data[prop]);
  const updateQuery = "Update COMMENT SET num_reports = num_reports+1 WHERE comment_id = $1 AND section_id = $4 AND semester = $3 AND course_id = $5 AND sec_year = $2";
  if(comment.rows[0].num_reports >= 0){ // if the comment is reported equal or more than n reports
    await client.query(archiveQuery, [data.comment_id],async (err,res)=>{
      if(err) throw err;
    });
  }else{
    await client.query(updateQuery, data_,  async (err, res)=>{
      if(err) throw err;
      await client.query(reportQuery, [data.comment_id, data.id]);
    } )
  }
}
async function deleteComment(id){
  const query = "DELETE FROM COMMENT WHERE comment_id = $1";
  await client.query(query,[id]);
}
module.exports = router;
