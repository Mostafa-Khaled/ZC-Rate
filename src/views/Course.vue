<template>
    <div class="home">
        <Navbar></Navbar>    
        <div class = "d-flex container flex-column min-vh-100 max-vw-80 justify-content-start align-items-center" :style="style">
            <Search/>
            <h5 class="text-light" v-if="sections.length"> {{course.toLocaleUpperCase()}} Sections : </h5>
            <p class="alert alert-danger w-75" v-else> Sorry Course Not Found  </p>
            <div v-for="(section,index) in sections" :key="index" :section="section.id" :class="`btn btn-outline-${colors[index%5]} text-light`" role="btn">
               <router-link :to="'/sections?course='+course+'&section='+section.section_id+'&sem='+section.semester+'&year='+section.sec_year" >
                   <span> Section : {{section.section_id}} </span>
                   <span> Instructor : {{section.f_name ? section.f_name : "No Instructor Assigned"}} {{section.l_name}} </span>
                   <span> Year : {{section.sec_year}} </span>
                   <span> Semster : {{section.semester}} </span>
               </router-link>
            </div>
        </div>
    </div>
</template>
<style scoped>
.d-flex{
    padding:2rem;
}
a{
    color: inherit;
}
.btn{
    text-decoration: null;
}
a:hover{
    color:beige !important;
}
@media only screen and (max-width: 680px)  {
    .btn > *:first-child{
        grid-template-columns: repeat(1,1fr) !important;
        grid-template-rows: repeat(4,1fr);
        text-align: left !important;
        font-size:0.9em;
    }
    .btn >*:first-child > *:nth-child(1){
        grid-column: 1/span 1 !important;
        grid-row: 1/span 1 !important;
    }
    .btn >*:first-child > *:nth-child(2){
        grid-column: 1/span 1 !important;
        grid-row: 2/span 1 !important;
    }
    .btn >*:first-child > *:nth-child(3){
        grid-column: 1/span 1 !important;
        grid-row: 3/span 1 !important;
    }
    .btn > *:first-child > *:nth-child(4){
        grid-column: 1/span 1 !important;
        grid-row: 4/span 1 !important;
    }
}
@media only screen and (min-width: 851px){
    h5{
        text-align: left !important;
        width:100%;
    }
}
@media only screen and (max-width: 850px) and (min-width:681px)  {
    .btn *{
        text-align: left !important;
    }
    .btn > *:first-child{
        grid-template-columns: repeat(3,1fr) !important;
        grid-template-rows: repeat(2,1fr);
        text-align: center;
        font-size:0.9em;
    }
    .btn >*:first-child > *:nth-child(1){
        grid-column: 1/span 1 !important;
        grid-row: 1/span 1 !important;
    }
    .btn >*:first-child > *:nth-child(2){
        grid-column: 2/span 2 !important;
        grid-row: 1/span 1 !important;
    }
    .btn >*:first-child > *:nth-child(3){
        grid-column: 1/span 1 !important;
        grid-row: 2/span 1 !important;
    }
    .btn > *:first-child > *:nth-child(4){
        grid-column: 2/span 2 !important;
        grid-row: 2/span 1 !important;
    }
}
.btn{
    width:100%;
    padding:0;
    margin:0.5rem;
}
.btn > *:first-child{
    display:grid;
    grid-template-columns: 15% 50% 15% 20%;
    width:100%;
    height:100%;
    padding:15px;
    text-decoration:none;
}
.btn >*:first-child > *:nth-child(1){
    grid-column: 1/span 1;
}
.btn >*:first-child > *:nth-child(2){
    grid-column: 2/span 1;
}
.btn >*:first-child > *:nth-child(3){
    grid-column: 3/span 1;
}
.btn > *:first-child > *:nth-child(4){
    grid-column: 4/span 1;
}
</style>
<style>
.search{
    display:none !important;
}
</style>
<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Search from '@/components/Search.vue'
import { Comments , Accounts, Sections } from '../../server'
export default {
    name : 'Course',
    components: {
         Navbar,
         Search
    },
    data(){
        return{
            //id: this.$route.params.id,
            course:this.$route.query.course?this.$route.query.course:' - ',
            colors:[
                "danger", "warning", "success" ,"primary", "light"
            ],
            sections: []
        }
    },
    computed:{
        style(){
            return 'grid-template-rows: repeat(' + this.sections.length + ',1fr)'
        }
    },
    mounted(){
        let ref = this;
        document.querySelector('label').classList.add('search');
        document.querySelector('input').addEventListener('keypress',function(e){
            if(e.code=="Enter"){
                setTimeout(function(){
                    ref.course = ref.$route.query.course?ref.$route.query.course:' - ';
                    ref.loadSections(ref.course);
                },500);
            }
        })
        document.body.classList.remove('bg-light');
        document.body.classList.add('bg-dark');
    },
    created(){
        this.loadSections(this.course);
    },
    methods:{
        async loadSections(course){
            this.sections = await Sections.getSections(course); 
            if(!this.$route.query.course){
                this.$router.push({name: 'NotFound'})
            }
        }
    }
}

</script>