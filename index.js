const express =require('express');
const cors=require('cors');
const app=express();
const port =process.env.PORT || 5000;

require('dotenv').config()
//Middle ware
app.use(cors());
app.use(express.json());

//mongo connect

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvoex.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const todoCollection=client.db('taskdata').collection('todo');

        //api create
        app.get('/todo', async(req,res) => {
            const query ={};
            const cursor=todoCollection.find(query);
            const todos=await cursor.toArray();
            
            res.send(todos);

          })

        //   //single data id
          app.get('/todo/:id',async(req,res) =>{
              const id=req.params.id;
              const query={_id:ObjectId(id)};
              const todo=await todoCollection.findOne(query);
              res.send(todo)
          })

          //post data
          app.post('/todo',async(req,res) => {
              const newTodo=req.body;
              const result=await todoCollection.insertOne(newTodo);
              res.send(result)
          })

        //   //delete data
          app.delete('/todo/:id',async(req,res) => {
              const id =req.params.id;
              const query={_id:ObjectId(id)};
              const result=await todoCollection.deleteOne(query);
              res.send(result);
          })

     

    }
    finally{

    }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send('running node practice one')
})
app.listen(port,() => {
    console.log('data connected')
})