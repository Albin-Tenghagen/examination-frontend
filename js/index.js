console.log("JavaScript file loaded correctly")

//* Global Variables down below
const itemsPerPage = 12;
// let currentPage = 1;

const apiUrl = "https://api.themoviedb.org/3?"
const exploringEndpoint = "discover/movie"
const apiKey = "3cb0d2bc09efade109b0b6a67290e815"


let spotlightArray = [];

let movieWatchListArray = [];

let exploreArray = []; 

const movieObject = {
    id: undefined,
    title: "",
    overview: "",
    img: undefined,
    release: ""
}

//*---------------


//*   DOM Creation
const spotlightSection = document.getElementById("spotlightSection");

const watchListContainer = document.getElementById("watchListContainer");

//*---------------

window.addEventListener("DOMContentLoaded", async function setup(event) {
    console.log("DOMContentLoaded called")
    checkUserPage()
})

async function checkUserPage() {
    // declares current page being visited
    const currentPage = window.location.pathname;
    
    //* Calls all relevant functions based on where user is located
    if(currentPage.endsWith("index.html") ){
        //TODO make it so that spotlight can also be displayed on explore
        console.log("user is visiting index.html")
        await spotlightApiFetch()

        console.log("spotlightApiFetch called from checkUserPage")
        
        if (watchListContainer) {
            displayWatchlist();
        }
        console.log("displayWatchlist called from checkUserPage")

    } else {
        console.log("user is visiting explore.html")
        
        formSubmission()
        // filteringSetup()
        // console.log("filterSetup called from checkUserPage")

       await ExploreApiFetch("popularity.desc")
       console.log("ExploreApiFetch called from checkUserPage")
       
       
       if (watchListContainer) {
         displayWatchlist();
        }
        console.log("displayWatchlist called from checkUserPage")
    }
    
}

//* fetch functions-------------------

async function spotlightApiFetch() {
    console.log("fetching data from TMDB API: Spotlight Section")
    try {

        //https://developer.themoviedb.org/reference/trending-movies instead
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)

        if(!response.ok){
            apiError(response)
            return;
        }

        const movieData = await response.json();
        console.log("spotlight Data succesfullly fetched", movieData)
        
        spotlightArray = movieData.results;

        console.log("spotlightArray", spotlightArray)
        spotlightArray.forEach(movie => {
            createSpotlightObject(movie)
    
        });
    
    } catch (err) {
        
        console.error("Error fetching data:", err.message)
        apiError()

    }
}

async function ExploreApiFetch(sorting, filter) {
    //TODO function fetching pages with option to load more. need to incorporate switch case filter handling
    console.log("fetching data from TMDB API: Spotlight Section")
    try {
        exploreContainer.replaceChildren()
        const totalPages = 5 
        fetchArray = [] ;
        for(let i = 1; i <= totalPages; i++){
           
            fetchArray.push(fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=${sorting}&with_genre${filter}&vote_count.gte=200`))    
            
        }

        const responses = await Promise.all(fetchArray)
        
        const rejectedPromise = responses.find((response) => !response.ok)

        if(rejectedPromise) {
            console.error(`Error when fetching pages: ${responses.indexOf(rejectedPromise) + 1} `)
            apiError(rejectedPromise.status)
            return
        }
        console.log("Explore fetches all succesful")
        const movieData = await Promise.all(responses.map((response) => response.json()))

        //combines the pages to a single array
        exploreArray = movieData.flatMap((data) => data.results);
        
        console.log("exploreArray", exploreArray)
        exploreArray.forEach(movie => {
            createExploreObject(movie)
        })


    } catch (error) {
        console.error("Error fetching data:", error.message)
        apiError()
    }
                
   
}
//-------------------

//* DOM manipulation-------------------

function createSpotlightObject(movie){
    const backdropPath = movie.backdrop_path

    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    spotlightSection.appendChild(movieContainer)


    //* title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.title
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)

    //* Save to localStorage button
    const watchlistButton = document.createElement("button")
    watchlistButton.setAttribute("class", "watchlistButton")
    watchlistButton.textContent = "Add to Watchlist"
    movieContainer.appendChild(watchlistButton)
    
    //* backdrop_path 
    const movieImg = document.createElement("img") 
    const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
    : "https://placehold.co/500x281"
    movieImg.setAttribute("src", backdropUrl)
    movieImg.setAttribute("alt", movie.title)
    movieImg.setAttribute("class", "movieImg")
    movieContainer.appendChild(movieImg)
    
    //* overview
    const moviePlot = document.createElement("p")
    moviePlot.textContent = movie.overview
    moviePlot.setAttribute("class", "moviePlot")
    movieContainer.appendChild(moviePlot)
    
    //* release_date
    const movieRelease = document.createElement("p")
    movieRelease.textContent = movie.release_date;
    movieRelease.setAttribute("class", "movieRelease")
    movieContainer.appendChild(movieRelease)
    

}
function createWatchlistObject(movie){
    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    //TODO FIX SO THE FUNCTION CAN PLACE THE ARTICLES IN DIFFERENT NODES
    watchListContainer.appendChild(movieContainer)


    //* title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.title
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)

    //* Save to localStorage button
    const watchlistButton = document.createElement("button")
    watchlistButton.setAttribute("class", "removeButton")
    watchlistButton.textContent = "remove"
    movieContainer.appendChild(watchlistButton)

    //* backdrop_path 
    const movieImg = document.createElement("img") 
    movieImg.setAttribute("src", `${movie.img}`)
    movieImg.setAttribute("alt", movie.title)
    movieImg.setAttribute("class", "movieImg")
    movieContainer.appendChild(movieImg)
    
    //* overview
    const moviePlot = document.createElement("p")
    moviePlot.textContent = movie.overview
    moviePlot.setAttribute("class", "moviePlot")
    movieContainer.appendChild(moviePlot)
    
    //* release_date
    const movieRelease = document.createElement("p")
    movieRelease.textContent = movie.release;
    movieRelease.setAttribute("class", "movieRelease")
    movieContainer.appendChild(movieRelease)
    

}
function createExploreObject(movie) {
   
    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    exploreContainer.appendChild(movieContainer)


    //* title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.title 
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)

    //* Save to localStorage button
    const watchlistButton = document.createElement("button")
    watchlistButton.setAttribute("class", "watchlistButton")
    watchlistButton.textContent = "Add to Watchlist"
    movieContainer.appendChild(watchlistButton)

    //* backdrop_path 
    const movieImg = document.createElement("img") 
    const backdropUrl = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
        : "https://placehold.co/500x281"
    movieImg.setAttribute("src", backdropUrl) 
    movieImg.setAttribute("alt", movie.title)
    movieImg.setAttribute("class", "movieImg")
    movieContainer.appendChild(movieImg)
    
    //* overview
    const moviePlot = document.createElement("p")
    moviePlot.textContent = movie.overview
    moviePlot.setAttribute("class", "moviePlot")
    movieContainer.appendChild(moviePlot)
    
    //* release_date
    const movieRelease = document.createElement("p")
    movieRelease.textContent = movie.release_date;
    movieRelease.setAttribute("class", "movieRelease")
    movieContainer.appendChild(movieRelease)
    

}
//-------------------

//* Watch List ------------------------

//* Function that can save Movies to your watch list by stringifying it to localStorage, and on WindowLoaded should then decypher the data and create DOM elements in the WatchListContainer
//TODO Savebutton for watchlist needs to be usuable in every movie container. 
//TODO Also the button needs confirm state if already added 
spotlightSection.addEventListener("click", function (event){
    if (event.target.classList.contains("watchlistButton")) {

           console.log("WatchlistButton pressed just now")
           // Chooses the elements closest to the watchlistButton that was pressed.
           const movieContainer = event.target.closest(".movieContainer");
           const movieTitle = movieContainer.querySelector(".movieTitle").textContent;
           const movieOverview = movieContainer.querySelector(".moviePlot").textContent;
           const movieRelease = movieContainer.querySelector(".movieRelease").textContent;
           const movieImg = movieContainer.querySelector(".movieImg").src;

        
        // Create a movie object to stringify to JSON
        const localMovie = {
            title: movieTitle,
            overview: movieOverview,
            release: movieRelease,
            img: movieImg        
        }
        //TODO återkoppling på knappttryck
        localStorageAddition(localMovie)
    }   
})

//* Function that is tied to the remove button, so you can remove Movies in your watchlist. 
watchListContainer.addEventListener("click", function(event) {
    console.log("remove button pressed")
    //*If event checks to see if there is a remove button in watchListContainer
    if(event.target.classList.contains("removeButton")) {
        //* And with queryselector it finds the  DOM elements, that are then passed to keys for localMovie
        const movieContainer = event.target.closest(".movieContainer");
        const movieTitle = movieContainer.querySelector(".movieTitle").textContent;
        const movieOverview = movieContainer.querySelector(".moviePlot").textContent;
        const movieRelease = movieContainer.querySelector(".movieRelease").textContent;
        const movieImg = movieContainer.querySelector(".movieImg").src;
        
        // Create a movie object to stringify to JSON
        const localMovie = {
            title: movieTitle,
            overview: movieOverview,
            release: movieRelease,
            img: movieImg        
        }
        //* Calls this function with the parameters of the localMovie Object 
        localStorageSubtraction(localMovie, movieContainer)
    }
})

//* Checks localStorage for a key, if the key is already there then the function will alert the user and not add the the movie again. Preventing duplications of items in the watchlist. 
function localStorageAddition(localMovie){
   if (localStorage.key(`${localMovie.title}-${localMovie.release}` !== `${localMovie.title}-${localMovie.release}`)) {
    //TODO More flashy error handling needed   
    alert("item already added to watchlist")
    
} else {
    const uniqueKey = `${localMovie.title}-${localMovie.release}`
    localStorage.setItem(uniqueKey, JSON.stringify(localMovie))
    console.log("Item succesfully put in localStorage")
    displayWatchlist()
    }
        
}

function localStorageSubtraction(localMovie, movieContainer) {
    console.log("it came to here")
    //* It takes the keys (title and release) of localMovie. And removes the movie from local Storage, While also removing the movie article container 
    const uniqueKey = `${localMovie.title}-${localMovie.release}`
    localStorage.removeItem(uniqueKey)

    watchListContainer.removeChild(movieContainer)

}

function displayWatchlist(){
    console.log("Watchlist function called")
    if (localStorage.length >= 0) {

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const movie = JSON.parse(localStorage.getItem(key));
            console.log("WatchlistedMovie", movie)
            createWatchlistObject(movie)
        }
    }
}
//---------------------------


//* Misc functions-------------------

function apiError(status) {
    console.log("ApiError function error message")
    switch (status) {
        case 401:
            alert("Unauthorized! Check your API key.");
            break;
        case 404:
            alert("Resource not found!");
            break;
        case 500:
            alert("Server error. Try again later.");
            break;
        default:
            alert("Something went wrong.");
    }
}

//* dropDown menu for sorting/filtering movies
// function filteringSetup(){
//     console.log("filterSetup called")

//     const filterButton = document.getElementById("filterButton")
//     if (filterButton) {
//         filterButton.addEventListener('click', () => {
//             console.log("filterButton pressed")
                        
//             let dropDownMenu = document.getElementById("dropDownMenu")
//             if (!dropDownMenu) {
//                 console.log("dropDownMenu created")
//                 dropDownMenu = document.createElement("div")
//                 dropDownMenu.setAttribute("id", "dropDownMenu")

//                 const filterCategories = [
//                     { label: "Popularity (Desc)", value: "popularity.desc" },
//                     { label: "A-to-Z", value: "title.asc" },
//                     { label: "Z-to-A", value: "title.desc" },
//                     { label: "Top Rated", value: "vote_average.desc" },
//                 ]

               
//                 filterCategories.forEach((filterCategory) => {
//                     const categoryButton = document.createElement("button")
//                     categoryButton.textContent = filterCategory.label;

//                         categoryButton.addEventListener("click", () => {
//                             console.log(`categoryButton clicked: ${categoryButton.textContent}`);
//                             handleUserSelection(filterCategory.value); // Call function based on button value
//                             dropDownMenu.remove(); // Remove dropdown after selection
                            
//                         });

//                     dropDownMenu.appendChild(categoryButton);
//                 });

//                 filterButton.parentElement.appendChild(dropDownMenu);
//             } else {
//                 dropDownMenu.remove(); // Toggle visibility by removing
//             }
//         });
//     }
//     document.addEventListener("click", (event) => {
//         const dropDownMenu = document.getElementById("dropDownMenu");
//         if (
//             dropDownMenu &&
//             !dropDownMenu.contains(event.target) &&
//             event.target !== filterButton
//         ) {
//             console.log("remove dropDownMenu");
//             dropDownMenu.remove();
//         }
//     });
// }

function formSubmission() { 
    console.log("formSubmission called")
    formContainer = document.getElementById("filterSorting")
    console.log("formContainer", formContainer)

    if (formContainer) {
    formContainer.addEventListener("submit", function(event) {
        event.preventDefault()
        
        const sorting = document.getElementById("sortingOptions").value
        const filter = document.getElementById("filterOptions").value
        console.log("formValue 2:", filter)
        console.log("formValue 1:", sorting)

        ExploreApiFetch(sorting,filter)
    })
}

}



// function handleUserSelection(filterCategory) {
//     console.log("handleUserSelection function called with value:", filterCategory)
//     switch (filterCategory) {
//         case "title.asc":
//             console.log("Sort: A-to-Z");
//             ExploreApiFetch(filterCategory)
//             break;
//         case "title.desc":
//             console.log("Sort: Z-to-A");
//             ExploreApiFetch(filterCategory)
//             break;
//         case "popularity.desc":
//             console.log("Sort: Popularity (Desc)");
//             ExploreApiFetch(filterCategory)
//             break;
//         case "vote_average.desc":
//             console.log("Sort: Top Rated");
//             ExploreApiFetch(filterCategory)
//             break;
//         default:
//             console.log("Default case: Invalid category, fallback to popularity.desc");
//             break;
// }
// }
