<template>
    <div class="">
        <div class="collapse" id="editSection">
            <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-space-between align-items-center">
                <div class="row g-3">
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" data-bs-target="#ins_e">
                            Instructors
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" @click="updateCourses()" data-bs-target="#sections_e">
                            Courses
                        </button>
                    </div>
                </div>
                <div class="modal fade deps" id="sections_e" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Courses List</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body d-flex flex-column" style="overflow-y:scroll;max-height:50vh;">
                                <div v-for="(section, index) in sections" :key="index" style="text-align:left!important;">
                                   {{ section.section_id }} - {{section.course_id}} -
                                   {{ section.semester}} - {{ section.sec_year }} 
                                   <font-awesome-icon icon="edit" @click="editS(section)" data-bs-dismiss="modal"></font-awesome-icon>
                                   <font-awesome-icon icon="times" @click="deleteSection()" data-bs-dismiss="modal"></font-awesome-icon>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade deps" id="ins_e" tabindex="-1">
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
                            <div class="alert alert-success" v-if="error==-1"> Successfully Updated. </div>
                            <div class="alert alert-danger" v-else-if="error==1">  An error has occured. </div>
                            <form @submit="submit($event)">
                                <div class="row g-3 m-5">
                                    <div class="col-sm-12 col-md-6">
                                        <label for="course" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Course Code : </label>
                                        <input type="text" name="code" class="form-control" id="course-code"
                                            placeholder="Course Code"
                                            @keypress="validateCourse($event)" disabled>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="sec" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Section ID : </label>
                                        <input type="text" name="sec" class="form-control" id="section-id"
                                            placeholder="Section ID" disabled>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="year" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Section Year : </label>
                                        <input type="text" name="year" class="form-control" id="syear"
                                            placeholder="Section Year"  disabled>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <label for="sem" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Semester : </label>
                                        <select class="form-control form-control-md" name="sem" disabled>
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
                                    <button class="btn btn-primary"> Update Section </button>
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
        name: "AEditSection",
        data(){
            return{
                instructors:[],
                courses: [],
                departments:[],
                sections:[],
                error:0,
            }
        },
        async created(){
            let ins = await Accounts.getInstructors();
            let deps = await Sections.getDepartments();
            let secs = await Sections.getSections();
            let courses = await Sections.getCourses({ id: 'admin' });
            this.instructors = ins.rows;
            this.departments = deps.rows;
            this.courses = courses;
            this.sections = secs;
        },
        methods:{
            async editS(section){
                let course = await Sections.getSections();
                let data = course;
                let $ = document.querySelectorAll('#editSection input');
                let sec = data.filter(e=>{
                    return e.course_id == section.course_id && e.section_id == section.section_id && e.semester == section.semester &&
                    e.sec_year == section.sec_year;
                })
                sec = sec[0];
                $[0].value = sec.course_id;
                $[1].value = sec.section_id;
                $[2].value = sec.sec_year;
                document.querySelector('#editSection Select').value = sec.semester;
                $[3].value = sec.ins_id;
            },
            async updateCourses(){
                let sections = await Sections.getSections();
                this.sections = sections;
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
                e.preventDefault();
                let courseData = {};
                let $ = document.querySelectorAll('#editSection input');
                $.forEach(q=>{
                    courseData[q.name] = q.value;
                })
                courseData["sem"]=  document.querySelector('#editSection Select').value
                this.error = 1;
                let res = await Sections.updateSection(courseData);
                console.log(res.rows);
                if(res.rows.length){
                    this.error = -1;
                }
            }
        }
    }
</script>