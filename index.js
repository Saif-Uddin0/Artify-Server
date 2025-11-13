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
        const favouriteCollection = db.collection('favourite')




         // -------------------------------favourite section-----------------


        // get favorite
        app.get('/favourite', async (req, res) => {
            const result = await favouriteCollection.find().toArray();
            res.send(result)
        })

        // get already  exists favourite or not
        app.get('/favourite/check', async(req,res)=>{
            const {userEmail, artworkId} = req.query;
            const isExists = await favouriteCollection.findOne({userEmail , artworkId});
            res.send({isExists: !!isExists})
        })

        // post favourite
        app.post('/favourite' , async(req,res)=>{
            const data = req.body;
            const existing = await favouriteCollection.findOne({
                artworkId: data.artworkId,
                userEmail: data.userEmail
            })
            if(existing){
                return res.send({
                    success: false,
                    message: 'Already added to favourite'
                })
            }
            const result = await favouriteCollection.insertOne(data)
            res.send({
                success: true,
                result
            })
        })


        app.delete('/favourite/:id', async(req,res)=>{
            const id = req.params.id
            const query ={_id: new ObjectId(id)}
            const result = await favouriteCollection.deleteOne(query)
            res.send(result)
        })

        // app.delete('/artwork/:id', async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: new ObjectId(id) }
        //     const result = await artworkCollection.deleteOne(query)
        //     res.send(result)
        // })





// --------------------------artwork related---------------------


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
        //         const { email } = req.query; // 
        //         const query = email ? { userEmail: email } : {}; 
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
        app.delete('/artwork/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await artworkCollection.deleteOne(query)
            res.send(result)
        })


        // art update
        app.put('/artwork/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const objectId = new ObjectId(id)
            const filter = { _id: objectId }
            const update = {
                $set: data
            }
            const result = await artworkCollection.updateOne(filter, update)
            res.send(result)
        })
       


        // ---------like realted -----------
        app.patch('/artwork/:id/like' , async(req, res)=>{
            const id = req.params.id;
            const userEmail = req.body.userEmail
            const query = {_id: new ObjectId(id)}
            // const artwork = await artworkCollection.findOne(query)
            // if(artwork.likedUsers && artwork.likedUsers.includes(userEmail)){
            //     return res.send({ success: false, message: "Already liked!" });
            // }
            const update ={
                $inc: {likes:1},
                $push: {likedUsers: userEmail}
            }
            const result = await artworkCollection.updateOne(query,update)
            res.send({
                success: true
            })
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