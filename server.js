const express = require("express");
const morgan = require("morgan");
var path = require('path');
var needle = require('needle');

const redis = require('redis');
const client = redis.createClient(6379);

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

    async function getData() {
        const firstPage = (await needle("GET", "https://api.spoonacular.com/recipes/complexSearch?" + queryParams + "&number=100"));
        
        if (firstPage.statusCode != 200) {
                res.send("Error: " + firstPage.statusCode + ":" + firstPage.statusMessage);
        } else {
            const recipeData = { "results": [] };
            recipeData.totalResults = firstPage.body.totalResults;
    
            for (var i = 0; i < Math.floor(firstPage.body.number) && Math.floor(firstPage.body.totalResults); i++) {
                recipeData.results.push({
                    "id": firstPage.body.results[i].id,
                    "title": firstPage.body.results[i].title,
                   "image": firstPage.body.results[i].image
                });
            }
                
            for (page = 1; (page * Math.ceil(firstPage.body.number)) < Math.floor(firstPage.body.totalResults); page++) {

                const nthPage = (await needle("GET", "https://api.spoonacular.com/recipes/complexSearch?" + queryParams + "&number=100&offset=" + (page * firstPage.body.number)));
                if (nthPage.statusCode != 200) {
                    console.log("Error: " + nthPage.statusCode + ":" + nthPage.statusMessage);
                } else {
                    for (var i = 0; i < Math.floor(firstPage.body.number) && (page * Math.ceil(firstPage.body.number) + i) < Math.floor(firstPage.body.totalResults); i++) {
                        recipeData.results.push({
                            "id": nthPage.body.results[i].id,//(page * Math.ceil(response.body.number) + i),
                            "title": nthPage.body.results[i].title,//"filler Title",
                            "image": nthPage.body.results[i].image//"filler image"
                        })
                    }
                }                  
            }

            //Set recipeData to Redis with the query parameters as the key. 
            client.set(queryParams.toString(), JSON.stringify(recipeData));

            return recipeData;
        }     
    }

    client.exists(queryParams.toString(), async function (err, reply) {
        if (err) throw err;

        if (reply === 1) {
            client.get(queryParams.toString(), (err, data) => {
                if (err) throw err;  
                res.send(JSON.parse(data));
            })
        } else {
            res.json(await getData());
        }
    });
});
