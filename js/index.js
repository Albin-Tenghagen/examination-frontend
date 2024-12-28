console.log('JavaScript file loaded correctly')

//* Global Variables down below
const itemsPerPage = 12;
let currentPage = 1;
const apiUrl = "https://api.themoviedb.org/3?"
const exploringEndpoint = "discover/movie"
const apiKey = "3cb0d2bc09efade109b0b6a67290e815"
let movieArray = [];
let spotlightArray = [];
let movieWatchListArray = [];

//*---------------

//*   DOM Creation
const spotlightSection = document.getElementById("spotlightSection");

const watchListContainer = document.getElementsByClassName("watchListContainer");

//*---------------

movieApiFetch()

async function movieApiFetch() {
    console.log("fetching data from OMDB API")
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`)

        if(!response.ok){
            errorMessage(response)
            return;
        }
        
        const movieData = await response.json();
        
        movieArray = movieData.results;
        console.log(movieArray)

        spotlightArray = movieArray.slice(0, 10)
        console.log(spotlightArray)
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
    spotlightSection.appendChild(movieContainer)


    //TODO original_title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.original_title
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)

    //TODO Save to localStorage button
    const watchlistButton = document.createElement("button")
    watchlistButton.setAttribute("class", "watchlistButton")
    watchlistButton.textContent = "Add to Watchlist"
    movieContainer.appendChild(watchlistButton)

    //TODO backdrop_path 
    const movieImg = document.createElement("img") 
    movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    movieImg.setAttribute("alt", movie.original_title)
    movieImg.setAttribute("class", "movieImg")
    movieContainer.appendChild(movieImg)
    
    //TODO overview
    const moviePlot = document.createElement("p")
    moviePlot.textContent = movie.overview
    moviePlot.setAttribute("class", "moviePlot")
    movieContainer.appendChild(moviePlot)
    
    //TODO release_date
    const movieRelease = document.createElement("p")
    movieRelease.textContent = movie.release_date;
    movieRelease.setAttribute("class", "movieRelease")
    movieContainer.appendChild(movieRelease)
    

}


//TODO Function that can save Movies to your watch list by stringifying it to localStorage, and on WindowLoaded should then decypher the data and create DOM elements in the WatchListContainer
async function errorMessage() {
    // switch (status.value) {
    //     case False:
            //?Ska innehålla response false
    //         break;
    
    //     default:
    //         break;
    // }
}
