<template>
    <div class="">
        <div class="collapse" id="comments">
            <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-center align-items-center">
                <div class="card bg-dark text-light shadow-lg h-50 w-75">
                    <div class="w-100 p-5 d-flex justify-content-center align-items-center">
                        <div class="dflex w-75 ">
                            <b class="Comments"> Comments </b>
                            <div class="comments-section list-group">
                                <div v-for="(comm,index) in comments" :key="comm" :section="index" :id="index"
                                    @dblclick="deleteComment(comm._id)"
                                    class="comment list-group-item d-flex justify-content-between"
                                    :class="'bg-'+backgrounds[index%2]+' text-'+backgrounds[(index+1)%2]">
                                    <div class="ms-2 me-auto w-100">
                                        <div class="fw-bold d-flex justify-content-between">{{comm.course_id }}
                                        </div>
                                        <div class="commen">
                                            <span> {{ comm.text }} </span>
                                            <span> {{ comm.cdate.match(/(\d+-\d+-\d+)/g)[0]}} </span>
                                            <a @click="deleteComment(comm.comment_id)">
                                                <font-awesome-icon icon="times" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form>
                                <div class="row g-3 m-5">
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" id="course-filter"
                                            placeholder="Course Code" v-model="courseFilter"
                                            @keypress="validateCourse($event)">
                                    </div>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control" id="section-filter"
                                            placeholder="Section Number" v-model="sectionFilter"
                                            @keypress="validateSection($event)">
                                    </div>
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
    .Profile,
    .Comments {
        text-align: left;
        font-size: 1.8rem;
        margin-bottom: 20px;
        display: block;
    }

    .card {
        padding: 1rem;
        width: 80%;
    }

    .comments-section {
        max-height: 50vh;
        overflow-y: scroll;
    }

    .text-align-left {
        text-align: left !important;
    }

    .commen {
        display: grid;
        width: 100% !important;
        grid-template-columns: repeat(7, 1fr);
    }

    .commen *:nth-child(1) {
        grid-column: 1/span 4;
        text-align: left;
    }

    .commen *:nth-child(2) {
        grid-column: 5/span 2;
    }

    .commen *:nth-child(3) {
        grid-column: 7/span 1;
        text-align: right;
        cursor: pointer;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    .list-group-item {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
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
    import {
        Comments,
    } from '../../server'
    export default {
        name: 'AComments',
        async created() {
            this.comments = await Comments.getComments({
                id: 'admin'
            });
        },
        methods: {
            validateSection(e) {
                let char = String.fromCharCode(e.keyCode)
                if (e.keyCode == 13) {
                    this.filterComments()
                    return true;
                } // Enter Key
                if (/^[0-9]+$/.test(char)) return true;
                else e.preventDefault();
            },
            validateCourse(e) {
                let char = String.fromCharCode(e.keyCode);
                let str = e.target.value.length;
                if (e.keyCode == 13) {
                    this.filterComments()
                    return true;
                }
                if (((str < 3) && !/[A-Za-z]/.test(char)) || (str == 3 && !/[a-zA-Z0-9]/.test(char)) || ((str >= 4) && !
                        /[0-9]/.test(char)) || str >= 7) {
                    e.preventDefault();
                    return false;
                }
                if (/^[A-Za-z0-9]+$/.test(char)) return true;
                else e.preventDefault();
            },
            async filterComments() {
                this.comments = await Comments.getComments({
                    id: 'admin',
                    course: this.courseFilter,
                    section: this.sectionFilter
                });
            },
            async deleteComment(id) {
                console.log(id)
                await Comments.deleteComment({
                    id: id
                });
                this.filterComments();
            }
        },
        data() {
            return {
                courseFilter: '',
                sectionFilter: '',
                comments:[],
                backgrounds: ['dark', 'light'],
            }
        }
    }
</script>