const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require('mongoose')

//models
const TodoTask = require("./models/TodoTask")

dotenv.config()
app.use("/static", express.static('public'))

app.use(express.urlencoded({ extended: true}))

//connect to db
mongoose.set("useFindAndModify", false)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true}, () => {
    console.log('connected to db!')
    app.listen(3000, () => console.log(`Server is running port 3000`))
})

app.set('view engine', 'ejs');

//Get method
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks})
    })  
})

//Post method
app.post('/', async (req,res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    })
    try {
        await todoTask.save()
        res.redirect("/")
    }catch (err) {
        res.redirect('/')
        console.log("error")
    }
})

//UPDATE

app.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });