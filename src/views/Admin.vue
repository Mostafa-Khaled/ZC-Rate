<template>
    <main>
        <div class="d-flex w-25 flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
            <router-link to="/admin"
                class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <font-awesome-icon icon="tachometer-alt">
                </font-awesome-icon>
                <span class="fs-4" style="margin-left:20px;">Control Panel</span>
            </router-link>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <router-link to="/" class="nav-link active" aria-current="page">
                        <font-awesome-icon icon="home">
                        </font-awesome-icon>
                        Home
                    </router-link>
                </li>
                <li>
                    <a class="nav-link link-dark" data-bs-toggle="collapse" href="#addCourse" role="button"
                        aria-expanded="false" aria-controls="multiCollapseExample1"
                        data-bs-target="#addCourse">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                        Add Course
                    </a>
                </li>
                <li>
                    <a class="nav-link link-dark" data-bs-toggle="collapse" href="#addSection" role="button"
                        aria-expanded="false" aria-controls="multiCollapseExample1"
                        data-bs-target="#addSection">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                        Add Section
                    </a>
                </li>
                <li>
                    <a class="nav-link link-dark" data-bs-toggle="collapse" href="#editCourse" role="button"
                        aria-expanded="false" aria-controls="multiCollapseExample1"
                        data-bs-target="#editCourse">
                        <font-awesome-icon icon="edit">

                        </font-awesome-icon>
                        Edit Course
                    </a>
                </li>
                <li>
                    <a class="nav-link link-dark" data-bs-toggle="collapse" href="#editSection" role="button"
                        aria-expanded="false" aria-controls="multiCollapseExample1"
                        data-bs-target="#editSection">
                        <font-awesome-icon icon="edit">

                        </font-awesome-icon>
                        Edit Sections
                    </a>
                </li>
                <li>
                    <a class="nav-link link-dark" data-bs-toggle="collapse" href="#comments " role="button"
                        aria-expanded="false" aria-controls="comments" data-bs-target="#comments">
                        <font-awesome-icon icon="comment">

                        </font-awesome-icon>
                        Comments
                    </a>
                </li>
            </ul>
            <hr>
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                    id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="../assets/wlogo.svg" alt="" width="32" height="32" class="rounded-circle me-2">
                    <strong>{{userData.f_name}}</strong>
                </a>
                <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li>
                        <router-link class="dropdown-item" to="/department">Department</router-link>
                    </li>
                    <li>
                        <router-link class="dropdown-item" to="/profile">Profile</router-link>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
        <div class="add-course w-75 d-flex flex-column flex-shrink-1 p-3 bg-dark">


            <div class="">
                <div class="collapse" id="multiCollapseExample1">
                    <div class="card card-body">
                        Some placeholder content for the first collapse component of this multi-collapse example.
                        This panel is hidden by default but revealed when the user activates the relevant trigger.
                    </div>
                </div>
            </div>
            
            <AComments></AComments>
            <AAddCoure></AAddCoure>
            <AAddSection/>
            <AEditCourse/>
            <AEditSection/>
        </div>
    </main>
</template>
<style>
    #app {
        padding: 0 !important;
    }
</style>
<style scoped>
    main {
        display: flex;
        flex-wrap: nowrap;
        height: 100vh;
        max-height: 100vh;
        overflow-x: auto;
        overflow-y: hidden;
    }

    li {
        text-align: left;
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
<script>
    import Navbar from '@/components/Navbar.vue'
    import AComments from '@/components/AComments.vue'
    import AAddCoure from '@/components/Admin-AddCourse.vue'
    import AAddSection from '@/components/Admin-AddSection.vue'
    import AEditCourse from '@/components/Admin-EditCourse.vue'
    import AEditSection from '@/components/Admin-UpdateSection.vue'
    import {
        Comments,
        Accounts
    } from '../../server'
    export default {
        name: 'Admin',
        components: {
            Navbar,
            AComments,
            AAddCoure,
            AAddSection,
            AEditCourse,
            AEditSection
        },
        async created() {
            let item = await Accounts.crypt("datahashing");
            let pass = "thedatahasdfasdnflasndlkfasld1sf";
            let userData = await Accounts.crypt(sessionStorage.getItem(item), "decrypt", pass);
            this.userData = userData;
            let $ = e => document.querySelectorAll(e);
            $('.nav-pills > li > *:first-child').forEach(e => {
                e.addEventListener('click', function () {
                    $('.nav-pills > li > *:first-child').forEach(el => {
                        if (e != el) {
                            el.classList.remove('active');
                            el.classList.add('link-dark');
                        }
                    })
                    if (e.classList.contains('active')) {
                        e.classList.remove('active');
                    } else {
                        e.classList.add('active');
                    }
                })
            })
        },
        methods: {
        },
        data() {
            return {
                text: '',
                userData: {},
                colors: [
                    "#F0C329", "#F34A2D", "#78B429", "#107787", "#9555B2"
                ]
            }
        }
    }
</script>