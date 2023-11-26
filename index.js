const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer')
const path = require('path')

const app = express();
app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['POST', 'GET', 'DELETE', 'PUT'],
        credentials: true
    }
));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.send('brea api!')
})
//file
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images')
    },
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
})

app.post('/uploadimage', upload.single('image'), (req, res)=>{
    const value = req.file.filename;
    const sql = "INSERT INTO image (`image`) VALUES(?)";
    db.query(sql, [value], (req,res)=>{
        if(err) return res.json(err)
        return res.json({Status: 'succes'})
    })
})

app.get('/uploadimage', (req, res)=>{
    const sql = "SELECT * FROM conseilbrera";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
 
const db = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'render_brera'
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
})

db.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

app.get('/', (req, res)=>{
    const sql = "SELECT * FROM conseilbrera";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/create', (req, res)=>{
    const sql = "INSERT INTO conseilbrera (`titre`, `conseil1`, `conseil2`, `conseil3`) VALUES(?)"
    
    const values = [
        req.body.titre,
        req.body.conseil1,
        req.body.conseil2,
        req.body.conseil3,
    ]
    db.query(sql, [values],(err, data)=>{
        if(err) return res.json(err);
        return res.json('data created');
    })
})

app.put('/update/:id', (req, res)=>{
    const sql = "UPDATE conseilbrera set `titre` = ?, `conseil1` = ?, `conseil2` = ?, `conseil3` = ? WHERE id = ?";
    const id = req.params.id;
    const values = [
        req.body.titre,
        req.body.conseil1,
        req.body.conseil2,
        req.body.conseil3,
    ]
    db.query(sql, [...values, id],(err, data)=>{
        if(err) return res.json(err);
        return res.json('data update');
    })
})

app.delete('/delete/:id', (req, res)=>{
    const sql = "DELETE FROM conseilbrera WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id],(err, data)=>{
        if(err) return res.json(err);
        return res.json('data delete');
    })
})

app.listen(8081, ()=>{
    console.log('the server running in port 8081')
})