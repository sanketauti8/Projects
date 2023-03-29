import express from 'express';
import {db,connectToDb} from './db.js';
import fs from 'fs';
import admin from 'firebase-admin';


// npm install nodemon --save-dev
//npx nodemon src/server.js
//hen added {"dev":"npx nodemon src/server.js", in package.json-->script}
// npm run dev

//mongosh
//db.articles.insertMany([{name:'learn-react',upvotes:0,comments:[]},{name:'learn-node',upvotes:0,comments:[]},{name:'mongodb',upvotes:0,comments:[]}])

const credentials=JSON.parse(
    fs.readFileSync('../creadentials.json')
)
admin.initializeApp({
    credential:admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());


app.get('/api/articles/:name',async (req,res)=>{
    const {name}=req.params;
   

    const article=await db.collection('articles').findOne({name});
    if(article){
    res.json(article);
    }else{
        res.sendStatus(404);
    }
});




app.put('/api/articles/:name/upvote',async(req,res)=>{

    const {name}=req.params;
    
    
    await db.collection('articles').updateOne({name},{
        $inc:{upvotes:1},
    });

    const article=await db.collection('articles').findOne({name});


    if(article){
        res.send(article);
    }else{
        res.send('The article does not exit');
    }
});

app.post('/api/articles/:name/comments',async(req,res)=>{
    const {name}=req.params;
    const {postedBy,text}=req.body;

    
    
    await db.collection('articles').updateOne({name},{
        $push:{comments:{postedBy,text}},
    });
    const article=await db.collection('articles').findOne({name});

    if(article){
        res.json(article);
    }else{
        res.send('The article does not exit');
    }

});


connectToDb(()=>{
    console.log('Successfully Connected to Database!!');
    app.listen(8000,()=>{
        console.log('server is listening on port 8000');
    })
})
