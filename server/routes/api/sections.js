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
router.get('/',async(req,res)=>{
    //await client.query("DELETE FROM Comment WHERE student_id = 201902422");await client.query("DELETE FROM VOTE WHERE student_id = 201902422") 
    //client.query("ALTER TABLE Comment ALTER COLUMN cdate TYPE timestamp ;110381856419370548497")
    //const results = await client.query(`SELECT DISTINCT *,coalesce(v.voted , 0) as voted,coalesce(r.student_id , 0) as reported, comment.comment_id,coalesce(comment.student_id, comment.student_id) as student_id FROM COMMENT  LEFT JOIN VOTE as v ON COMMENT.comment_id = v.comment_id and v.student_id = 201902422 LEFT JOIN REPORT as r ON Comment.comment_id = r.comment_id and r.student_id= 201902422 WHERE section_id = $1 AND course_id ILIKE $2 AND semester ILIKE $3 AND sec_year = $4 ORDER BY cdate`,[1,"CIE206","Spring",2020])
    //await client.query(`INSERT INTO Survey(course_id, section_id, semester, sec_year, q, q_num) VALUES('CIE205', 1, 'Fall', 2019, 'Did you like the course ? give reasons. ', 2)`)
    const results = await client.query("SELECT * FROM SURVEY")
    //const results = await client.query('SELECT DISTINCT Comment.*,ins_id FROM COMMENT,Section WHERE section.ins_id = 201900533 and comment.course_id = section.course_id')
    //const results = await client.query("SELECt * FROM REPORT")
    // const results = await client.query("SELECT *,coalesce(VOTE.voted , 0) as voted,coalesce(COMMENT.comment_id, COMMENT.comment_id) as comment_id,coalesce(COMMENT.student_id, COMMENT.student_id) as student_id FROM COMMENT  LEFT JOIN VOTE ON COMMENT.comment_id = VOTE.comment_id and COMMENT.student_id = VOTE.student_id ORDER BY cdate");
    res.send(results);
})
router.get('/department/data', async(req, res)=>{
  const courses = await client.query("SELECT count(course_name)as c FROM COURSE,DEPARTMENT WHERE COURSE.dp_id = DEPARTMENT.dp_id and DEPARTMENT.dp_id = $1 ",[req.query.id]);
  const sections = await client.query("SELECT count(DISTINCT Course.course_id )as s FROM COURSE,DEPARTMENT,SECTION WHERE Section.course_id = Course.course_id and COURSE.dp_id = DEPARTMENT.dp_id and DEPARTMENT.dp_id = $1 ",[req.query.id])
  const name = await client.query("SELECT dp_name FROM DEPARTMENT WHERE dp_id = $1",[req.query.id]);
  res.send([courses.rows[0].c?courses.rows[0].c:'',sections.rows[0]?sections.rows[0].s:'',name.rows[0]?name.rows[0].dp_name:'']);
})
router.get('/survey', async(req, res)=>{
  let results = await getSurvey(req.query);
  res.send(results);
})
router.post('/surveyAns', async(req, res)=>{
  answerSurvey(req.body);
  res.end("Added");
})
router.post('/survey/add', async(req, res)=>{
  addSurvey(req.body);
  res.end("Added");
})
router.get('/section',async(req,res)=>{
  let exists = await checkSection(req.query);
  res.send(exists)
})
router.get('/sections',async(req, res)=>{
    let course = req.query.course;
    let sections = await loadSections(course);
    res.send(sections);
})
router.get("/courses",async(req, res)=>{
    let courses = await loadCourses(req.query);
    res.send(courses);
})
router.get("/rate",async(req,res)=>{
    let size = Object.keys(req.query).length;
    let rate;
    if(size == 5){
        rate = await getRate(req.query);
        res.send(rate.rows[0]);
    }else if(size == 4){
        rate = await currentRate(req.query);
        let avg = 0;
        for(let i of rate.rows) avg += i.rate;
        res.send([avg/rate.rowCount]);
    }else{
        res.sendStatus(404);
    }
})
router.post('/rate',async(req, res)=>{
    rate(req.body);
    res.sendStatus(200);
})
router.get('/department',async(req, res)=>{
  let results = await client.query("SELECT * FROM DEPARTMENT");
  res.send(results);
})

// Course 

router.get('/course/add', async(req, res)=>{
  let results = await insertCourse(req.query);
  res.send(results);
})
// Course 

router.get('/course/update', async(req, res)=>{
  let results = await updateCourse(req.query);
  res.send(results);
})


router.get('/section/add', async(req, res)=>{
  let results = await insertSection(req.query);
  res.send(results);
})
router.get('/section/update', async(req, res)=>{
  let results = await updateSection(req.query);
  res.send(results);
})



async function checkSection(sectionData){
  let data = [];
  for(let prop of ["sec_year","semester","section_id","course_id"]) data.push(sectionData[prop]);
  let results = await client.query("SELECT * FROM SECTION WHERE sec_year = $1 AND semester = $2 AND section_id = $3 and course_id = $4", data);
  return results
}
async function loadSections(course){
  let query, results;
  console.log(course);
  if(course!="null"&&course!=null&&course){
    query = "SELECT SECTION.*, IDS.f_name, IDS.l_name FROM SECTION LEFT JOIN ( SELECT f_name,l_name,ins_id,Account.google_id FROM ACCOUNT JOIN INSTRUCTOR ON Account.google_id = Instructor.google_id  ) AS IDS ON SECTION.ins_id = IDS.ins_id WHERE course_id ILIKE $1";
    results = await client.query(query,[course]);
  }else{
    query = "SELECT * FROM SECTION";
    results = await client.query(query);
  }
  return results.rows;
}
async function loadCourses(data){
  let query, results;
  if(data.id == 'admin'){
    query = "SELECT * FROM COURSE"
    results = await client.query(query)
  }else{
    query = "SELECT * FROM COURSE WHERE course_id = $1"
    results = await client.query(query,[data.id])
  }
  return results.rows;
}
async function rate(sectionData){
    let data = [];
    for(let prop of ["sec_year","semester","section_id","course_id","id","rate"]) data.push(sectionData[prop]);
    const query = "INSERT INTO RATES VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(sec_year, semester, section_id, course_id, student_id) DO UPDATE SET rate = $6";
    await client.query(query,data);
    return;
}
async function getRate(sectionData){
    let data = [];
    for(let prop of ["sec_year","semester","section_id","course_id","id"]) data.push(sectionData[prop]);
    let query = "SELECT rate FROM RATES WHERE sec_year = $1 AND semester = $2 AND section_id = $3 AND course_id = $4 AND student_id = $5";
    let results = await client.query(query,data);
    return results;
}
async function currentRate(sectionData){
    let data = [];
    for(let prop of ["sec_year","semester","section_id","course_id"]) data.push(sectionData[prop]);
    let query = "SELECT rate FROM RATES WHERE sec_year = $1 AND semester = $2 AND section_id = $3 AND course_id = $4";
    let results = await client.query(query,data);
    return results;
}
async function getSurvey(sectionData){
    let query, results;
    let data = [];
    for(let prop of ["sec_year","semester","section_id","course_id"]) data.push(sectionData[prop]);
    if(sectionData.type == "ans"){
      query = "SELECT * FROM ANSWERS WHERE sec_year = $1 AND semester = $2 AND section_id = $3 AND course_id = $4";
      results = await client.query(query,data);
    }else{
      query = "SELECT * FROM Survey WHERE sec_year = $1 AND semester = $2 AND section_id = $3 AND course_id = $4";
      results = await client.query(query,data);
    }
    return results;
}
function answerSurvey(sectionData){
  let data = [];
  console.log(sectionData);
  for(let prop of ["sec_year","semester","section_id","course_id","q_num","student_id","answer"]) data.push(sectionData[prop]);
  let query = "INSERT INTO ANSWERS VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(course_id, section_id, semester, q_num, student_id, sec_year) DO UPDATE SET answer = $7";
  client.query(query,data);
}
async function addSurvey(sectionData){
  let data = [];
  for(let prop of ["sec_year","semester","section_id","course_id"]) data.push(sectionData[prop]);
  let quests = await client.query("SELECT * FROM SURVEY WHERE sec_year = $1 AND semester = $2 AND section_id = $3 and course_id = $4 ",data);
  let data_ = [quests.rows.length+1, sectionData.q];
  console.log(data,data_);
  let query = "INSERT INTO SURVEY VALUES($1,$2,$3,$4,$5,$6)";
  client.query(query,[...data,...data_]);
}

// Courses Functions 

async function insertCourse(courseData){
  let data = [ courseData.code, courseData.name, courseData.dep ];
  let query = "INSERT INTO COURSE VALUES($1 , $2, $3) RETURNING * ";
  await client.query(query, data, (err, res) => {
    if (err) {
      console.log(err.stack);
      return {rows:[]}
    } else {
      //console.log(res.rows[0])
    }
  })
  let res = await client.query("SELECT * FROM COURSE WHERE course_id = $1",[data[0]]);
  return res;
}
async function updateCourse(courseData){
  let data = [ courseData.code, courseData.name, courseData.dep ];
  let query = "UPDATE COURSE SET course_name = $2, dp_id = $3 WHERE course_id = $1";
  let error = 0;
  console.log(courseData);
  await client.query(query, data, (err, res) => {
    if (err) {
      error = 1;
      console.log(err.stack);
    }
  })
  let res = await client.query("SELECT * FROM COURSE WHERE course_id = $1",[data[0]]);
  console.log(res.rows)
  return error ? {rows:[]} : res;

}
async function insertSection(sectionData){
  let data = [ sectionData.year, sectionData.sem, sectionData.sec, sectionData.code, sectionData.ins?sectionData.ins:null ];
  let query = "INSERT INTO SECTION VALUES($1 , $2, $3, $4, $5) RETURNING * ";
  let error = 0;
  client.query(query, data, (err, res) => {
    if (err) {
      error = 1;
      console.log(err.stack);
    }
    return res;
  })
  let res = await client.query("SELECT * FROM SECTION WHERE sec_year = $1 AND semester = $2 AND section_id = $3 And course_id = $4",[data[0],data[1],data[2],data[3]]);
  return error ? {rows:[]} : res;
}
async function updateSection(sectionData){
  console.log(sectionData);
  let data = [ sectionData.year, sectionData.sem, sectionData.sec, sectionData.code, sectionData.ins?sectionData.ins:null ];
  let query = "UPDATE SECTION SET ins_id = $5 WHERE sec_year = $1 AND semester = $2 AND section_id = $3 AND course_id = $4  RETURNING * ";
  let error = 0;
  client.query(query, data, (err, res) => {
    if (err) {
      error = 1;
      console.log(err.stack);
    }
    return res;
  })
  let res = await client.query("SELECT * FROM SECTION WHERE sec_year = $1 AND semester = $2 AND section_id = $3 And course_id = $4",[data[0],data[1],data[2],data[3]]);
  return error ? {rows:[]} : res;
}

module.exports = router;

