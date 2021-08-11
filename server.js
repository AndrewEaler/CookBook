const express = require("express");
const app = express();

app.listen(1337, () => {
    console.log("Application started and Listening http://localhost:1337/");
});

app.use("/static", express.static('./static/'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Views/index.html");
});
