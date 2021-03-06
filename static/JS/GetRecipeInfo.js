// JavaScript source code
var apiKey = config.API_KEY;
var recipeList = {};
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

    recipeList = await getRecipeData(await getURL());
    console.log(recipeList);
    //const response = await getRecipeData(getURL());
    buildTable();
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

async function buildTable() {
    var totalResults = recipeList.totalResults;
    var resultsPerPage = Math.floor(document.getElementById("recipePerPage").value);
    document.getElementById("RecipeOutput").innerHTML = '';
    const table = ['<table><thead><th>Image</th><th>Name</th></thead>'];

    for (var i = resultIndex; i < (resultIndex + resultsPerPage) && i < totalResults; i++) {
        table.push('<tr><td ><img src=\"' + recipeList.results[i].image + '\"class=\"recipeImage\"/></td>');
        table.push('<td><p onClick=\"recipePage(' + recipeList.results[i].id + ')\" class=\"recipeTitle\" id="' + recipeList.results[i].id + '">' + recipeList.results[i].title + '</p></td> </tr>');
        //add link to page with recipe info 
    }

    document.getElementById("RecipeOutput").innerHTML += table.join("") + '</table>';

    //second table for navigation buttons
    document.getElementById("RecipeOutput").innerHTML += '<table><tr><td class=\"nextPrev\"><input type=\"button\" id=\"firstPage\" value=\"<<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"prev\" value=\"<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"next\" value=\">\"></input></td><td class=\"nextPrev\"><input type=\"button\" id=\"lastPage\" value=\">>\"></input></td></tr></table>';

    if (resultIndex + resultsPerPage <= totalResults) {
        document.getElementById("RecipeOutput").innerHTML += "<p>Showing " + (resultIndex + 1) + "-" + (resultIndex + resultsPerPage) + " of " +
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
        if (resultIndex + resultsPerPage >= totalResults) {
            window.alert("No more recipes to show");
        } else {
            resultIndex += resultsPerPage;
            buildTable();
        }
    });

    //first page button
    document.getElementById("firstPage").addEventListener("click", function () {
        if (resultIndex == 0) {
            window.alert("You're alreay at the begining of the list of recipes.");
            //break;
        } else {
            resultIndex = 0;
            buildTable();
        }
    });

    //previous button
    document.getElementById("prev").addEventListener("click", function () {
        if (resultIndex - resultsPerPage < 0 && resultIndex > 0) {
            resultIndex = 0;
            buildTable();
        } else if (resultIndex - resultsPerPage < 0) {
            window.alert("This is the begining of the recipe list.");
        } else {
            resultIndex -= resultsPerPage;
            buildTable();
        }
    });

    //Last page button
    document.getElementById("lastPage").addEventListener("click", function () {
        if (resultIndex + resultsPerPage >= totalResults) {
            window.alert("You're alreay at the end of the list of recipes.");
        } else {
            resultIndex = totalResults - resultsPerPage;
            buildTable();
        }
    });
};

function getURL() {
    //var resultsPerSearch = Math.floor(document.getElementById("recipePerPage").value);
    var urlBegin = "http://localhost:1337/api/spoonacular/getRecipes";
    var ingredientInput = document.getElementById("searchTerm").value;
    var URL = (urlBegin + "?apiKey=" + apiKey + "&instructionsRequired=true&includeIngredients=" + ingredientInput + "&number=100");

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

async function getRecipeData(URL) {
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
