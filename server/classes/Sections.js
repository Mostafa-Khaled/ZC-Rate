import axios from 'axios'
const url = "http://localhost:5000/api/sections/"
class Sections{
    // Check for Section
    static checkSection(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"section",{
            params : data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Get Sections
    static getSections(course = null){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"sections?course="+course);
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Get Courses
    static getCourses(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"courses",{
              params: data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Rate A Course
    static rate(sectionData){
      return axios.post(url+'rate', sectionData)
    }
    // Get Rating of a course 
    static getRate(sectionData){
        return new Promise(async (resolve, reject)=>{
            try{
              const res = await axios.get(url+"rate",{
                  params : sectionData
              });
              resolve(res.data);
            }catch(err){
              reject(err);
            }
        })
    }
    static editComment(comment, text){
      return axios.post(url,
        { action : "edit", comment, text })
    }
    // Delete Comment 
    static deleteComment(id){
      return axios.delete(`${url}${id}`);
    }
    // Department

    static getDepartment(dp_id){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"department/data",{
              params: dp_id
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }

    // Survey 

    // Get Survey Questions 

    static getSurvey(sectionData){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"survey",{
              params: sectionData
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }

    // Add survey 
    static addSurvey(data){
      return axios.post( url + 'survey/add' , data)
    }

    // Answer Survey
    static answerSurvey(data){
      return axios.post( url + 'surveyAns' , data)
    }

    // Department

    static getDepartments(){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"department");
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }

    // Add Course

    static insertCourse(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"course/add",{
            params: data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Add Course

    static updateCourse(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"course/update",{
            params: data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Insert Section
    static inserSection(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"section/add",{
            params: data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    static updateSection(data){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+"section/update",{
            params: data
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    static deleteSection(data){
      return axios.post(url+"section/delete",data);
    }
    static deleteCourse(data){
      return axios.post(url+"course/delete",data);
    }
  }

export default Sections;