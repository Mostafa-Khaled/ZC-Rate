<template>
    <div class="home">
        <Navbar></Navbar>
        <div class="d-flex flex-column w-100 h-100 justify-content-center align-items-center" :style="style">
            <div v-if="questions.length == 0 && userData && userData.role_ == 'student' "
                class="d-flex flex-column align-items-center justify-content-center card bg-dark shadow-lg p-5">
                <div class="alert alert-danger m-5 w-100">
                    This section has no survey questions.
                </div>
            </div>
            <div class="input-group mb-3 w-75"
                v-if="userData && userData.role_ == 'instructor' && userData.id == insID && questions.length < 3">
                <input type="text" name="" id="" class="form-control" v-model="surveyQ"
                    placeholder="Enter your question">
                <button class="btn btn-warning" @click="addQuestion()"> Add </button>
            </div>
            <div class="alert alert-warning" v-if="userData && userData.role_ == 'instructor' && userData.id != insID">
                Sorry you don't have the access to view or add questions to this course.
            </div>
            <div v-for="(question,index) in questions" :key="index" :section="index" class="questions mt-3 w-75">
                <div v-if="userData && userData.role_ == 'student'" class="accordion accordion-flush">
                    <div class="acc-question accordion-item shadow-lg" :style="'background-:'+colors[index%5]">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button text-light" :class="'bg-'+['primary','warning'][index%2]"
                                type="button" data-bs-toggle="collapse" :data-bs-target='"#collapse"+index'
                                aria-expanded="true" aria-controls="collapseOne">
                                Question {{index + 1}} : {{question}}
                            </button>
                        </h2>
                        <div :id='"collapse"+index' class="accordion-collapse collapse show"
                            aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <form class="input-group" @submit="answer($event,index+1)">
                                    <input type="text" name="answer" id=""
                                        :value="index<=answers.length?answers[index-1]:''" class="form-control"
                                        placeholder="Enter your answer" disabled required>
                                    <button class="btn btn-outline-primary" @click="activeAnswer($event,index+1)">
                                        <font-awesome-icon icon="edit">

                                        </font-awesome-icon>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
                <div v-else-if="userData && userData.id == insID">
                    <div class="d-flex flex-column justify-content-center align-items-space-between">
                        <h1 class="btn btn-primary mb-5"
                            style="padding:10px 0;font-size:1.4rem;font-weight:bold;cursor:initial;">
                            Question {{index + 1}} : {{question}}
                        </h1>
                    </div>
                </div>
            </div>
            <div class="button d-flex justify-content-space-between align-items-center" style="justify-content:space-evenly;">
                <router-link class="btn btn-success mt-5 p-3 w-10"
                :to="'/sections?course='+ section.course_id +'&sem='+section.semester+'&section='+section.section_id+'&year='+section.sec_year">
                <font-awesome-icon icon="reply" /> Back to section page
                </router-link>
                <button class="btn btn-primary mt-5 p-3" v-if="userData&&userData.role_=='instructor'&&userData.id==insID"  data-bs-toggle="modal" data-bs-target="#answers" > Show Answers </button>
            </div>
        </div>
        <div class="modal fade deps" id="answers" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Courses List</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex flex-column" style="overflow-y:scroll;max-height:50vh;">
                        <div v-for="(section, index) in questions" :key="index" style="text-align:left!important;">
                            Question ({{ index+1 }}) : {{answer.length>=index ? answers[index-1] : ''}}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    a {
        text-decoration: none;
    }

    div.container {
        grid-template-columns: 1fr;
        justify-content: center;
    }

    div.container>* {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .question {
        display: grid;
        margin: 10px 0;
        grid-template-columns: 1fr 8fr;
        border-radius: 2px;
        background: #107787;
        color: beige;
        font-weight: bold;
        padding: 2em;
        max-width: 80%;
        min-width: 80%;
    }

    .container div:first-child {
        transform: translateY(50px);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
    }

    .container div:first-child * {
        height: 100%;
        padding: 0 5px;
        border: none;
    }

    .container div:first-child input {
        flex-basis: 85%;
    }

    .container div:first-child button {
        flex-basis: 15%;
        font-size: 1.05em;
        border: none;
        cursor: pointer;
        background: #e8e827;
    }

    .container div:first-child button:hover {
        transition: 300ms;
        box-shadow: 5px 5px 10px inset rgba(255, 255, 0, 0.3);
        cursor: pointer;
    }

    .quest {
        display: flex;
        flex-flow: column;
    }

    .quest input {
        height: 100%;
        padding: 1em;
        width: 82%;
        margin-bottom: 1em;
    }
</style>
<script>
    // @ is an alias to /src
    import Navbar from '@/components/Navbar.vue'
    import {
        Sections,
        Accounts
    } from '../../server'
    export default {
        name: 'Survey',
        components: {
            Navbar,
            Accounts
        },
        data() {
            return {
                insID: this.$route.params.id,
                section: this.$route.query,
                userData: null,
                colors: [
                    "#F0C329", "#F34A2D", "#78B429", "#107787", "#9555B2"
                ],
                questions: [],
                answers: [],
                surveyQ: ""
            }
        },
        computed: {},
        methods: {
            answer(e, n) {
                e.preventDefault();
            },
            async addQuestion() {
                let data = Object.assign({}, this.section, {
                    q: this.surveyQ
                });
                console.log(data);
                Sections.addSurvey(data);
                this.loadSurvey();
            },
            activeAnswer(e, n) {
                let parent = e.target.parentNode;
                if (parent.children.length < 2) {
                    parent = parent.parentNode;
                }
                if (parent.children[0].disabled) {
                    parent.children[0].disabled = 0;
                } else {
                    let ans = parent.children[0].value;
                    Sections.answerSurvey(Object.assign({}, this.section, {
                        q_num: n,
                        answer: ans,
                        student_id: this.userData.id
                    }))
                    parent.children[0].disabled = 1;
                }
                e.preventDefault();
            },
            async loadSurvey(type = "") {
                this.questions = [];
                this.answers = [];
                let survey = await Sections.getSurvey(Object.assign({}, this.section, {
                    type: type
                }));
                let this_ = this;
                if (type == "ans") {
                    survey.rows.forEach(ans => {
                        this_.answers.push(ans.answer);
                    })
                } else {
                    survey.rows.forEach(question => {
                        this_.questions.push(question.q);
                    })
                }
            }
        },
        async mounted() {
            let ref = this.section;
            if (!ref.course || !ref.sem || !ref.year || !ref.section) {
                this.$router.push({
                    name: 'NotFound'
                });
            }
            this.section = {
                sec_year: ref.year,
                semester: ref.sem[0].toLocaleUpperCase() + ref.sem.slice(1, ref.sem.length),
                section_id: ref.section,
                course_id: ref.course.toLocaleUpperCase(),
            }
            this.loadSurvey();
            this.loadSurvey("ans");
        },
        async created() {
            let item = await Accounts.crypt("datahashing");
            let pass = "thedatahasdfasdnflasndlkfasld1sf";
            let userData = await Accounts.crypt(sessionStorage.getItem(item), "decrypt", pass);
            Object.assign(this.section, {
                id: userData.id
            });
            this.userData = userData;
            document.body.classList.remove('bg-light');
            document.body.classList.add('bg-dark');
            let exists = await Sections.checkSection(this.section);
            let sec = this.section;
            if (!exists.rows.length) {
                this.$router.push({
                    name: 'NotFound',
                    params: {
                        msg: 'Section Not Found.'
                    }
                })
            }
            let secData = await Sections.getSections(this.section.course_id);
            console.log(secData)
            this.insID = secData[0].ins_id;
        }

    }
</script>