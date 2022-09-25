import { Movie } from "./movie.js"

let watchlist = []

const movieListSection = document.getElementById("movieList")

getWatchlist()
renderWatchlist()

function getWatchlist(){
    watchlist = JSON.parse(localStorage.getItem("watchlist")) ?? []
}

function renderWatchlist(){
    if (watchlist.length > 0){
        movieListSection.classList.remove("no-data")
        for (let i = 0; i < watchlist.length; i++){
            // loop through each basic result
                    let movie = watchlist[i]
                //create the HTML section to hold this movie and add to DOM
                    const article = document.createElement("article")
                    article.innerHTML = movie.getHTML()
                    article.setAttribute("id",`movie-${movie.imdbID}`)
                    movieListSection.appendChild(article)
                //put a line between each movie entry
                    const line = document.createElement("hr")
                    line.style.width = "50%"
                    line.style.marginTop = "1rem"
                    line.style.marginBottom = "1rem"
                    movieListSection.appendChild(line)
                }
            
    } else {
        setNoDataState()
    }
}

function setNoDataState(){
        movieListSection.innerHTML = `<p class="no-data-state">Your watchlist is looking a little empty...</p>`
        movieListSection.classList.add("no-data")
}