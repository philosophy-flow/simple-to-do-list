// SET UP
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


// Set up DB
mongoose.connect("mongodb://localhost/myList", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({name: String});
const Item = mongoose.model("Item", itemsSchema);

// Define default items to store in DB
const item1 = new Item({name: "default item1"});
const item2 = new Item({name: "default item2"});
const item3 = new Item({name: "default item3"});
let defaultListItems = [item1, item2, item3];


// Root get route
app.get("/", function(req, res) {
  Item.find(function(err, itemsList) {
    if (itemsList.length === 0) {
      Item.insertMany(defaultListItems, function(err) {
        if (!err) {res.redirect("/")}
      })
    } else {
      res.render("list", {listName: "My List", listContent: itemsList});
    }
  });
});


// Root post route (make new item)
app.post("/", function(req, res) {
  const newItem = new Item({name: req.body.newItem});
  newItem.save();
  res.redirect("/");
});

// Delete post route (delete list item)
app.post("/delete", function(req, res) {
  Item.deleteOne({_id: req.body.itemId}, function(err) {
    if (!err) {console.log("Item deleted.");}
  });
  res.redirect("/");
})



// Spin up server
app.listen(3000, function() {
  console.log("Server live on port 3000...");
});
