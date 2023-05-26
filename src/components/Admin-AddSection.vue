<template>
    <div class="">
        <div class="collapse" id="addSection">
            <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-space-between align-items-center">
                <div class="row g-3">
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" data-bs-target="#ins">
                            Instructors
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" @click="updateCourses()" data-bs-target="#courses_">
                            Courses
                        </button>
                    </div>
                </div>
                <div class="modal fade deps" id="courses_" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Courses List</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body d-flex flex-column" style="overflow-y:scroll;max-height:50vh;">
                                <div v-for="(course, index) in courses" :key="index" style="text-align:left!important;">
                                   {{ course.course_id }} : {{ course.course_name}} 
                                   <br/>
                                   ----> Dep: ({{ departments[course.dp_id-1].dp_name }}) 
                                   <br/>
                                   -------------------------
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade deps" id="ins" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Instructors List</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body d-flex flex-column">
                                <div v-for="(inst, index) in instructors" :key="index" style="text-align:left!important;">
                                ( {{ inst.f_name }} {{ inst.l_name }} ) : {{ inst.ins_id }} 
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-dark text-light shadow-lg h-50 w-75" style="max-height:75vh;overflow-y:scroll;">
                    <div class="w-100 p-5 d-flex justify-content-center align-items-center">
                        <div class="dflex w-75 ">
                            <div class="alert alert-success" v-if="error==-1"> Successfully Added. </div>
                            <div class="alert alert-danger" v-else-if="error==1">  An error has occured. </div>
                            <form @submit="submit($event)">
                                <div class="row g-3 m-5">
                                    <div class="col-sm-12 col-md-6">
                                        <label for="course" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Course Code : </label>
                                        <input type="text" name="code" class="form-control" id="course-code"
                                            placeholder="Course Code"
                                            @keypress="validateCourse($event)" required>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="sec" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Section ID : </label>
                                        <input type="text" name="sec" class="form-control" id="section-id"
                                            placeholder="Section ID" required>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="year" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Section Year : </label>
                                        <input type="text" name="year" class="form-control" id="syear"
                                            placeholder="Section Year"  required>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="sem" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Semester : </label>
                                        <select class="form-control form-control-md" name="sem">
                                            <option>Fall</option>
                                            <option>Spring</option>
                                            <option>Summer</option>
                                        </select>
                                    </div>
                                    <div class="col-sm-12 col-md-12">
                                        <label for="ins" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Instructor ID : </label>
                                        <input type="text" name="ins" class="form-control" id="instructor-id"
                                            placeholder="Instructor ID">
                                    </div>
                                    <button class="btn btn-primary"> Add Section </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

</style>
<script>
    import {
        Sections, Accounts
    } from '../../server'

    export default {
        name: "AAddSection",
        data(){
            return{
                instructors:[],
                courses: [],
                departments:[],
                error:0,
            }
        },
        async created(){
            let ins = await Accounts.getInstructors();
            let deps = await Sections.getDepartments();
            let courses = await Sections.getCourses({ id: 'admin' });
            this.instructors = ins.rows;
            this.departments = deps.rows;
            this.courses = courses;
        },
        methods:{
            async updateCourses(){
                let courses = await Sections.getCourses({ id: 'admin' });
                this.courses = courses;
            },
            validateCourse(e) {
                let char = String.fromCharCode(e.keyCode);
                let str = e.target.value.length;
                if (e.keyCode == 13) {
                    return true;
                }
                if (((str < 3) && !/[A-Z]/.test(char)) || (str == 3 && !/[A-Z0-9]/.test(char)) || ((str >= 4) && !
                        /[0-9]/.test(char)) || str >= 7) {
                    e.preventDefault();
                    return false;
                }
                if (/^[A-Za-z0-9]+$/.test(char)) return true;
                else e.preventDefault();
            },
            async submit(e){
                let data = new FormData(e.target);
                let course = [...data];
                let courseData = {};
                for(let f of [...course]){ 
                    courseData[f[0]]= f[1]; 
                }
                e.preventDefault();
                this.error = 1;
                let res = await Sections.inserSection(courseData);
                console.log(res.rows);
                if(res.rows.length){
                    this.error = -1;
                }
            }
        }
    }
</script>