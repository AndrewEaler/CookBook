const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.listen(1337, () => {
    console.log("Application started and Listening http://localhost:1337/");
});

app.use("/static", express.static('./static/'));
app.use("/config", express.static('./config/'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Views/index.html");
});
