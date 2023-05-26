<template>
    <div class="d-flex container flex-column min-vh-100 max-vw-80 justify-content-center align-items-center">
        <h1> 
            <div>
                <span class="black"> 4 </span>    
                <span class="cyan"> 0 </span>    
                <span class="black"> 4 </span>    
            </div>
        </h1>
        <p> {{message?message:'This page you requested is not found.'}} </p>
        <router-link to="/">
            <button @click="home" class="btn btn-primary">
                Home Page
            </button>
        </router-link>
    </div>
</template>
<style>
    .white{
        background:whitesmoke!important;
    }
</style>
<style scoped>
    .black{
        color : black;
    }
    .cyan{
        color : #02B7FF;
    }
    span:nth-child(2){
        padding:0;
    }
    span{
        max-width: 63px;
    }
    h1{
        font-size:8vw;
        font-weight: bold;
    }
    p{
        font-size:2vw;
        display:flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    button{
        width:15vw;
        align-self: center;
        font-weight: bold;
        font-size:1.5vw;
        padding:1em 1em;   
    }
</style>
<script>
export default {
    name:'NotFound',
    props:['msg'],
    data(){
        return{
            message: this.msg
        }
    },
    mounted(){
         document.body.classList.remove('bg-dark');
        document.body.classList.add('bg-light');
    },
    methods:{
        home(){
            document.body.classList.remove('white');
            document.body.classList.add('bg-dark');
        }
    }
}
</script>