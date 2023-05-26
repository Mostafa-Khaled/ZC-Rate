<template>
    <div class="">
        <div class="collapse" id="editCourse">
            <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-space-between align-items-center">
                <div class="row g-3">
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" data-bs-target="#deps-e">
                            Departments
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" @click="updateCourses()" data-bs-target="#courses-e">
                            Courses
                        </button>
                    </div>
                </div>
                <div class="modal fade deps" id="courses-e" tabindex="-1">
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
                                   <font-awesome-icon icon="edit" @click="edit(course.course_id)" data-bs-dismiss="modal"></font-awesome-icon>
                                   <font-awesome-icon icon="times" @click="deleteCourse()" data-bs-dismiss="modal"></font-awesome-icon>
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
                <div class="modal fade deps" id="deps-e" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Departments List</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body d-flex flex-column">
                                <div v-for="(dep, index) in departments" :key="index" style="text-align:left!important;">
                                   Department ( {{ dep.dp_id }} ) : {{ dep.dp_name }} 
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-dark text-light shadow-lg h-50 w-75">
                    <div class="w-100 p-5 d-flex justify-content-center align-items-center">
                        <div class="dflex w-75 ">
                            <div class="alert alert-success" v-if="error==-1"> Successfully Updated. </div>
                            <div class="alert alert-danger" v-else-if="error==1">  An error has occured. </div>
                            <form @submit="submit($event)">
                                <div class="row g-3 m-5">
                                    <div class="col-sm-12">
                                        <label for="course" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Course Code : </label>
                                        <input type="text" name="code" class="form-control" id="course-code-e"
                                            placeholder="Course Code" disabled
                                            @keypress="validateCourse($event)">
                                    </div>
                                    <div class="col-sm-12">
                                        <label for="cname" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Course Name : </label>
                                        <input type="text" name="name" class="form-control" id="cname-e"
                                            placeholder="Course Title"  required>
                                    </div>
                                    <div class="col-sm-12">
                                        <label for="dep" class="form-control" style="text-align:left;background:transparent;border:none;color:white;"> Department ID : </label>
                                        <input type="number" name="dep" class="form-control" id="dep-e"
                                            placeholder="Department ID" required>
                                    </div>
                                    <button class="btn btn-primary"> Edit Course </button>
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
        Sections
    } from '../../server'

    export default {
        name: "AEditCourse",
        data(){
            return{
                departments:[],
                courses: [],
                error:0,
            }
        },
        async created(){
            let deps = await Sections.getDepartments();
            let courses = await Sections.getCourses({ id: 'admin' });
            this.departments = deps.rows;
            this.courses = courses;
        },
        methods:{
            async updateCourses(){
                let courses = await Sections.getCourses({ id: 'admin' });
                this.courses = courses;
            },
            async edit(id){
                let course = await Sections.getCourses({id:id});
                let data = course[0];
                let $ = document.querySelectorAll('#editCourse input');
                //console.log(data, $)
                $[0].value = data.course_id;
                $[1].value = data.course_name;
                $[2].value = data.dp_id;
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
                let res = await Sections.updateCourse(Object.assign({},{code: document.querySelector('#course-code-e').value},courseData
                ));
                if(res.rows.length){
                    this.error = -1;
                }
            }
        }
    }
</script>