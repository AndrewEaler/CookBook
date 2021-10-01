// JavaScript source code
var apiKey = config.API_KEY;

var resultIndex = 0;
var numOfParam = 0;
const eventList = [];

const parameterDictionary = {
    "Cuisine": "cuisine",
    "Key Word": "query",
    "Exclude Ingredients": "excludeIngredients",
    "Exclude Cuisine": "excludeCuisine",
    "Diet": "diet",
    "Intolerances": "intolerances",
    "Equipment": "equipment",
    "Course Type": "type",
    "Word In Title": "titleMatch",
    "Max Ready Time": "maxReadyTime"
};

document.getElementById("search").addEventListener("click", async function () {
    resultIndex = 0;

    const response = await getRecipeData(getURL());
    buildTable(response);
});

document.getElementById("addParam").addEventListener("click", function () {
    const paramSelector = ['<div class=\"parameter\" id=\"param' + numOfParam + '\"><input type=\"button\" id=\"deleteParam' + numOfParam + '\" value=\"x\"><select id=\"selector' + numOfParam + '\">'];

    for (const [key] of Object.entries(parameterDictionary)) {
        paramSelector.push('<option>' + `${key}` + '</option>');
    }

    paramSelector.push('</select><input type="text" id=\"input' + numOfParam + '\"></div>');
    document.getElementById("searchParameters").insertAdjacentHTML('beforeend', paramSelector.join(""));

    eventList.push(newListener(numOfParam));

    function newListener(value) {
        //check if a div exists with the id 
        if (document.getElementById("deleteParam" + value)) {
            document.getElementById("deleteParam" + value).addEventListener("click", function () {
                document.getElementById("param" + value).remove();
            });
        }
    }

    numOfParam++;
});

async function buildTable(data) {
    var totalResults = data.totalResults;
    var resultsPerSearch = Math.floor(document.getElementById("recipePerPage").value);
    document.getElementById("RecipeOutput").innerHTML = '';
    const table = ['<table><thead><th>Image</th><th>Name</th></thead>'];

    for (var i = 0; i < resultsPerSearch && (resultIndex + i) < totalResults; i++) {
        table.push('<tr><td ><img src=\"' + data.results[i].image + '\"class=\"recipeImage\"/></td>');
        table.push('<td><p onClick=\"recipePage(' + data.results[i].id + ')\" class=\"recipeTitle\" id="' + data.results[i].id + '">' + data.results[i].title + '</p></td> </tr>');
        //add link to page with recipe info 
        //add ingredient list  
    }

    document.getElementById("RecipeOutput").innerHTML += table.join("") + '</table>';

    //second table for navigation buttons
    document.getElementById("RecipeOutput").innerHTML += '<table><tr><td class=\"nextPrev\"><input type=\"button\" id=\"firstPage\" value=\"<<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"prev\" value=\"<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"next\" value=\">\"></input></td><td class=\"nextPrev\"><input type=\"button\" id=\"lastPage\" value=\">>\"></input></td></tr></table>';

    if (resultIndex + resultsPerSearch <= totalResults) {
        document.getElementById("RecipeOutput").innerHTML += "<p>Showing " + (resultIndex + 1) + "-" + (resultIndex + resultsPerSearch) + " of " +
            totalResults + " total recipes</p>";
    } else {
        document.getElementById("RecipeOutput").innerHTML += "<p>Showing " + (resultIndex + 1) + "-" + totalResults + " of " +
            totalResults + " total recipes</p>";
    }

    /////////////////////////////////////////////////////////
    //Event listeners for Next, Last Page, Previous, and First Page buttons
    /////////////////////////

    //next button
    document.getElementById("next").addEventListener("click", function () {
        if (resultIndex + resultsPerSearch >= totalResults) {
            window.alert("No more recipes to show");
        } else {
            resultIndex += resultsPerSearch;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });

    //first page button
    document.getElementById("firstPage").addEventListener("click", function () {
        if (resultIndex == 0) {
            window.alert("You're alreay at the begining of the list of recipes.");
            //break;
        } else {
            resultIndex = 0;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });

    //previous button
    document.getElementById("prev").addEventListener("click", function () {
        if (resultIndex - resultsPerSearch < 0 && resultIndex > 0) {
            resultIndex = 0;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        } else if (resultIndex - resultsPerSearch < 0) {
            window.alert("This is the begining of the recipe list.");
        } else {
            resultIndex -= resultsPerSearch;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });

    //Last page button
    document.getElementById("lastPage").addEventListener("click", function () {
        if (resultIndex + resultsPerSearch >= totalResults) {
            window.alert("You're alreay at the end of the list of recipes.");
            //break;
        } else {
            resultIndex = totalResults - resultsPerSearch;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });
};

function getURL() {
    var resultsPerSearch = Math.floor(document.getElementById("recipePerPage").value);
    var urlBegin = "http://localhost:1337/api/spoonacular/getRecipes";
    var ingredientInput = document.getElementById("searchTerm").value;
    var URL = (urlBegin + "?apiKey=" + apiKey + "&addRecipeInformation=true&instructionsRequired=true&includeIngredients=" + ingredientInput + "&number=" + resultsPerSearch + "&offset=" + resultIndex);

    const parameterValues = {};
    for (var i = 0; i < numOfParam; i++) {
        if (document.getElementById("param" + i) && document.getElementById("input" + i).value != '') {
            if (parameterValues[parameterDictionary[document.getElementById("selector" + i).value]] === undefined) {
                parameterValues[parameterDictionary[document.getElementById("selector" + i).value]] = [];
            }

            console.log(parameterDictionary[document.getElementById("selector" + i).value]);
            parameterValues[parameterDictionary[document.getElementById("selector" + i).value]].push(document.getElementById("input" + i).value);
        }
    }

    const queryParams = new URLSearchParams(parameterValues);

    if (queryParams.toString().length > 0) {
        return URL + "&" + queryParams.toString();
    }
    else {
        return URL;
    }
}

function getRecipeData(URL) {
    return fetch(URL)
        .then((response) => response.json())
        .catch(function (err) {
            console.log(err);
        });
}

function recipePage(recipeId) {
    console.log(recipeId);
    window.open("/Views/RecipeInfo.html?id=" + recipeId, "_self");
}
