// JavaScript source code
//var apiKey = "4f19781fabb34431b48a2a5a3816b891";
var apiKey = "c6930cb9400e477fb79ec2682ebd7481";
var resultsPerSearch = 10;
var resultIndex = 0;
var numOfParam = 0;

document.getElementById("search").addEventListener("click", function () {
    resultIndex = 0;

    getRecipeData(getURL())
        .then((res) => buildTable(res));
});

document.getElementById("addParam").addEventListener("click", function () {
    const paramList = ["Key Word", "Excude Ingredients", "Cuisine", "Exclude Cuisine", "Diet", "Intolerances", "Equipment", "Course Type"];
    const paramSelector = ['<div class=\"parameter\" id=\"param' + numOfParam + '\"><input type=\"button\" id=\"deleteParam' + numOfParam +'\" value=\"x\"><select id=\"selector' + numOfParam + '\">'];

    //Add all search parameter to selector meno
    for (var i = 0; i < paramList.length; i++) {
        paramSelector.push('<option>' + paramList[i] + '</option>');
    }
    paramSelector.push('</select></div>');

    //document.getElementById("searchParameters").innerHTML += paramSelector.join("");
    document.getElementById("searchParameters").insertAdjacentHTML('beforeend', paramSelector.join(""));


    createEventForButton(numOfParam);

    numOfParam++;

    
});

async function buildTable(data) {
    var totalResults = data.totalResults;
    document.getElementById("RecipeOutput").innerHTML = '';
    const table = ['<table><thead><th>Image</th><th>Name</th></thead>'];

    for (var i = 0; i < resultsPerSearch && (resultIndex + i) < totalResults; i++) {
        table.push('<tr><td ><img src=\"' + data.results[i].image + '\"class=\"recipeImage\"/></td>');
        table.push('<td>' + data.results[i].title + ' ' + data.results[i].id + '</td> </tr>');
        //add link to page with recipe info 
        //add ingredient list
    }
    
    document.getElementById("RecipeOutput").innerHTML += table.join("") + '</table>';
    //second table for navigation buttons
    //first page and previous page buttons
    document.getElementById("RecipeOutput").innerHTML += '<table><tr><td class=\"nextPrev\"><input type=\"button\" id=\"firstPage\" value=\"<<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"prev\" value=\"<\"></input></td><td  class=\"nextPrev\"><input type=\"button\" id=\"next\" value=\">\"></input></td><td class=\"nextPrev\"><input type=\"button\" id=\"lastPage\" value=\">>\"></input></td></tr></table>';
    //next page and last page button
    //document.getElementById("RecipeOutput").innerHTML += '';

    if (resultIndex + resultsPerSearch <= totalResults) {
        document.getElementById("RecipeOutput").innerHTML += "<p>Showing " + (resultIndex + 1) + "-" + (resultIndex + resultsPerSearch) + " of " +
            totalResults + " total recipes</p>";
    } else {
        document.getElementById("RecipeOutput").innerHTML += "<p>Showing " + (resultIndex + 1) + "-" + totalResults + " of " +
            totalResults + " total recipes</p>";
    }

    //
    //Event listeners for Next, Last Page, Previous, and First Page buttons
    //
    //next button
    document.getElementById("next").addEventListener("click", function () {
        if (resultIndex + resultsPerSearch >= totalResults) {
            window.alert("No more recipes to show");
            //break;
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
        if (resultIndex - resultsPerSearch < 0) {
            window.alert("This is the begining of the recipe list.");
            //break;
        } else {
            resultIndex -= resultsPerSearch;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });

    //Last page button
    document.getElementById("lastPage").addEventListener("click", function () {
        if (resultIndex + resultsPerSearch >= totalResults) {
            window.alert("You're alreay at the begining of the list of recipes.");
            //break;
        } else {
            resultIndex = totalResults - resultsPerSearch;
            getRecipeData(getURL())
                .then((res) => buildTable(res));
        }
    });
};

function getURL() {
    var urlBegin = "https://api.spoonacular.com/recipes/complexSearch";
    var ingredientInput = document.getElementById("searchTerm").value;
    var URL = (urlBegin + "?apiKey=" + apiKey + "&addRecipeInformation=true&instructionsRequired=true&includeIngredients=" + ingredientInput + "&number=" + resultsPerSearch + "&offset=" + resultIndex);


    return URL;
}

function getRecipeData(URL) {
    return fetch(URL)
        .then((response) => response.json())
        .catch(function (err) {
            console.log(err);
        });
}

//create an array of event listers for delete buttons in search parameters div 
//If created one at a time the DOM only recognizes the most previous one created and leads to errors

function createEventForButton(value) {
    const eventList = [];
    /*
    for (var i = 0; i <= eventList.length; i++) {
        eventList.pop();
    }
    */
    //eventList.splice(0, eventList.length);
    console.log("Length before: " + eventList.length);
    //eventList = [];
    
    //for (var i = 0; i <= value; i++) {
    eventList.push(newListener(value));
    //}

    function newListener(value) {
        //check if a div exists with the id 
        if (document.getElementById("deleteParam" + value)) {
            console.log("Create event for " + value + "length:" + eventList.length);
            document.getElementById("deleteParam" + value).addEventListener("click", function () {
                //if (document.getElementById("deleteParam" + value)) {
                    console.log("deleting " + value + " length: " + eventList.length);
                    document.getElementById("param" + value).remove();
               // }  
              });
        }
    }
}
//Function to open new html page pasing in recipe id to get infodocument.getElementById("RecipeOutput").innerHTML += table + '</table>';
