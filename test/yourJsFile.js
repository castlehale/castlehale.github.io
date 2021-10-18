/*
    dataAPI() returns an object with two api methods you can cell to get data:
        getNames() - Retrieves a list of data items with names and ids
        getCounts() - Retrieves a list of data items with counts and ids
    Both return promises that resolve after a few seconds with the requested data (or possibly reject with an error message).

    tableModule() returns an object with one method: intance(). It is provided here for you to use
        like a 3rd party library for a table widget (though it's actually quite primitive). Here is the documentation on
        how to configure your table:

        intance(id, options) - Finds an element on the page with matching id, and builds a table using the provided options.
            options: {
                dataSource: An array of data items, each an object containing one or more fields of data.
                    Example: [{ field1: 2, field2: 'foo' }, { field1: 5, field2: 'bar'}, ...]
                columns: An array of column configurations. Each should be an object with the following properties:
                    sourceField: The name of the field in each data item to use for this column's values
                    caption: The title of the column to display at the top
                    format(value) (optional): A callback function that is executed for each value. It provides the value 
                        as the only parameter, and should return the formatted version of the value to display
                    Example: [{ sourceField: 'field1', caption: 'Dollars', format: (num) => '$' + num }, { sourceField: 'field2', caption: 'Text' }]
            }
*/


//declaring anything that might break up here -- i really should have used more meaningful var names here...
let API = dataAPI();
let TM = tableModule();
var arr2 = {};
var arr4 = {};
var sum = 0;
var result;
var prc = [];
var merged = {};

// load / error screen css manipulator... probably needs a window.console funcion to catch logs and be more verbose...
function loadingScreen() {
  var loading = document.getElementById("loading");
  if (loading.style.display === "none") {
      loading.style.display = "block";
  } else {
      loading.style.display = "none";
  }
}
function errorScreen() {
    var loading = document.getElementById("table");
    if (loading.style.display === "block") {
        loading.style.display = "none";
    }
    var loading = document.getElementById("loading");
    if (loading.style.display === "block") {
        loading.style.display = "none";
    }
    var loading = document.getElementById("error");
    if (loading.style.display === "none") {
        loading.style.display = "block";
    }
}

//resolving promises
(async function() {
    const asyncFunctions = [
        API.getNames(),
        API.getCounts()
    ];
    const result = await Promise.all(asyncFunctions);
    arr2 = result[0];
    arr4 = result[1];
    rMerge(arr2, arr4)
})();

//merging data
function rMerge(firstOne, secondOne) {
    
    if (firstOne !== 0) {
        arr2 = firstOne
    }
    if (firstOne == 0 | null | undefined) {
        console.log("Name & ID Data Source Failure");
        errorScreen();
    }
    if (secondOne == 0 | null | undefined) {
        console.log("Count & ID Data Source Failure");
        errorScreen();
    }
    if (secondOne !== 0) {
        arr4 = secondOne;
        // get sum total
        for (var i = 0; i < secondOne.length; i++) {
            sum += secondOne[i].count;
        }
// when sum is ready, almost everything else is liquid. this removes the loading message & shows table
      loadingScreen();  

 //push percentile to key/val pair by id
        for (var i = 0; i < secondOne.length; i++) {
            if (arr4[i].count > -1) {
                prc.push({
                    "id": (arr4[i].id),
                    "percentile": (((arr4[i].count) / sum) * 100).toFixed(2)
                })

            }
        }
    }
    //merge name w/ counts    
    if (secondOne !== 0) {
        merged = arr2.map(obj => {
            let data = arr4.find(item => item.id === obj.id);
            return {
                ...obj,
                ...data
            }

        });
    }

    //merge names & counts w/ percentile score and ship but ONLY IF ALL PROMISES WERE KEPT!!
    if (secondOne !== 0) {

        mergedF = merged.map(obj => {
            let data = prc.find(item => item.id === obj.id && !null);

// Feature Debt: check for and do something with undefined data here

            return {
                ...obj,
                ...data
            }

        });

// Feature Debt:  sort data into alphabetical order before shipping it to the DOM...


        //end of merge name/percentile stuff      console.log(mergedF)
        var tableOptions = {
            "dataSource": mergedF,
            "columns": [{
                "sourceField": "id",
                "caption": "ID"
            }, {
                "sourceField": "name",
                "caption": "Name"
            }, {
                "sourceField": "count",
                "caption": "Count"
            }, {
                "sourceField": "percentile",
                "caption": "Percentage",
                "format": (num) => '%' + num
            }]
        }
        //end of table options stuff

        // put it in a table
        TM.instance('table', tableOptions)

    } 

} //end of rMerge Function