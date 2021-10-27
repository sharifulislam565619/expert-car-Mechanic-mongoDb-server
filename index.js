const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
const cors = require("cors")
require('dotenv').config()


const app = express()
const port = 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2wssq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();

        const database = client.db("carMechanic");
        const services = database.collection("services");

        // data post
        app.post("/services", async (req, res) => {
            const service = req.body
            const result = await services.insertOne(service)
            console.log(service);
            res.json(result);
        })


        // get all data
        app.get('/services', async (req, res) => {

            const cursor = services.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        //get single data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await services.findOne(query);
            res.json(result)
        })


        // data delete
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await services.deleteOne(query);
            res.json(result)
        })

    }

    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Expert car mechanic here is")
})

app.listen(port, () => {
    console.log("Car mechanic server is running", port);
})