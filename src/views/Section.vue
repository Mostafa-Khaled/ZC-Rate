<template>
    <div class="home">
        <Navbar></Navbar>
        <div class="d-flex flex-column min-vh-100 max-vw-80 justify-content-start align-items-center">
            <div class="card bg-dark text-light shadow-lg h-50">
                <div class="row g-0">
                    <div class="col-lg-5 section-data">
                        <div v-for="(val,key,index) in sections[0]" :key="key" :section="index" :class="key">
                            <b>
                                {{index >= 1 ? userData&&userData.role_=='student' || key!="userRating" ? (key[0].toUpperCase() + key.slice(1,key.length)) : "" : " "}}</b>
                            {{index>=1?userData&&userData.role_=='student' || key!="userRating"?" : ":"":""}}{{index!=6?val:""}}
                            <div v-if="key=='userRating'&&userData&&userData.role_=='student'">
                                <ul>
                                    <li v-for="i in [1,2,3,4,5]" :key="i" :data-rate="i" :data-checked="n"
                                        @mouseover="check(i)" @mouseout="uncheck" @click="rate(i)">
                                        <font-awesome-icon :icon="['fas','star']" />
                                    </li>
                                </ul>
                            </div>
                            <div v-if="key=='currentRating'">
                                <ul>
                                    <li v-for="i in [1,2,3,4,5]" :key="i" :data-rate="i" :data-checked="0">
                                        <font-awesome-icon :icon="['fas','star']" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="userData&&userData.role_=='student'" class="add-comment">
                            <div class="input-group mb-3" style="padding-right:10px">
                                <input type="text" name="comment" id="add-comment" placeholder="Type a comment"
                                v-model="text" class="form-control" required autocomplete="off">
                                <button @click="addComment" class="btn btn-outline-warning" id="add-btn"> Add </button>
                            </div>
                        </div>
                        <div class="survey mb-3">
                            <router-link class="add-servy btn btn-primary"
                                :to="'/survey?course='+section.course_id+'&section='+section.section_id+'&sem='+section.semester+'&year='+section.sec_year"
                                v-if="userData&&userData.role_ == 'instructor'"> Add Survey </router-link>
                            <router-link class="answer-servy btn btn-primary"
                                :to="'/survey?course='+section.course_id+'&section='+section.section_id+'&sem='+section.semester+'&year='+section.sec_year"
                                v-else> Answer Survey </router-link>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <b class="Comments"> Comments </b>
                        <div class="alert alert-warning" v-if="sections[0].comments.length==0">
                            There is no comments in this section yet.
                        </div>
                        <div class="comments-section list-group">
                            <div v-for="(comm,index) in sections[0].comments" :key="comm" :section="index" :id="index"
                                class="comment list-group-item"
                                :class="'bg-dark text-warning border-warning'">
                                <!-- @contextmenu="deleteComment(comm._id)"  -->
                                <div class="c-votes">
                                    <div v-if="comm.student_id&&userData&&userData.role_=='student'" class="comment-votes">
                                        <font-awesome-icon icon="caret-square-up" :class="comm.voted > 0 ? 'green' : ''"
                                            @click="!disabled && updateVote(comm.comment_id,1)" />
                                        <font-awesome-icon icon="caret-square-down" :class="comm.voted < 0 ? 'red' : ''"
                                            @click="!disabled && updateVote(comm.comment_id,-1)" />
                                        <span :class="comm.vote ? comm.vote > 0 ? 'green' : 'red' : ''">
                                            {{comm.vote}}
                                        </span>
                                    </div>
                                </div>
                                <span style="color: #3c73a8;font-weight:bold;font-size:120%;">
                                    #{{index+1}} </span>
                                <span class="text"> {{ comm.text }} </span>
                                <span>
                                    {{ comm.cdate && comm.cdate.replace(/(T.*)/g,"") }}
                                </span>
                                <div v-if="userData&&userData.role_=='student'">
                                    <font-awesome-icon icon="edit" v-if="userData&&userData.id==comm.student_id"
                                        @click="makeEditableSpan(index,comm.comment_id)" />
                                    <font-awesome-icon icon="flag"
                                        v-else-if="getUserData&&getUserData.id!=comm.student_id&&!comm.reported"
                                        @click="reportComment(comm.comment_id)" />
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
    .userRating div {
        display: inline;
    }

    ul {
        display: flex;
        list-style: none;
    }

    li[data-checked="y"] {
        color: yellow;
    }

    li:not([data-checked="y"]) {
        color: white;
    }

    .home {
        align-items: center;
    }

    .comments-section>div>*:nth-child(3n) {
        color:#F0C329;
        font-weight:700;
    }

    .comment svg {
        cursor: pointer;
        transition: 300ms;
    }

    .comment svg:hover {
        color: rgb(247, 244, 113);
        transition: 300ms;
    }

    .comment svg.green:hover {
        color: seagreen;
        transition: 300ms;
    }
    .userRating,.currentRating{
        display:flex;
        justify-content: flex-start;
    }
    .comment svg.red:hover {
        color: tomato;
        transition: 300ms;
    }

    .title {
        font-weight: bold;
        font-size: 1.2em !important;
    }

    .title,
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
    .comment{
        display:grid;
        width:100% !important;
        grid-template-columns: repeat(8,1fr);
    }
    .comment *:nth-child(1){
        grid-column:1/span 1;
        text-align: left;
    }
    .comment *:nth-child(2){
        grid-column:2/span 1;
        grid-row: 1/span 2;
    }
    .comment *:nth-child(3){
        grid-column:3/span 3;
        justify-content: flex-start!important;
        text-align:left !important;
    }
    .comment *:nth-child(4){
        grid-column:6/span 2;
    }
    .comment *:nth-child(5){
        grid-column:8/span 1;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    .list-group-item{
        border-top-right-radius: 0!important;
        border-bottom-right-radius: 0!important;
    }
    .c-votes{
        display:flex;
        align-items:center;
    }
    .comment-votes{
        flex-basis:100%;
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
    .comment-votes > *:nth-child(1){
        grid-column: 1/span 1;
        grid-row: 1/span 1;
    }
    .comment-votes > *:nth-child(2){
        grid-column: 1/span 1;
        grid-row: 2/span 1;
    }
    .comment-votes > *:nth-child(3){
        display:flex;
        align-items: center;
        grid-column: 2/span 1;
        grid-row: 1/span 2;
    }
    .comments{
        display:none;
    }
    .comment>div:first-child div {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
    }
    .comment>* {
        grid-row: 1/span 2;
    }
    .comment>*:not(:first-child) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .comment .green {
        color: #13b722;
    }

    .comment .red {
        color: #e74c3c;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #F0C329;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #212121;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
<style>
    .text{
        grid-column:3/span 3;
        grid-row: 1/span 2;
        text-align: left;
    }
    .editField {
        height: 100%;
        width: 100%;
        background: #212121;
        border: none;
        font-weight: 300;
        color: #F0C329;
        text-align: center;
        padding: 0.2em;
    }
</style>
<style>
    .section-data {
            text-align: left !important;;
            border-right: 1px solid  #333;
            margin-right : 50px;
    }
    .section-data > div{
        margin:3px 0;
    }
    @media screen and (max-width:768px){
        body{
            overflow:scroll;
        }
        .section-data {
            border-right : 0;
            margin-right : 0;
            border-bottom: 1px solid  #333;
            margin-bottom : 50px;
        }
        .commen > span{
            font-size: 0.9em !important;
            font-weight:700;
        }
    }
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex';
    import {
        Comments,
        Accounts
    } from '../../server'
    import Sections from '../../server/classes/Sections';
    export default {
        computed: mapGetters(['isSigned', 'getUserData']),
        watches: {
            userRate(newValue) {
                let lis = document.querySelectorAll('li');
                for (let i = 0; i < newValue; i++) {
                    lis[i].setAttribute('data-checked', 'y');
                }
            }
        },
        name: 'Section',
        components: {
            Navbar
        },
        async created() {
            let ref = this.section;
            if(!ref.course||!ref.sem||!ref.year||!ref.section){
                this.$router.push({name:'NotFound'});
            }
            this.section = {
                sec_year: ref.year,
                semester: ref.sem[0].toLocaleUpperCase() + ref.sem.slice(1, ref.sem.length),
                section_id: ref.section,
                course_id: ref.course.toLocaleUpperCase(),
            }
            document.body.classList.remove('bg-light');
            document.body.classList.add('bg-dark');
            let course = await Sections.getCourses({id:this.section.course_id});
            let section = await Sections.getSections(this.section.course_id);
            let exists = await Sections.checkSection(this.section);
            let sec = this.section;
            if(!exists.rows.length){
                this.$router.push({name:'NotFound',params:{ msg : 'Section Not Found.' } } )
            }
            this.sections[0].instructor =
                (section[0].f_name != null ? section[0].f_name : "No") + " " + (section[0].l_name != null ? section[
                    0].l_name : "Instrcutor")
            this.sections[0].title = course[0].course_name;
            this.sections[0].code = course[0].course_id;
            this.sections[0].major = (course[0].course_id.match(/([a-zA-Z])+/g))[0];
            let item = await Accounts.crypt("datahashing");
            let pass = "thedatahasdfasdnflasndlkfasld1sf";
            let userData = await Accounts.crypt(sessionStorage.getItem(item), "decrypt", pass);
            Object.assign(this.section, {
                id: userData.id
            });
            this.sections[0].comments = await Comments.getComments(this.section);
            let rate = await Sections.getRate(this.section);
            this.userRate = rate.rate;
            this.userData = userData;
            let rating = await this.currentRate();
            this.check(rate.rate);
            this.check(rating, ".currentRating");
            this.rating = rating;
            let this_ = this;
            this.autoFetch = setInterval(async function () {
                this_.sections[0].comments = await Comments.getComments(this_.section);
            }, 2000)
        },
        methods: {
            prevent(e) {
                e.preventDefault();
            },
            makeEditableSpan(id, comm_id) {
                let ref = this;
                clearInterval(ref.autoFetch);
                ref.autoFetch = "";
                let span = document.querySelector(`div[id="${id}"] > span:nth-child(3)`);
                let editField = document.createElement('input');
                editField.classList += "editField"
                let spanEdit = document.createElement('span');
                editField.addEventListener("keypress", async function (e) {
                    console.log(e.key);
                    if (e.key == "Escape") {
                        console.log("Escape");
                        spanEdit.replaceWith(span);
                        ref.autoFetch = setInterval(async function () {
                            ref.sections[0].comments = await Comments.getComments(ref
                                .section);
                        }, 2000);
                    } else if (e.key == "Enter") {
                        let data = Object.assign({}, {
                            student_id: ref.userData.id
                        }, ref.section, {
                            text: editField.value
                        }, {
                            comment_id: comm_id
                        });
                        Comments.editComment(data);
                        setTimeout(async function () {
                            ref.sections[0].comments = await Comments.getComments(ref.section);
                        }, 2000)
                        ref.autoFetch = setInterval(async function () {
                            ref.sections[0].comments = await Comments.getComments(ref.section);
                        }, 2000);
                    }
                })
                editField.type = "text";
                editField.value = span.textContent;
                spanEdit.classList += "text";
                spanEdit.appendChild(editField);
                span.replaceWith(spanEdit);
                editField.focus();
            },
            async addComment() {
                let comment = Object.assign({}, this.section, {
                    comment_id: "",
                    archived: 0,
                    num_reports: 0,
                    num_upvotes: 0,
                    text: this.text,
                    cdate: new Date().toISOString()
                })
                Comments.insertComment(comment);
                let ref = this;
                setTimeout(async function () {
                    let comments = await Comments.getComments(ref.section);
                    ref.sections[0].comments = comments;
                }, 1000)
            },
            async reportComment(id) {
                await Comments.reportComment(Object.assign({},
                    this.section, {
                        comment_id: id
                    }
                ));
                this.sections[0].comments = await Comments.getComments(this.section);
            },
            async updateVote(id, vote = 1) {
                await Comments.updateVotes(Object.assign({}, this.section, {
                    comment_id: id,
                    vote,
                    id: this.userData.id
                }));
                let ref = this;
                this.disabled = 1;
                setTimeout(async function () {
                    ref.sections[0].comments = await Comments.getComments(ref.section);
                    ref.disabled = 0;
                }, 1000)
            },
            async editComment(comment, text) {
                await Comments.editComment(comment, text);
                this.sections[0].comments = await Comments.getComments();
            },
            async rate(rating) {
                this.userRate = rating;
                let data = Object.assign({}, this.section, {
                    student_id: this.$store.getters.getUserData.id,
                    rate: this.userRate > 5 ? 5 : this.userRate < 1 ? 1 : this.userRate
                });
                Sections.rate(data);
                 let rating_ = await this.currentRate();
                 this.check(rating_ , ".currentRating")
            },
            async currentRate() {
                let data = Object.assign({}, this.section);
                delete data.id;
                let rate = await Sections.getRate(data);
                return rate[0];
            },
            check(rate, class_ = ".userRating") {
                let arr = document.querySelectorAll(class_ + ' li');
                for (let element of arr) {
                    if (element.getAttribute('data-rate') - 0 <= Math.floor(rate)) {
                        element.setAttribute('data-checked', "y");
                    } else {
                        element.setAttribute('data-checked', "n");
                    }
                }
            },
            uncheck() {
                let arr = document.querySelectorAll('.userRating li');
                for (let element of arr) {
                    if (element.getAttribute('data-rate') - 0 > this.userRate) {
                        element.setAttribute('data-checked', "n");
                    }
                }
                this.check(this.userRate);
            }
        },
        data() {
            return {
                disabled: 0,
                text: '',
                n: null,
                userRate: 0,
                userData: null,
                currentRating: 0,
                autoFetch: true,
                section: this.$route.query,
                colors: [
                    "#F0C329", "#F34A2D", "#78B429", "#107787", "#9555B2"
                ],
                sections: [{
                    title: " ",
                    code: " ",
                    major: " ",
                    instructor: " ",
                    currentRating: null,
                    userRating: null,
                    comments: []
                }]
            }
        }
    }
</script>