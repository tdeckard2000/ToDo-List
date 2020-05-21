const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('underscore');

const app = express();

let listOfAllLists = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Mongoose and MongoDB Setup
mongoose.connect("mongodb://localhost:27017/TodoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose Schemas
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const listSchema = new mongoose.Schema({
  listName: String,
  name: String,
});

// Mongoose Models
const homeItem = mongoose.model('homeItem', itemsSchema);
const workItem = mongoose.model('workItem', itemsSchema);
const otherList = mongoose.model('otherList', listSchema);

// Mongoose - Get All List Names
// function getLists(){otherList.find().distinct('listName',(err, doc)=>{
//     console.log('error: '+err);
//     listOfAllLists = doc;
//     listOfAllLists.forEach(element => {
//       console.log(element)
//       app.get('/'+element,(req, res)=>{
//         console.log(element);
//         res.render("list", {listTitle: element, newListItems: ['example', 'items']} );
//       });
//       return('done');
//     });
//   });
// } 

// Create Dynamic Routes
// getLists();

// Get Requests
app.get("/", (req, res)=>{
  res.redirect("/list/home");
});

app.get("/list", (req, res)=>{
  res.redirect("/list/home");
});

app.get("/list/home", (req, res)=>{
  let homeItems = [];
  homeItem.find({}, (err, docs) => {
    homeItems = docs;
    res.render("list", {listTitle: "Home List", newListItems: homeItems});
    })
  });
    

app.get("/list/work", (req, res)=>{
  let workItems = [];
  workItem.find({}, (err, docs)=>{
    workItems = docs;
    res.render("list", {listTitle: "Work List", newListItems: workItems});
    });
    
  });

app.get("/list/about", function (req, res) {
  res.render("about");
});

app.get("/list/*", (req, res)=>{ // Catch all other Gets
  console.log("STEP TWO");
  let requestURL = (req.originalUrl);
  requestURL = requestURL.slice(6); // Remove '/list' from url.
  console.log(requestURL);
  requestURL = requestURL.split('?')[0]; // Remove query from url '?something=something'.
  requestURL= requestURL.replace(/%20/g, ' '); // Replace %20 with a space.

  otherList.find({listName: requestURL}, (err, doc)=>{
    if(err){
      console.log("Error querring database at /list/*")
      console.log(err); 
    }

    if(!doc.length){ // Check if mongoose returned any results.
      res.send("Oops. That list doesn't exist yet. <a href='../'>Go back and create it!</a>")
    }

    newListItems = doc.slice(1); // Remove the first item '#ListName#'
    res.render('list', {listTitle: requestURL, newListItems: newListItems});
  });
});

// otherList.create({listName:'Sodas', name:'Cream Soda'}, (err, docs)=>{
//   console.log(err);
//   console.log(docs);
// })

// Post Requests
app.post("/list/saveItem", function (req, res) {
  const nameOfList = req.body.btnValue;
  const newItemName = req.body.newItem;
  if (req.body.btnValue === "Work List") {
    const item = new workItem({
      name: newItemName
    })
    item.save()
    res.redirect("/list/work");

  } else if (req.body.btnValue === "Home List") {
    const item = new homeItem({
      name: newItemName
    })
    item.save();
    res.redirect('/list/home');

  } else {
    const item = new otherList({
      listName: nameOfList,
      name: newItemName
    })
    item.save();
    res.redirect('/list/' + nameOfList);
  }
});

app.post("/list/addList", (req, res)=>{
  const newList = (req.body.newList).toLowerCase();
  console.log('/addList: ' + newList);
  otherList.create({listName: newList, name:'#ListName#'})
  res.redirect('/list/'+newList);
});

// Delete Requests
app.delete('/list/deleteitem', function(req, res){
  const itemsToDelete = (req.body.itemsToDelete);
  let nameOfList = (req.body.pageName);

  if (nameOfList === "Home List"){
    homeItem.deleteMany({_id: itemsToDelete}, (err, data)=>{
      console.log(err);
      console.log(data);
    });

  }else if (nameOfList === "Work List"){
    workItem.deleteMany({_id: itemsToDelete}, (err, doc)=>{
      console.log(err);
      console.log(doc);
    });
    
  }else{
    otherList.deleteMany({listName: nameOfList, _id: itemsToDelete}, (err, doc)=>{
      console.log(err);
      console.log(doc);
    });
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});