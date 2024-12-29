console.log('JavaScript file loaded correctly')

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
    movieObjectId: undefined,
    movieObjectTitle: "",
    movieObjectOverview: "",
    movieObjectImg: undefined,
    movieObjectRelease: ""
}

//*---------------

//*   DOM Creation
const spotlightSection = document.getElementById("spotlightSection");

const watchListContainer = document.getElementsByClassName("watchListContainer");

//*---------------
//!
movieApiFetch()
async function movieApiFetch() {
    console.log("fetching data from OMDB API")
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
// async function spotlightMovieFetch() {
//     try {
//         const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`)

//         if(!response.ok){
//             errorMessage(response)
//             return;
//         }
        
//         const movieData = await response.json();
//         console.log(movieData)
        
//         movieArray = movieData.result;
//         console.log(movieArray.length)
//         // for (let index = 0; index < 10; index++) {
//         //     createSpotlightObject(movieData.result)
            
//         // }
//     } catch (err) {
        
//         console.error("Error fetching data:", err.message)
//         errorMessage()

//     }
// }   

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

//TODO Function that can save Movies to your watch list by stringifying it to localStorage, and on WindowLoaded should then decypher the data and create DOM elements in the WatchListContainer
spotlightSection.addEventListener("click", function (event){
    if (event.target.classList.contains('watchlistButton')) {
        event.preventDefault()
        console.log("WatchlistButton pressed just now")
        // Chooses the elements closest to the watchlistButton that was pressed.
        const movieContainer = event.target.closest('.movieContainer');
        const movieTitle = movieContainer.querySelector('.movieTitle').textContent;
        const movieOverview = movieContainer.querySelector('.moviePlot').textContent;
        const movieRelease = movieContainer.querySelector('.movieRelease').textContent;
        const movieImg = movieContainer.querySelector('.movieImg').src;

        // Create a movie object to stringify to JSON
        const movieLocalData = {
            movieTitle: movieTitle,
            movieOverview: movieOverview,
            movieRelease: movieRelease,
            movieImg: movieImg        
        }
        localStorageAddition(movieLocalData)
    }   
})





async function errorMessage() {
    // switch (status.value) {
    //     case False:
            //?Ska innehålla response false
    //         break;
    
    //     default:
    //         break;
    // }
}
function objectCreation(movie){
    const generalMovieObject = Object.create(movieObject)
    generalMovieObject.movieObjectId = movie.id
    generalMovieObject.movieObjectTitle = movie.original_title
    generalMovieObject.movieObjectOverview = movie.overview
    generalMovieObject.movieObjectImg = movie.poster_path
    generalMovieObject.movieObjectRelease = movie.release_date

    objectManipulationArray.push(generalMovieObject)
    

}
// console.log("objectManipulationArray", objectManipulationArray)

function localStorageAddition(movieLocalData){
    const watchlistedMovie = Object.create(movieObject);

    watchlistedMovie.movieObjectTitle = movieLocalData.movieTitle
    watchlistedMovie.movieObjectOverview = movieLocalData.movieOverview
    watchlistedMovie.movieObjectImg = movieLocalData.movieImg
    watchlistedMovie.movieObjectRelease = movieLocalData.movieRelease

    const uniqueKey = `${watchlistedMovie.movieObjectTitle}-${watchlistedMovie.movieObjectRelease}`
    localStorage.setItem(uniqueKey, JSON.stringify(watchlistedMovie))
    console.log("Item succesfully put in localStorage")
    displayWatchlist()
    
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
