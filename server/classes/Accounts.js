import axios from 'axios'
const url = "http://localhost:5000/"
const accounts = "api/accounts/"
class Accounts{
    static getAccount(id){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+accounts+"?google_id="+id);
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    static addAccount(accountData){
      return axios.post(url+accounts,accountData)
    }
    static getInstructors(){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+accounts+'instructors');
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    static crypt(string,type = 'hash',pass=""){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+accounts+'crypt'+"?type="+type+"&string="+string+"&pass="+pass);
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
}
export default Accounts;
