//imports
import { Movie } from "./movie.js"
import { deleteArticles, listContext } from "./utils.js"

//DOM objects
const movieListSection = document.getElementById("movieList")
const noDataEl = Array.from(document.getElementsByClassName("no-data-state"))

//variables
export let watchlistMovies = []

getWatchlist()

//on load
document.addEventListener("DOMContentLoaded",()=>{
    const fileName = location.href.split("/").slice(-1)[0]; 
    if (fileName === "watchlist.html") {
        renderWatchlist()
        
    }
})

movieListSection.addEventListener("click", (e) => {
    if (e.target.classList.contains('removeFromWatchlist')) {
        //get movie imdbID - watchlist buttons have ID in the form of "btn-imdbID"
        const btnID = e.target.getAttribute("id")        
        const index = watchlistMovies.findIndex(element => element.imdbID === btnID.substring(4,btnID.length))
        //remove the item from the master list
        watchlistMovies.splice(index,1)
        updateStoredWatchlist()
        renderWatchlist()
    }
})
function getWatchlist(){
    //set global master list = stored watchlist
    const temp = JSON.parse(localStorage.getItem("watchlist")) ?? []
    //take the string format data and convert into
    //an array of Movie objects
    watchlistMovies = temp.map(item=>{
        const newMovie = new Movie(item)
        return newMovie
    })
}
export function updateStoredWatchlist(){
    //set stored watchlist = global master list
    localStorage.setItem("watchlist",JSON.stringify(watchlistMovies))
}
function renderWatchlist(){
    // clear any previous results
    deleteArticles()
    //display everything in the master list
    if (watchlistMovies.length > 0){
        movieListSection.classList.remove("no-data")
        noDataEl.forEach(element=>element.style.display = "none")
        //does NOT overwrite innerHTML to add movie entries
        //uses DOM to create article entry for each one leaving any other
        //HTML in place
        for (let i = 0; i < watchlistMovies.length; i++){
            // loop through each basic result
            //create the HTML section to hold this movie and add to DOM
            const article = document.createElement("article")
            article.innerHTML = watchlistMovies[i].getHTML(true)
            article.setAttribute("id",`movie-${watchlistMovies[i].imdbID}`)
            movieListSection.appendChild(article)
            watchlistMovies[i].setWatchlistButton(true,listContext.watchlist)
            //put a line between each movie entry
            const line = document.createElement("hr")
            line.style.width = "50%"
            line.style.marginTop = "1rem"
            line.style.marginBottom = "1rem"
            movieListSection.appendChild(line)
        }
    } else {
        //nothing in the watchlist
        setNoDataState()
    }
}

function setNoDataState(){
    noDataEl.forEach(element=>{
        element.style.display = "initial"
    })
    movieListSection.classList.add("no-data")
}