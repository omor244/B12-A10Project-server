const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const tripscollections = db.collection('trips')
        const eventcollections = db.collection('events')
        const usercollections = db.collection('usercollection')


        //   all get here
        app.get('/challenges/limit', async (req, res) => {

            const corsor = challengecolls.find().limit(6)

            const result = await corsor.toArray()
            res.send(result)
        })
        app.get('/trips/limit', async (req, res) => {

            const cursor = tripscollections.find().sort({ createdAt: -1 }).limit(5)

            const result = await cursor.toArray()

            res.send(result)
        })
        app.get('/events', async (req, res) => {

            const cursor = eventcollections.find().limit(4)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/trips', async (req, res) => {

            const cursor = tripscollections.find()

            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/challenges', async (req, res) => {

            const cursor = challengecolls.find()

            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/challenges/:id', async (req, res) => {

            const id = req.params.id
            const qurey = { _id: new ObjectId(id) }

            const result = await challengecolls.findOne(qurey)
            res.send(result)
        })
        app.get('/join/:id', async (req, res) => {

            const id = req.params.id
            const qurey = { _id: new ObjectId(id) }

            const result = await challengecolls.findOne(qurey)
            res.send(result)
        })


        app.get('/challengesitem', async (req, res) => {

            const category = req.query.category;
            let query = {};

            if (category) {
                query = { category: { $regex: new RegExp(`^${category}$`, 'i') } };
            }

            const result = await challengecolls.find(query).toArray();

            res.send(result);
        })
        app.get('/challengemail', async function (req, res) {
        
                const email = req.query.email;
                
                const result = await challengecolls.find({ createdBy: email }).toArray();
                res.send(result);
             
        });
     




        // all post here


        app.post('/trip', async (req, res) => {

            const data = req.body
            const result = await tripscollections.insertOne(data)

            res.send(result)
        })

        app.post('/challenges', async (req, res) => {

            const data = req.body

            const result = await challengecolls.insertOne(data)
            res.send(result)
        })
        app.post('/challenges/:id/join', async (req, res) => {

            const id = req.params.id;       // challenge ID from URL
            const data = req.body;          // user info from frontend

            // Combine user data with challengeId
            const newJoin = {
                ...data,
                challengeId: new ObjectId(id),
            };

            const filter = { _id: new ObjectId(id) }

            const update = { $inc: { participants: 1 } }
            const result = await usercollections.insertOne(newJoin);
            const participantscount = await challengecolls.updateOne(filter, update)


            res.send({ result, participantscount });

        });

        app.post('/events', async (req, res) => {

            const data = req.body
            const result = await eventcollections.insertOne(data)
            res.send(result)
        })

        // all patch here 
        app.patch('/update/:id', async (req, res) => {
          
            const id = req.params.id 
            const data = req.body 
            const query = { _id: new ObjectId(id) }
            const update = { $set: data }
            const result = await challengecolls.updateOne(query, update)
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
