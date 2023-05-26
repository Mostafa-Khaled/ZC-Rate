import axios from 'axios'
const url = "http://localhost:5000/"
const comments = "api/comments/"
class Comments{
    // Get Comments
    static getComments(sectionData){
      return new Promise(async (resolve, reject)=>{
        try{
          const res = await axios.get(url+comments,{
            params : new Object(Object.assign({},sectionData))
          });
          resolve(res.data);
        }catch(err){
          reject(err);
        }
      })
    }
    // Insert Comment
    static insertComment(comment){
      return axios.post(url+comments+'add', comment)
    }
    // Update Comment Votes
    static updateVotes(voteData){
      return axios.post(url+comments + "vote", voteData )
    }
    static editComment(comment){
      return axios.post(url+comments+'edit', comment)
    }
    // Report Comment 
    static reportComment(data){
      return axios.post(url+comments+'report', data)
    }
    // Delete Comment 
    static deleteComment(id){
      console.log(id, "axios");
      return axios.post(url+comments+'delete', id);
    }
  }

export default Comments;