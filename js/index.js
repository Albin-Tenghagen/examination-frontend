//* Global Variables down below
const apiUrl = "https://api.themoviedb.org/3?"
const exploringEndpoint = "discover/movie"
const apiKey = "3cb0d2bc09efade109b0b6a67290e815"

let spotlightArray = [];

let exploreArray = []; 
const genresArray = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];
const genreMapping = genresArray.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});
//*---------------


window.addEventListener("DOMContentLoaded", async function setup(event) {
    console.log("DOMContentLoaded called")
    //Changed to await checkUserPage async fetch functions to complete before the eventListeners are put in place, ensuring that the watchlist button finds the relevant moviecontainer and its attribute data-movie-id
    await checkUserPage()
    setupEventListener()
})

async function checkUserPage() {
    // declares current page being visited
    const currentPage = window.location.pathname;
    
    //* Calls all relevant functions based on where user is located
    if(currentPage.endsWith("index.html") ){
        
        console.log("user is visiting index.html")
        await spotlightApiFetch()

        console.log("spotlightApiFetch called from checkUserPage")
        
        
        
        console.log("displayWatchlist called from checkUserPage")

    } else if(currentPage.endsWith("explore.html")){
        console.log("user is visiting explore.html")
        
        await spotlightApiFetch() 
        await ExploreApiFetch("popularity.desc", "")
        formSubmission()
        console.log("ExploreApiFetch called from checkUserPage")
       
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
        displayMovies(spotlightArray, "spotlightContainer")
    
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
           
            fetchArray.push(fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=${sorting}&with_genres=${filter}&vote_count.gte=200`))    
            console.log(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=${sorting}&with_genres=${filter}&vote_count.gte=200`);    
            
        }
        
        const responses = await Promise.all(fetchArray)
        
        const rejectedPromise = responses.find((response) => !response.ok)

        if(rejectedPromise) {
            console.error(`Error when fetching pages: ${responses.indexOf(rejectedPromise) + 1} `)
            snackError(rejectedPromise)
            return
        }
        console.log("Explore fetches all succesful")
        const movieData = await Promise.all(responses.map((response) => response.json()))

        //combines the pages to a single array
        exploreArray = movieData.flatMap((data) => data.results);
        
        console.log("exploreArray", exploreArray)
        displayMovies(exploreArray, "exploreContainer")

        
    } catch (error) {
        console.error("Error fetching data:", error.message)
        snackError()
    }
                
   
}
//-------------------

//* DOM manipulation-------------------


function createMovieElement(movie, container) {
    
    const movieContainer = document.createElement("article")
    movieContainer.setAttribute("class", "movieContainer")
    movieContainer.setAttribute("data-movie-id", movie.id)
    //* title
    const movieTitle = document.createElement("h4")
    movieTitle.textContent = movie.title
    movieTitle.setAttribute("class", "movieTitle")
    movieContainer.appendChild(movieTitle)
    //* backdrop_path 
    const movieImg = document.createElement("img") 
       const backdropUrl = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
        : "https://placehold.co/500x281"
    movieImg.setAttribute("src", backdropUrl)
    movieImg.setAttribute("alt", `${movie.title} backdrop`)
    movieImg.setAttribute("class", "movieImg")
    movieContainer.appendChild(movieImg)
    //* release_date
    const movieRelease = document.createElement("p")
    movieRelease.textContent = `Release date :${movie.release_date}`;
    movieRelease.setAttribute("class", "movieRelease")
    movieContainer.appendChild(movieRelease)
   
   
    container.appendChild(movieContainer)
}
function displayMovies(movies, containerId){
    //Makes it possible to alter what container to populate
    const container = document.getElementById(containerId)

    if(!container){
        console.error("container to populate could not be found");
        return
    }

    container.replaceChildren()

    movies.forEach(movie => createMovieElement(movie, container))
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
            <p><strong>Genres:</strong> ${movie.genre_ids.map(id => genreMapping[id] || "Unknown Genre")}</p>
        `;
        overlayContent.innerHTML = detailedInfo;
        let body = document.body;

        // Add a close button to the overlay
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.setAttribute("class", "closeOverlay");
        closeButton.addEventListener("click", () => {
            body.classList.remove("dontScroll");

            overlay.remove(); // Remove overlay when close button is clicked
        });
        overlayContent.appendChild(closeButton);

        overlay.appendChild(overlayContent);
        body.classList.add("dontScroll");
        body.appendChild(overlay);
    } else {
        // If overlay already exists, remove it
        overlay.remove();
    }
}
//-------------------
//* Watch List ------------------------
// Centralised the eventlisteners so the movies on the explore page are also interactable. Put inside a function to wait for arrays to properly 
function setupEventListener() {

    document.addEventListener("click", function (event) {
       
        
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

}

//---------------------------

//* Misc functions-------------------
function snackError(response) {
    console.log("snackError function error message")
    let status = response.status
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
        
        default:
            snackbar.textContent = "Something went wrong. Try again later";
    }

    // Add the "show" class to make it visible
    snackbar.classList.add('show');
    
    // Remove the "show" class after 3 seconds
    setTimeout(() => {
        snackbar.classList.remove('show');
        
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