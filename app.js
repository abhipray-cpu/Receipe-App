const app = Vue.createApp({
    data() {
        return {
            Light_val: false,
            Dark_val: true,
            form_display: 'none',
            title_val: '',
            importance_val: '',
            date_val: '',
            description_val: '',
            new_entry: {},
            task_list: [],
            task_length: 0,
            today_list: [],
            today_length: 0
        }
    },

    // adding a listener to task_list so that if anythin happens there the today list can be modified
    methods: {

        updateList() {
            fetch('https://to-d0-list-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json').then(function(response) {
                response.json().then(function(data) {
                    const results = [];
                    for (const id in data) {
                        results.push({
                            'id': id,
                            'Title': data[id].Title,
                            'Description': data[id].Description,
                            'Date': data[id].Date,
                            'Importance': data[id].Importance
                        })
                    }

                    results.forEach(result => {
                        console.log(result)
                    })

                });
            }).catch(function(error) {
                console.log('Fetch Error:', error);
            });
        },

        add_task_fn() {
            this.form_display = 'block';

        },
        date_check() {
            var todayDate = new Date().toISOString().slice(0, 10);

            this.today_list = this.task_list.filter((task) => { return task.Date == todayDate });
            this.today_length = this.today_list.length;


        },
        form_submit_fn(e) {

            this.new_entry = {
                'Title': this.title_val,
                'Description': this.description_val,
                'Date': this.date_val,
                'Importance': this.importance_val
            }

            if (this.new_entry.Title != '' && this.new_entry.Date != '' && this.new_entry.Description != '' && this.new_entry.Importance != '') {
                this.task_list.unshift(this.new_entry);
                fetch('https://to-d0-list-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.new_entry)
                })
                this.updateList();

                const date = this.new_entry.Date;
                this.date_check();
                this.task_length = this.task_list.length
                this.form_display = 'none';
                this.title_val = ''
                this.date_val = ''
                this.description_val = ''
                this.importance_val = ''
            } else {
                alert("Pura bhar MC!!!");
            }
        },
        toggle_fn() {
            this.Light_val = !this.Light_val;
            this.Dark_val = !this.Dark_val;
            //console.log(`Light state:${this.Light_val},Dark state:${this.Dark_val}`)
        },
        delete_event(title) {

            this.task_list = this.task_list.filter(task => { task.Title != title })
            console.log(this.task_list)
            this.date_check()
        }


    },
    mounted() {
        this.updateList();
    },
})
app.mount('#main-container')