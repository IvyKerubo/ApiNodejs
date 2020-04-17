const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'apidb'
}); 

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
});

//setting views file
app.set('views/student_add' ,path.join(__dirname,'views'));

//setting view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    //res.send('Ivy NodeJs Student Task');
    let sql = "SELECT * FROM students";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
    res.render('student_index' ,{
        title : 'Ivy NodeJs Student Task',
        students : rows
        });
    });
});


app.get('/add',(req, res) => {
    //res.send('New Student Form Page');
    res.render('student_add' ,{
        title : 'Ivy NodeJs Student Task'
     });
});

//creating students
app.post('/save',(req, res) => {
    let data = {fullname: req.body.fullname, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO students SET ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//updating or Reading students
app.get('/edit/:studentId',(req, res) => {
    const studentId = req.params.studentId;
    let sql = `Select * from students where id = ${studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('student_edit', {
            title : 'Ivy NodeJs Student Task',
            student : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const studentId = req.body.id;
    let sql = "update students SET fullname='"+req.body.fullname+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+studentId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


//Deleting Students
app.get('/delete/:studentId',(req, res) => {
    const studentId = req.params.studentId;
    let sql = `DELETE from students where id = ${studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 

//server listening
app.listen(5000, () => {
    console.log('Server is running at port 5000');
});