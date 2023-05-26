import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueGapi from 'vue-gapi'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignInAlt,faSignOutAlt,faReply,faTachometerAlt,faComment,faPlus,faHome,faTimes,faFlag, faExclamationCircle,faExclamation,faEdit,faCaretSquareUp,faCaretSquareDown,faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faSignInAlt,faSignOutAlt,faReply,faTachometerAlt,faComment,faPlus,faHome,faTimes,faFlag,faExclamationCircle,faExclamation,faEdit,faCaretSquareUp,faCaretSquareDown,faStar)

createApp(App).use(store).use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(VueGapi, {
    apiKey: 'AIzaSyBE3xo9m0Gv9glTKvtOEjb9SH0yG_6rcLA',
    clientId: '315883756866-riojt08pe8rsue293nb2htdbbpdhklsr.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/user.organization.read',
}).mount('#app')
