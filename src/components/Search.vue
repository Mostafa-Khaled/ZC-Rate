<template>
    <div class="container">
        <form @submit="Submit($event)" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="search" class="form-label text-light"> Search Course Code </label>
                <input type="search" name="course" v-model="course" id="search-bar" autocomplete="off" class="form-control" placeholder="Enter Course Code" required  @keypress="Validate($event)">   
                <div class="invalid-feedback">
                    Please Enter Course Code.
                </div> 
            </div>
        </form>    
    </div>   
</template>
<style scoped>
    label{
        font-size: 2.5em;
    }
    input{
        font-size:1.25em;
        padding:0.5em;
        width:100%;
    }
    .invalid-feedback{
        text-align:left;
        font-weight:bold;
        font-size:1em;
    }
</style>
<script>
export default {
    name: 'Search',
    data(){
        return{
            course: ''
        }
    },
    methods:{
        Submit(e){
            let form = document.querySelector('form');
            if (form.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
            }else{
                e.preventDefault();
                this.$router.push('/courses?course='+this.course);
            }
            form.classList.add('was-validated');
        },
        Validate(input){
            let char = String.fromCharCode(input.keyCode);
            let str = document.querySelector('input').value.length;
            if(input.keyCode == 13) return true; // Enter Key
            if( ( (str < 3) && !/[A-Za-z]/.test(char) ) ||  ( str == 3 && !/[a-zA-Z0-9]/.test(char)) || ( (str >= 4) && !/[0-9]/.test(char) ) || str >= 7){
                input.preventDefault();
                return false;
            }
            if (/^[A-Za-z0-9]+$/.test(char)) return true;
            else input.preventDefault();
        }
    },
    computed:{
    }
}
</script>