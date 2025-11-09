const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000


// xUHPmW3HeNFkrToY
// B12_A10_DB

const uri = "mongodb+srv://B12_A10_DB:xUHPmW3HeNFkrToY@cluster0.9gmdrlc.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors())
app.use(express.json())

async function run() {
    try {
        await client.connect();

        const db = client.db('assignmentDB10')
        const challengecolls = db.collection('challenges')
     
      
        app.post('/challenges', async (req, res) => {
              
            const data = req.body 

            const result = await challengecolls.insertOne(data)
            res.send(result)
       })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('assignment-10 is runing')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
