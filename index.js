const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@artstore.tattjrs.mongodb.net/?retryWrites=true&w=majority&appName=ArtStore`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        
        
        const artCollection = client.db('artDB').collection('art');

// get api for all data
        app.get('/art',async(req,res)=> {
          const cursor = artCollection.find();
          const result = await cursor.toArray();
          res.send(result);
        })


// get api for all data details and update data
        app.get('/art/:id', async (req,res)=> {
          const id = req.params.id;
          const query = { _id : new ObjectId(id)};
          const result = await artCollection.findOne(query);
          res.send(result);
        })

        // put api for update data 
        app.put('/art/:id',async (req,res)=>{
          const id = req.params.id;
          const item = req.body;
          console.log(item);
          const filter = {_id : new ObjectId(id)};
          const options = {upsert : true};
          const updatedData = {
            $set: {
              name : item.name,
              shortDescription : item.shortDescription,
              image : item.image,
              subCategory : item.subCategory,
              price : item.price,
              rating : item.rating,
              customization : item.customization,
              status : item.status,
              processingTime : item.processingTime,
              userName : item.userName,
              userEmail : item.userEmail

            }
          };
          const result = await artCollection.updateOne(filter,updatedData,options);
          res.send(result);
        })

// get api for sub-category wise data collection
        app.get("/allcrafts/:subcategory", async(req,res)=> {
          const subcategory = req.params.subcategory;
          const query = { subCategory : subcategory};
          const cursor = artCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        })

  // get api for my data list
        app.get("/myitems/:userEmail", async(req,res)=> {
          const useremail = req.params.userEmail;
          const query = { userEmail : useremail};
          const cursor = artCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        })


// get api  for category data in homepage
        app.get('/art-homepage', async (req,res)=> {
          
          const query = { homePage : "yes"};
          const cursor =  artCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        })
// post api for add data to db
        app.post('/art', async (req,res)=> {
            const newArt = req.body;
            console.log(newArt);
            const result = await artCollection.insertOne(newArt);
            res.send(result);
        })

// delete api for delete data from db
app.delete("/myitems/:userEmail/:id", async (req,res)=>{
  const id = req.params.id;
  console.log(id);
  const query = {_id : new ObjectId(id)};
  const result = await artCollection.deleteOne(query);
  res.send(result);
})




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=> {
    res.send('Server running successfully')
})

app.listen(port,()=>{
    console.log(`server running from ${port}`);
})
