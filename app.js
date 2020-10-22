const express = require("express");
const app = express();
const path = require('path');
var pg = require('pg');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Отображаем главную страницу с использованием шаблона "index.hbs"
app.get('/main', function (req, res) {
    res.render('index', req.query);
});


const config = {
    user: 'postgres',
    database: 'testdb',
    password: 'psql',
    port: 5432
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

app.post('/getall', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM users', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        })
    })
});


const port = process.env.PORT || 68;
app.listen(port, () => console.log("Listening on " + port))