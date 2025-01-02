console.log("JavaScript file loaded correctly");
//* Global Variables down below
const itemsPerPage = 12;
// let currentPage = 1;
const apiUrl = "https://api.themoviedb.org/3?";
const exploringEndpoint = "discover/movie";
const apiKey = "3cb0d2bc09efade109b0b6a67290e815";
//!TA bort?
let objectManipulationArray = [];
let movieArray = [];
let spotlightArray = [];
let movieWatchListArray = [];
let exploreArray = [];
const movieObject = {
    id: undefined,
    title: "",
    overview: "",
    img: undefined,
    release: ""
};
//*---------------
//*   DOM Creation
const spotlightSection = document.getElementById("spotlightSection");
const watchListContainer = document.getElementById("watchListContainer");
// const exploreContainer = document.getElementById("exploreContainer");
//*---------------
window.addEventListener("DOMContentLoaded", async function setup(event) {
    console.log("DOMContentLoaded called");
    checkUserPage();
});
async function checkUserPage() {
    // declares current page being visited
    const currentPage = window.location.pathname;
    //* Calls all relevant functions based on where user is located
    if (currentPage.endsWith("index.html")) {
        //TODO make it so that spotlight can also be displayed on explore
        console.log("user is visiting index.html");
        await movieApiFetch();
        console.log("exploreArray", exploreArray);
        if (watchListContainer) displayWatchlist();
    } else {
        console.log("user is visiting explore.html");
        console.log("spotlightArray", spotlightArray);
        console.log("filterSetup called from userCheck");
        filteringSetup(filterButton, dropdownOptions);
        await movieExploreFetch();
        if (watchListContainer) displayWatchlist();
    }
}
//* fetch functions-------------------
//TODO change to be specifiacally spotlight
async function movieApiFetch() {
    console.log("fetching data from TMDB API");
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`);
        if (!response.ok) {
            apiError(response);
            return;
        }
        const movieData = await response.json();
        //TODO remove movie array step
        movieArray = movieData.results;
        movieArray.forEach((movie)=>{
            objectCreation(movie);
        });
        console.log("movieArray", movieArray);
        spotlightArray = movieArray.slice(0, 10);
        console.log("spotlightArray", spotlightArray);
        spotlightArray.forEach((movie)=>{
            createSpotlightObject(movie);
        });
    } catch (err) {
        console.error("Error fetching data:", err.message);
        apiError();
    }
}
async function movieExploreFetch() {
    //TODO function fetching pages with option to load more.
    try {
        const totalPages = 5;
        fetchArray = [];
        for(let i = 1; i <= totalPages; i++){
            fetchArray.push(fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc`));
            console.log(`Page: ${i} pushed to be fetched`);
        }
        const responses = await Promise.all(fetchArray);
        const rejectedPromise = responses.find((response)=>!response.ok);
        if (rejectedPromise) {
            console.error(`Error when fetching pages: ${responses.indexOf(rejectedPromise) + 1} `);
            apiError(rejectedPromise.status);
            return;
        }
        const movieData = await Promise.all(responses.map((response)=>response.json()));
        //combines the pages to a single array
        exploreArray = movieData.flatMap((data)=>data.results);
        console.log("exploreArray", exploreArray);
        exploreArray.forEach((movie)=>{
            createExploreObject(movie);
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        apiError();
    }
//TODO Switch for sort by or alike maybe?
}
//-------------------
//* DOM manipulation-------------------
function createSpotlightObject(movie) {
    const movieContainer = document.createElement("article");
    movieContainer.setAttribute("class", "movieContainer");
    //TODO FIX SO THE FUNCTION CAN PLACE THE ARTICLES IN DIFFERENT NODES
    spotlightSection.appendChild(movieContainer);
    //* original_title
    const movieTitle = document.createElement("h4");
    movieTitle.textContent = movie.original_title;
    movieTitle.setAttribute("class", "movieTitle");
    movieContainer.appendChild(movieTitle);
    //* Save to localStorage button
    const watchlistButton = document.createElement("button");
    watchlistButton.setAttribute("class", "watchlistButton");
    watchlistButton.textContent = "Add to Watchlist";
    movieContainer.appendChild(watchlistButton);
    //* backdrop_path 
    const movieImg = document.createElement("img");
    movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    movieImg.setAttribute("alt", movie.original_title);
    movieImg.setAttribute("class", "movieImg");
    movieContainer.appendChild(movieImg);
    //* overview
    const moviePlot = document.createElement("p");
    moviePlot.textContent = movie.overview;
    moviePlot.setAttribute("class", "moviePlot");
    movieContainer.appendChild(moviePlot);
    //* release_date
    const movieRelease = document.createElement("p");
    movieRelease.textContent = movie.release_date;
    movieRelease.setAttribute("class", "movieRelease");
    movieContainer.appendChild(movieRelease);
}
function createWatchlistObject(movie) {
    const movieContainer = document.createElement("article");
    movieContainer.setAttribute("class", "movieContainer");
    //TODO FIX SO THE FUNCTION CAN PLACE THE ARTICLES IN DIFFERENT NODES
    watchListContainer.appendChild(movieContainer);
    //* original_title
    const movieTitle = document.createElement("h4");
    movieTitle.textContent = movie.title;
    movieTitle.setAttribute("class", "movieTitle");
    movieContainer.appendChild(movieTitle);
    //* Save to localStorage button
    const watchlistButton = document.createElement("button");
    watchlistButton.setAttribute("class", "removeButton");
    watchlistButton.textContent = "remove";
    movieContainer.appendChild(watchlistButton);
    //* backdrop_path 
    const movieImg = document.createElement("img");
    movieImg.setAttribute("src", `${movie.img}`);
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute("class", "movieImg");
    movieContainer.appendChild(movieImg);
    //* overview
    const moviePlot = document.createElement("p");
    moviePlot.textContent = movie.overview;
    moviePlot.setAttribute("class", "moviePlot");
    movieContainer.appendChild(moviePlot);
    //* release_date
    const movieRelease = document.createElement("p");
    movieRelease.textContent = movie.release;
    movieRelease.setAttribute("class", "movieRelease");
    movieContainer.appendChild(movieRelease);
}
function createExploreObject(movie) {
    const movieContainer = document.createElement("article");
    movieContainer.setAttribute("class", "movieContainer");
    //TODO FIX SO THE FUNCTION CAN PLACE THE ARTICLES IN DIFFERENT NODES
    exploreContainer.appendChild(movieContainer);
    //* original_title
    const movieTitle = document.createElement("h4");
    movieTitle.textContent = movie.original_title;
    movieTitle.setAttribute("class", "movieTitle");
    movieContainer.appendChild(movieTitle);
    //* Save to localStorage button
    const watchlistButton = document.createElement("button");
    watchlistButton.setAttribute("class", "watchlistButton");
    watchlistButton.textContent = "Add to Watchlist";
    movieContainer.appendChild(watchlistButton);
    //* backdrop_path 
    const movieImg = document.createElement("img");
    movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    movieImg.setAttribute("alt", movie.original_title);
    movieImg.setAttribute("class", "movieImg");
    movieContainer.appendChild(movieImg);
    //* overview
    const moviePlot = document.createElement("p");
    moviePlot.textContent = movie.overview;
    moviePlot.setAttribute("class", "moviePlot");
    movieContainer.appendChild(moviePlot);
    //* release_date
    const movieRelease = document.createElement("p");
    movieRelease.textContent = movie.release_date;
    movieRelease.setAttribute("class", "movieRelease");
    movieContainer.appendChild(movieRelease);
}
//-------------------
//* Watch List ------------------------
//* Function that can save Movies to your watch list by stringifying it to localStorage, and on WindowLoaded should then decypher the data and create DOM elements in the WatchListContainer
spotlightSection.addEventListener("click", function(event) {
    if (event.target.classList.contains("watchlistButton")) {
        console.log("WatchlistButton pressed just now");
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
        };
        //TODO återkoppling på knappttryck
        localStorageAddition(localMovie);
    }
});
//* Function that is tied to the remove button, so you can remove Movies in your watchlist. 
watchListContainer.addEventListener("click", function(event) {
    console.log("remove button pressed");
    //*If event checks to see if there is a remove button in watchListContainer
    if (event.target.classList.contains("removeButton")) {
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
        };
        //* Calls this function with the parameters of the localMovie Object 
        localStorageSubtraction(localMovie, movieContainer);
    }
});
function localStorageAddition(localMovie) {
    if (localStorage.key(`${localMovie.title}-${localMovie.release}` !== `${localMovie.title}-${localMovie.release}`)) //TODO More flashy error handling needed   
    alert("item already added to watchlist");
    else {
        const uniqueKey = `${localMovie.title}-${localMovie.release}`;
        localStorage.setItem(uniqueKey, JSON.stringify(localMovie));
        console.log("Item succesfully put in localStorage");
        displayWatchlist();
    }
}
function localStorageSubtraction(localMovie, movieContainer) {
    console.log("it came to here");
    //* It takes the keys (title and release) of localMovie. And removes the movie from local Storage, While also removing the movie article container 
    const uniqueKey = `${localMovie.title}-${localMovie.release}`;
    localStorage.removeItem(uniqueKey);
    watchListContainer.removeChild(movieContainer);
}
function displayWatchlist() {
    console.log("Watchlist function called");
    if (localStorage.length >= 0) for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        const movie = JSON.parse(localStorage.getItem(key));
        console.log("WatchlistedMovie", movie);
        createWatchlistObject(movie);
    }
}
//---------------------------
//* Misc functions-------------------
function objectCreation(movie) {
    console.log("Object creation function called");
    const generalMovieObject = Object.create(movieObject);
    generalMovieObject.id = movie.id;
    generalMovieObject.title = movie.original_title;
    generalMovieObject.overview = movie.overview;
    generalMovieObject.img = movie.poster_path;
    generalMovieObject.release = movie.release_date;
    objectManipulationArray.push(generalMovieObject);
}
function apiError(status) {
    console.log("ApiError function error message");
    switch(status){
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
function filteringSetup() {
    console.log("filterSetup called");
    const filterButton1 = document.getElementById("filterButton");
    const dropdownOptions1 = document.getElementById("dropdownOptions");
    console.log("dropdownOptions", dropdownOptions1);
    filteringEventListeners(filterButton1, dropdownOptions1);
}
function filteringEventListeners(filterButton1, dropdownOptions1) {
    console.log("filtering function");
    //* dropdown is hidden at first, but then filterbutton gets pressed, it adds the class "show" to the dropdownOptions element so it will be unhidden
    if (filterButton1) filterButton1.addEventListener('click', ()=>{
        console.log("filter by clicked");
        // dropdownOptions.setAttribute("class", "show");
        dropdownOptions1.classList.toggle("show");
    //Todo convert this to DOM?
    });
    //!when button is clicked dropdownOptions class becomes undefined thats the problem
    if (dropdownOptions1) //removes alternatives
    document.addEventListener('click', (event)=>{
        //TODO mouseout event instead on dropdownOpt
        if (!dropdownOptions1.contains(event.target && event.target !== filterButton1)) {
            console.log("remove class show");
            dropdownOptions1.classList.remove('show');
        }
    });
    const filterOptions = dropdownOptions1.querySelectorAll("a");
    filterOptions.forEach((option)=>{
        option.addEventListener("click", (event)=>{
            event.preventDefault();
            const optionReturn = option.textContent;
            console.log(`filter option: ${optionReturn} clicked`);
            // filteredfetch(optionReturn)        
            dropdownOptions1.classList.remove("show");
        });
    });
} //-------------------
 //*filter by genre for the filter function. 
 //?in the same endpoint Check movieobjects key: genre_ids. with a numerical value(or array of several)
 // when for example the fantasy genre button should handle an switch case if pressed it should give value of 18 and the fetch paramters will be adjusted accordingly 1
 //! Next step is: 
 // Async planning
 // SÅ SOM
 //             OBS!    [filter by],
 //             filter by  in exploringContainer.
 //             When the user presses filter by button (onclick)
 //             Dropdown nodeElement shoud display 4 or more buttons for different  parameters 
 //             they should be handled with a switch case to get the corresponding endpoint/parameter
 //             possible endpoint = https://developer.themoviedb.org/reference/genre-movie-list 
 //             possible endpoint https://developer.themoviedb.org/reference/discover-movie
 //             Possible endpoint = https://developer.themoviedb.org/reference/movie-popular-list
 //             OBS!    [searchinput].
 //                 Search endpoint https://developer.themoviedb.org/reference/search-movie
 //             function that takes user input to search for a movie by title and populates the explore container with possible results
 //             headerinput should make a a search in movielist(GlobalSearch) or smth alike, If user on home, open explore tab and results should display in explore
 //             search inpput in explore --> main section should search by title in current endpoint being displayed(LocalSearch)
 //             OBS!    [Hämta flera pages från api med promise.all]
 //             async function that should fetch several pages from the API and handle all the results with promise.all
 //             OBS! when clicking a movie object, it could fetch the reviews for the movie in a modal of some kind
 //             https://developer.themoviedb.org/reference/review-details
 // }

//# sourceMappingURL=index.9345d665.js.map
