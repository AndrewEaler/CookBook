const express = require("express");
const morgan = require("morgan");
var path = require('path');
var needle = require('needle');

const app = express();

app.use(morgan("dev"));

app.listen(1337, () => {
    console.log("Application started and Listening http://localhost:1337/");
});


app.use("/static", express.static(path.join(__dirname, '/static/')));
app.use("/config", express.static(path.join(__dirname,'./config/')));
app.use("/Views", express.static(path.join(__dirname,'./Views/')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Views/index.html");
});

app.get("/api/spoonacular/getRecipes", async function (req, res) {
    const queryParams = new URLSearchParams(req.query);
    const response = (await needle("GET", "https://api.spoonacular.com/recipes/complexSearch?" + queryParams));



    res.send(response.body);
});
