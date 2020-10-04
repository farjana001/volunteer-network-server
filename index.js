const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const dataCollection = client.db("charity").collection("data");
  const eventsCollection = client.db("charity").collection("events");
 
    app.post('/addData', (req, res) => {
        const data = req.body;
        dataCollection.insertMany(data)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/events', (req, res) => {
        dataCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addEvents', (req, res) => {
        const event = req.body;
        eventsCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0)
            console.log(result);
        })
    })

    app.get('/userEvent', (req, res) => {
        console.log(req.query.email);
        eventsCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
    })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);