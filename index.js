const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json())





// const uri = "mongodb+srv://artify-db:9DcUHT6zVDEodBOK@firstproject.7bzasho.mongodb.net/?appName=firstProject";

const uri = `mongodb+srv://${process.env.DB_ARTWORK}:${process.env.DB_PASS}@firstproject.7bzasho.mongodb.net/?appName=firstProject`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})



async function run() {
    try {
        await client.connect();

        const db = client.db('artify-db')
        const artworkCollection = db.collection('artwork')


        // for acces all data
        app.get('/artwork', async (req, res) => {
            const result = await artworkCollection.find().toArray()
            res.send(result)
        })

        // get artwork by user email 
        // app.get('/artwork', async (req, res) => {
        //     const {email}= req.query;
        //     const query = {email};
        //     const cursor = artworkCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })


        // app.get('/artwork', async (req, res) => {
        //     try {
        //         const { email } = req.query; // ✅ Get email from query parameter
        //         const query = email ? { userEmail: email } : {}; // ✅ Filter if email exists
        //         const result = await artworkCollection.find(query).toArray();
        //         res.send(result);
        //     } catch (error) {
        //         console.error(error);
        //         res.status(500).send({ message: 'Failed to fetch artworks' });
        //     }
        // });

        // TO Access the feautes artwork data
        app.get('/feauters-artwork', async (req, res) => {
            const result = await artworkCollection.find().sort({ createdAt: -1 }).limit(6).toArray()
            res.send(result)
        })

        // to access the details page
        app.get('/artwork-details/:id', async (req, res) => {
            const { id } = req.params
            const result = await artworkCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })


        // single 



        // to add data to db
        app.post('/artwork', async (req, res) => {
            const data = req.body;
            const result = await artworkCollection.insertOne(data)
            res.send({
                success: true,
                result
            })
        })

        // delete
        app.delete('/artwork/:id' , async(req , res)=>{
            const id = req.params.id
            const query ={_id : new ObjectId(id)}
            const result = await artworkCollection.deleteOne(query)
            res.send(result)
        })









        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {

    }
}

run().catch(console.dir);









app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})