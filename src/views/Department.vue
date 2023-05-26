<template>
    <div class="home">
        <Navbar></Navbar>
        <form class="m-5 d-flex justify-content-center align-items-center" @sumbit="prevent($event)">
            <input type="number" class="form-control w-75" v-model="id" name="dep" placeholder="Department ID" @keypress="prevent($event)">
        </form>
        <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-start align-items-center" :class="role">
            <div class="card bg-dark text-light shadow-lg h-50">
                <div class="row g-0">
                    <div class="col-lg-5 profile-data">
                        <div v-for="(val,key,index) in department" :key="key" :section="index"
                            :class="key + ' text-align-left row g-0'">
                            <div class="col-md-12">
                                <b>{{index >= 0 ? key != "" ? (key[0].toUpperCase() + key.slice(1,key.length)) : "": " "}}</b>
                            </div>
                            <div class="col-md-11" style="margin-bottom:20px;border-radius:3px;border:1px solid rgb(243 119 71 / 5%);padding:5px;" :style="val==' '?'display:none;':''">
                                {{index!=6?val:""}}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <b class="Comments"> Most Upvoted Comments </b>
                        <div class="comments-section list-group" style="max-height:50vh;overflow-y:scroll;">
                            <div v-for="(comm,index) in comments.slice(0,5)" :key="comm" :section="index" :id="index"
                                class="comment list-group-item d-flex justify-content-between"
                                :class="'bg-'+backgrounds[index%2]+' text-'+backgrounds[(index+1)%2]"
                                :style="'background-:'+colors[index%5]">
                                <div class="ms-2 me-auto w-100">
                                    <div class="fw-bold d-flex justify-content-between">{{comm.course_id }} : Votes => {{ comm.vote }} </div>
                                    <div class="commen">
                                        <span>  {{ comm.text }} </span>
                                        <span> {{ comm.cdate.match(/(\d+-\d+-\d+)/g)[0]}} </span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .instructor .NoComments{
        display:none;
    }
    .Department,
    .Comments {
        text-align:left;
        font-size: 1.8rem;
        margin-bottom: 20px;
        display: block;
    }

    .card {
        padding: 1rem;
        width:80%;
    }
    .comments-section{
        max-height:50vh;
        overflow-y:scroll;
    }
    .text-align-left {
        text-align: left !important;
    }
    .commen{
        display:grid;
        width:100% !important;
        grid-template-columns: repeat(7,1fr);
    }
    .commen *:nth-child(1){
        grid-column:1/span 4;
        text-align: left;
    }
    .commen *:nth-child(2){
        grid-column:5/span 2;
    }
    .commen *:nth-child(3){
        grid-column:7/span 1;
        text-align: right;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    .list-group-item{
        border-top-right-radius: 0!important;
        border-bottom-right-radius: 0!important;
    }
    
    /* Track */
    ::-webkit-scrollbar-track {
        background: #212529;
        border-radius: 2px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #eee;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import {
        Comments,
        Accounts,
        Sections
    } from '../../server'
    export default {
        name: 'Department',
        components: {
            Navbar
        },
        async created() {
            document.body.classList.remove('bg-light');
            document.body.classList.add('bg-dark');
            this.getDep();
        },
        methods: {
            prevent(e) {
                e.preventDefault();
                this.getDep();
            },
            async getDep(){
                let comments = await Comments.getComments({
                        id: "department",
                        dp_id : this.id
                    });
                let departmentData = await Sections.getDepartment({id:this.id});
                this.department.id = this.id;
                this.department.NoCourses = departmentData[0];
                this.department.NoSections = departmentData[1];
                this.department.Name = departmentData[2];
                this.comments = comments;
            }
        },
        data() {
            return {
                text: '',
                course: this.$route.query.course,
                section: this.$route.query.section,
                id: 1,
                colors: [
                    "#F0C329", "#F34A2D", "#78B429", "#107787", "#9555B2"
                ],
                backgrounds:[
                    'dark','light'
                ],
                department: {
                    Department: " ",
                    Name : " ",
                    id: 1,
                    NoCourses: "",
                    NoSections: "",
                },
                comments: []

            }
        }
    }
</script>