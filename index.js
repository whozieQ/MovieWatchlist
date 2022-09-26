// imports
import { Movie } from "./movie.js"
import { deleteArticles } from "./utils.js"
import { updateStoredWatchlist, watchlistMovies } from "./watchlist.js"


//DOM objects
const movieListSection = document.getElementById("movieList")
const searchButton = document.getElementById("searchBtn")
const searchInputEl = document.getElementById("searchInput")
const resultInfoEl = document.getElementById("resultInfo")
const noDataMsgEl = document.querySelector(".no-data-state")

//variables
export let searchedMovies = []
let currentResultsPage = 0
let currentSearch
const listContext = Object.freeze({
    search: 0,
    watchlist: 1
})
const btnContext = Object.freeze({
    new: 0,
    next: 1,
    previous: 2
})

//------------event listeners---------------
//click on add to watchlist button
movieListSection.addEventListener("click", (e) => {
    if (e.target.classList.contains('addToWatchlist')) {
        //get movie imdbID - watchlist buttons have ID in the form of "btn-imdbID"
        const btnID = e.target.getAttribute("id")       
        const index =  searchedMovies.findIndex(element => element.imdbID === btnID.substring(4,btnID.length))
        watchlistMovies.push(searchedMovies[index])
        updateStoredWatchlist()
        document.getElementById(btnID).disabled = true
        document.getElementById(btnID).textContent = "On Watchlist"
    }
})

//click on Search button or hitting Enter in the search field
searchButton.addEventListener("click",()=>{
    if (validateSearch()) { 
        showResults(btnContext.new) 
    }
})
searchInputEl.addEventListener("keypress",event=>{
    if (event.key === "Enter"){
        event.preventDefault()
        searchButton.click()
    }
})

//pagination buttons
document.getElementById("nextPage").addEventListener("click",()=>{
    showResults(btnContext.next)
})
document.getElementById("previousPage").addEventListener("click",()=>{
    showResults(btnContext.previous)
})

//--------------key functions---------------
//check user's Search string and set variables accordingly
function validateSearch(){
    if (searchInputEl.value.length < searchInputEl.getAttribute("minlength")) {
        alert("Please enter a search string of 4 letters or more")
        return false
    }
    const searchFor = encodeURIComponent(searchInputEl.value)
    // don't search again if the search input hasn't changed
    if (searchFor === currentSearch){
        return false
    } else {
        //new search
        currentSearch = searchFor
    }
    return true        
}

//execute search and process returned results
async function showResults(context){
//adjust currentResultsPage as needed for the context of this instance
    switch (context){
        case btnContext.next:
            currentResultsPage++
            break;
        case btnContext.previous:
            currentResultsPage--
            break
        case btnContext.new:
            currentResultsPage = 1
            break
    }
    deleteArticles()
    searchedMovies.length = 0
    resultInfoEl.textContent = "Searching..."
//call the API
    const result = await getSearchResults()

//when the API returns top level results
//detect a No Results result and handle it
    if (result.Response == false || result.Response === 'False') { 
        setNoDataState()
        return 0 
    }

    //if we get here... we know we have results
    noDataMsgEl.style.display = "none"
    movieListSection.classList.remove("initial-state")
    movieListSection.classList.remove("no-data")

    //handle pagination support
    resultInfoEl.textContent = `${result.totalResults} Results (showing ${currentResultsPage*10-10}-${currentResultsPage*10})`
    const maxPage = Math.ceil(result.totalResults/10)
    document.getElementById("nextPage").disabled = maxPage > currentResultsPage ? false : true
    document.getElementById("previousPage").disabled = currentResultsPage > 1 ? false : true

    for (let i = 0; i < result.Search.length; i++){
// loop through each basic result
    // create a Movie object
        let movie = new Movie(result.Search[i])
    //use the API again to get deep details about each movie
    //and update the Movie object with those details
        await movie.setDetails()
    //add this Movie object to the master array of found movies
        searchedMovies.push(movie)
        const onWatchlist = watchlistMovies.findIndex(element => element.imdbID === movie.imdbID) === -1 ? false : true
    //create the HTML section to hold this movie and add to DOM
        const article = document.createElement("article")
        article.innerHTML = movie.getHTML()
        article.setAttribute("id",`movie-${movie.imdbID}`)
        article.classList.add(`${movie.imdbID}`)
        movieListSection.appendChild(article)
        movie.setWatchlistButton(onWatchlist,"searchPage")
    //put a line between each movie entry
        const line = document.createElement("hr")
        line.style.width = "50%"
        line.style.marginTop = "1rem"
        line.style.marginBottom = "1rem"
        line.classList.add(`${movie.imdbID}`)
        movieListSection.appendChild(line)
    }
}

async function getSearchResults(){
    //get one page of search results
    //use currentResultsPage to determine which page of results to show
    const url = `http://www.omdbapi.com/?&apikey=8f10a4d2&s=${currentSearch}&type=movie&page=${currentResultsPage}`
    const response = await fetch(url)
    const result = await response.json()
    return result
}

function setNoDataState(){
// display the message in place of any search results
    noDataMsgEl.style.display = "block"
// hide the default background image
    movieListSection.classList.remove("initial-state")
    movieListSection.classList.add("no-data")
    resultInfoEl.textContent = "0 Results"
}
