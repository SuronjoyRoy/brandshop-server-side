const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlvvhig.mongodb.net/?retryWrites=true&w=majority`;


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
    await client.connect();

    const productCollection = client.db('productsDB').collection('products')
    const cartCollection = client.db('productsDB').collection('carts')

    
    app.post('/products', async(req,res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
     })

     app.get('/products', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })
// card
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result)
    })
    
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
// update cart

app.put("/products/:id",  async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updateProduct = req.body;
  const newProduct = {
    $set: {

    name: updateProduct.name,
    brand: updateProduct.brand,
    type: updateProduct.type,
    price: updateProduct.price,
    rating: updateProduct.rating,
    photo: updateProduct.photo,
    details: updateProduct.details
    },
  }
  const result = await productCollection.updateOne(query, newProduct, options)
  res.send(result);

})

app.delete('/user/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await productCollection.deleteOne(query);
    res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// middlewire

app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('brandshop server is running')
});

app.listen(port, ()=>{
    console.log(`brandshop server is running on the server${port}`)
})