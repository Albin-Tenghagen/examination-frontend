console.log("JavaScript file loaded correctly")

//* Global Variables down below
const itemsPerPage = 12;
let currentPage = 1;

const apiUrl = "https://api.themoviedb.org/3?"
const exploringEndpoint = "discover/movie"
const apiKey = "3cb0d2bc09efade109b0b6a67290e815"

let movieArray = [];

let objectManipulationArray = [];

let spotlightArray = [];

let movieWatchListArray = [];

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
    movieApiFetch()
    displayWatchlist()
})

async function movieApiFetch() {
    console.log("fetching data from TMDB API")
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`)

        if(!response.ok){
            errorMessage(response)
            return;
        }
        
        const movieData = await response.json();
        
        movieArray = movieData.results;
        movieArray.forEach(movie => {
            objectCreation(movie)
        })
        console.log("movieArray", movieArray)

        spotlightArray = movieArray.slice(0, 10)
        console.log("spotlightArray", spotlightArray)
        spotlightArray.forEach(movie => {
            createMovieObject(movie)
        });
    
    } catch (err) {
        
        console.error("Error fetching data:", err.message)
        errorMessage()

    }
}

function createMovieObject(movie){
    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    //TODO FIX SO THE FUNCTION CAN PLACE THE ARTICLES IN DIFFERENT NODES
    spotlightSection.appendChild(movieContainer)


    //* original_title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.original_title
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)

    //* Save to localStorage button
    const watchlistButton = document.createElement("button")
    watchlistButton.setAttribute("class", "watchlistButton")
    watchlistButton.textContent = "Add to Watchlist"
    movieContainer.appendChild(watchlistButton)

    //* backdrop_path 
    const movieImg = document.createElement("img") 
    movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    movieImg.setAttribute("alt", movie.original_title)
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


    //* original_title
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

//* Function that can save Movies to your watch list by stringifying it to localStorage, and on WindowLoaded should then decypher the data and create DOM elements in the WatchListContainer
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
        localStorageAddition(localMovie)
    }   
})

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

function objectCreation(movie){
    console.log("Object creation function called")
    const generalMovieObject = Object.create(movieObject)
    generalMovieObject.id = movie.id
    generalMovieObject.title = movie.original_title
    generalMovieObject.overview = movie.overview
    generalMovieObject.img = movie.poster_path
    generalMovieObject.release = movie.release_date

    objectManipulationArray.push(generalMovieObject)
    

}
// console.log("objectManipulationArray", objectManipulationArray)

function apiError(status) {
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
