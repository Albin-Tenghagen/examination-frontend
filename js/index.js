//* Global Variables down below
const apiUrl = "https://api.themoviedb.org/3?"
const exploringEndpoint = "discover/movie"
const apiKey = "3cb0d2bc09efade109b0b6a67290e815"

let spotlightArray = [];

let movieWatchListArray = [];

let exploreArray = []; 

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

    } else if(currentPage.endsWith("explore.html")){
        console.log("user is visiting explore.html")
        
        formSubmission()
       await spotlightApiFetch() 
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
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)

        if(!response.ok){
            snackError(response)
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
        
        console.error("Error fetching data:", err.message);
        snackError(err.message);

    }
}
async function ExploreApiFetch(sorting, filter) {
    //TODO function fetching pages with option to load more.
    console.log("fetching data from TMDB API: Spotlight Section")
    try {
        exploreContainer.replaceChildren()
        const totalPages = 2 
        fetchArray = [] ;
        for(let i = 1; i <= totalPages; i++){
           
            fetchArray.push(fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=${sorting}&with_genre=${filter}&vote_count.gte=200`))    
            console.log(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=${sorting}&with_genre=${filter}&vote_count.gte=200`);    
            
        }
        
        const responses = await Promise.all(fetchArray)
        
        const rejectedPromise = responses.find((response) => !response.ok)

        if(rejectedPromise) {
            console.error(`Error when fetching pages: ${responses.indexOf(rejectedPromise) + 1} `)
            snackError(rejectedPromise.status)
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
        snackError()
    }
                
   
}
//-------------------

//* DOM manipulation-------------------

function createSpotlightObject(movie){

    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    // Added movie.id for the overlay function
    movieContainer.setAttribute("data-movie-id", movie.id)
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
    // Added movie.id for the overlay function
    movieContainer.setAttribute("data-movie-id", movie.id)
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

function toggleMovieOverlay(movieContainer, movie) {
    // Check if overlay already exists
    let overlay = movieContainer.querySelector(".movieOverlay");

    if (!overlay) {
        // Create overlay
        overlay = document.createElement("div");
        overlay.setAttribute("class", "movieOverlay");

        // Add more detailed information to the overlay
        const overlayContent = document.createElement("div");
        overlayContent.setAttribute("class", "overlayContent");

        // Add detailed movie info to the overlay
        const detailedInfo = `
            <h3>${movie.title}</h3>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}" />
            <p><strong>Reviews:</strong> ${movie.vote_average}/10</p>
            <p><strong>Genres:</strong> ${movie.genre_ids}</p>
        `;
        overlayContent.innerHTML = detailedInfo;

        // Add a close button to the overlay
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.setAttribute("class", "closeOverlay");
        closeButton.addEventListener("click", () => {
            overlay.remove(); // Remove overlay when close button is clicked
        });
        overlayContent.appendChild(closeButton);

        overlay.appendChild(overlayContent);
        movieContainer.appendChild(overlay);
    } else {
        // If overlay already exists, remove it
        overlay.remove();
    }
}
//-------------------
//* Watch List ------------------------
// Centralised the eventlisteners so the movies on the explore page are also interactable. 
document.addEventListener("click", function (event) {
    //* save Movies to your watch list by stringifying it to localStorage
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
    //* Checks localStorage for a key, if the key is already there then the function will alert the user and not add the the movie again.
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
    //* calls the function toggleMovieOverLay, put in place so only the image calls the function
    if (event.target.classList.contains("movieImg")) {
        const movieContainer = event.target.closest(".movieContainer");
        const movieId = movieContainer.dataset.movieId; //Identifies the movie based on new attribute
        let movie = spotlightArray.find((movie) => movie.id === Number(movieId)); 
        if (!movie) {
            movie = exploreArray.find((movie) => movie.id === Number(movieId));
        }
        toggleMovieOverlay(movieContainer, movie);
    }
});
 
function localStorageAddition(localMovie){
    const uniqueKey = `${localMovie.title}-${localMovie.release}`
   if (localStorage.getItem(uniqueKey)) {
    
    let fakeResponse = {"status": "wle"}
    snackError(fakeResponse)
    
} else {
    localStorage.setItem(uniqueKey, JSON.stringify(localMovie))
    console.log("Item succesfully put in localStorage")
    displayWatchlist()
    }
        
}

function localStorageSubtraction(localMovie, movieContainer) {
    //* It takes the keys (title and release) of localMovie. And removes the movie from local Storage, While also removing the movie article container 
    const uniqueKey = `${localMovie.title}-${localMovie.release}`
    localStorage.removeItem(uniqueKey)

    watchListContainer.removeChild(movieContainer)
    console.log("removed from watchlist")
}

function displayWatchlist(){
    console.log("Watchlist function called")
        watchListContainer.replaceChildren()

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const movie = JSON.parse(localStorage.getItem(key));
            console.log("WatchlistedMovie", movie)
            createWatchlistObject(movie)
        }
    }

//---------------------------


//* Misc functions-------------------

function snackError(response) {
    console.log("snackError function error message")
    let status = response['status']
    console.log(response)
    console.log(status)

    const snackbar = document.getElementById('snackbar');
    
    // Set the message

    switch (status) {
        case 401:
            snackbar.textContent = "Unauthorized! Check your API key.";
            break;
        case 404:
            snackbar.textContent = "Resource not found!";
            break;
        case 500:
            snackbar.textContent = "Server error. Try again later.";
            break;
        case "wle": /* Watch List item Exists */
            snackbar.classList.add('green')
            snackbar.textContent = "Already added to watch list.";
            break;
        default:
            snackbar.textContent = "Something went wrong.";
    }

    // Add the "show" class to make it visible
    snackbar.classList.add('show');
    
    // Remove the "show" class after 3 seconds
    setTimeout(() => {
        snackbar.classList.remove('show');
        snackbar.classList.remove('green');

      }, 3000);
}


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


console.log("JavaScript file loaded correctly")