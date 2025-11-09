const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json())





const uri = "mongodb+srv://artify-db:9DcUHT6zVDEodBOK@firstproject.7bzasho.mongodb.net/?appName=firstProject";

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

    app.get('/artwork', async(req,res)=>{
        const result = await artworkCollection.find().toArray()
        console.log(result);
        
        res.send(result)
    })










    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  
  finally {
    await client.close();
  }
}

run().catch(console.dir);









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})