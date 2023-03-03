let eventBus = new Vue()
Vue.component('columns', {
    props:{
    },
    template:`
    <div id="cols">
        <fill></fill>
        <p v-if="errors.length"
        v-for="error in errors">
            {{ error }}
        </p>
        <col1 class="col" :column1="column1"></col1>
        <col2 class="col" :column2="column2"></col2>
        <col3 class="col" :column3="column3"></col3>
    </div>
    `,
    data() {
        return {
            errors:[],
            column1:[],
            column2:[],
            column3:[],
        }
    },
    methods:{
    },
    mounted(){
        eventBus.$on('card-submitted', card =>{
            this.errors = []
            this.column1.push(card)
            console.log(this.column1)
            if (this.column1.length > 3){
                this.errors.push('While you can\'t add new cards')
            }
        })

        eventBus.$on('to-column2', card => {
            this.errors = []
            if (this.column2.length < 5){
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card),1)
            }else{
                this.errors.push('Complete at least one task to add more')
            }
        })
    eventBus.$on('to-column3', card => {
        this.column3.push(card)
        this.column2.splice(this.column2.indexOf(card), 1)
    })
},



})

Vue.component('fill', {
    props: {
        column1: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <form @submit.prevent="onSubmit" @click="block">
            <p> 
                <b>Title</b>
                <input required type="text" v-model="title" placeholder="title">
            </p>
            <ul>
                <li>
                    <input required type="text" v-model="t1" placeholder="task"> 
                </li>
                <li>
                    <input required type="text" v-model="t2" placeholder="task">
                </li>
                <li>
                    <input required type="text" v-model="t3" placeholder="task">
                </li>
                <li>
                    <input type="text" v-model="t4" placeholder="task">
                </li>
                <li >
                    <input type="text" v-model="t5" placeholder="task">
                </li>
                <p>
                    <input type="submit" value="Add a card">
                </p>
            </ul>
        </form>
                   
    </div>
    `,
    data() {
        return{
            title: null,
            t1: null,
            t2: null,
            t3: null,
            t4: null,
            t5: null,
        }
    },
    methods:{
        onSubmit(){
            let card = {
                title: this.title,
                tasks: [{text: this.t1, completed: false},
                    {text: this.t2, completed: false},
                    {text: this.t3, completed: false},
                    {text: this.t4, completed: false},
                    {text: this.t5, completed: false}],
            date: null,
                status: 0,
        }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.t1 = null
            this.t2 = null
            this.t3 = null
            this.t4 = null
            this.t5 = null
            console.log(card)
        },
        block(){
            if (this.column1.length > 3){

            }
        }
    }
})
Vue.component('col1', {
    props:{
        column1:{
            type: Array,
            required: true
        },
        card: {
            type: Object,
            required: true
        },
    },
    template:`
        <div>
            <h2>Stage 1</h2>
            <div v-for="card in column1">
                <p><b>Title: </b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                     <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)" 
                    :disabled="task.completed">
                    {{ task.text }}
                    </li>
                 </ul>
            </div>
        </div>
    `,
    methods:{
        updateStage(task, card){
            task.completed = true
            card.status += 1
            let length = 0

            for (let i = 0; i < 5; i++){
                if (card.tasks[i].text != null){
                    length++
                }
            }

            if (card.status / length * 100 >=50 ){
                eventBus.$emit('to-column2', card)
            }


        }

    }
})

Vue.component('col2', {
    props:{
        column2: {
            type: Array,
            required: true
        },
        card: {
            type: Object,
            required: true
        }
    },
    template:`
        <div>
            <h2>Stage 2</h2>
            <div v-for="card in column2">
                <p><b>Title: </b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)" 
                    :disabled="task.completed">
                    {{ task.text }}
                    </li>
                 </ul>
            </div>
        </div>
    `,
    methods:{
        updateStage(task, card) {
            task.completed = true
            card.status += 1
            let length = 0

            for (let i = 0; i < 5; i++){
                if (card.tasks[i].text != null){
                    length++
                }
            }

            if (card.status / length * 100 === 100 ){
                card.date = new Date().toLocaleString()
                eventBus.$emit('to-column3', card)
            }
        }

    }

})

Vue.component('col3', {
    props:{
        column3: {
            type: Array,
            required: true
        },
        card:{
            type: Object,
            required: true
        }
    },
    template:`
        <div>
            <h2>Completed tasks</h2>
            <div v-for="card in column3">
                <p><b>Title: </b>{{ card.title }}</p>
                <ul v-for="task in card.tasks"
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)" 
                    :disabled="task.completed">
                    {{ task.text }}
                    </li>
                 </ul>
            </div>
        </div>
    `,
})


    let app = new Vue({
        el:'#app',
        data: {
        }
    })