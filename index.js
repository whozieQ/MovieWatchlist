// 
import { Movie } from "./movie.js"
import { addWatchlist } from "./utils.js"

const movieListSection = document.getElementById("movieList")
const searchButton = document.getElementById("searchBtn")
const searchInputEl = document.getElementById("searchInput")
const resultInfoEl = document.getElementById("resultInfo")
let movieResults = []
let currentResultsPage = 0
let currentSearch

searchButton.addEventListener("click",()=>{showResults(1)})
searchInputEl.addEventListener("keypress",event=>{
    if (event.key === "Enter"){
        event.preventDefault()
        searchButton.click()
    }
})
document.getElementById("nextPage").addEventListener("click",()=>{showResults(currentResultsPage+1)})
document.getElementById("previousPage").addEventListener("click",()=>{showResults(currentResultsPage-1)})

async function showResults(page){
    if (searchInputEl.value.length < searchInputEl.getAttribute("minlength")) {
        alert("Please enter a search string of 4 letters or more")
        return
    }
    const searchFor = encodeURIComponent(searchInputEl.value)
// don't search again if the search input hasn't changed
    if (searchFor === currentSearch && page === currentResultsPage){
//same page, same search
        return 
    } else if (searchFor != currentSearch){
//new search
        currentResultsPage = page
        currentSearch = searchFor
    } else {
//same search, new page       
        currentResultsPage = page
    }

    // clear any previous results
    movieListSection.innerHTML = ""
    movieResults = []
    resultInfoEl.textContent = "Searching..."
//call the API

    const result = await getSearchResults()

    //when the API returns top level results
//detect a No Results result and handle it
    if (result.Response == false || result.Response === 'False') { 
        setNoDataState()
        return 0 
    }
//handle pagination support
    resultInfoEl.textContent = `${result.totalResults} Results (showing ${currentResultsPage*10-10}-${currentResultsPage*10})`
    const maxPage = Math.ceil(result.totalResults/10)
    document.getElementById("nextPage").disabled = maxPage > currentResultsPage ? false : true
    document.getElementById("previousPage").disabled = currentResultsPage > 1 ? false : true

    //if we get here... we know we have results
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) ?? []
    movieListSection.classList.remove("initial-state")
    movieListSection.classList.remove("no-data")

    for (let i = 0; i < result.Search.length; i++){
// loop through each basic result
    // create a Movie object
        let movie = new Movie(result.Search[i])
    //use the API again to get deep details about each movie
    //and update the Movie object with those details
        await movie.getDetails()
        movie.Watchlist = watchlist.find(element => movie.imdbID === element.imdbID) ? true : false
    //add this Movie object to an array
        movieResults.push(movie)
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
}

async function getSearchResults(){
    //get one page of search results
    const url = `http://www.omdbapi.com/?&apikey=8f10a4d2&s=${currentSearch}&type=movie&page=${currentResultsPage}`
    const response = await fetch(url)
    const result = await response.json()
    // console.log(result)
    return result
}

function setNoDataState(){
// display the message in place of any search results
    movieListSection.innerHTML = `<p class="no-data-state">Unable to find what you're looking for. Please try another search.</p>`
// hide the default background image
    movieListSection.classList.remove("initial-state")
    movieListSection.classList.add("no-data")
    resultInfoEl.textContent = "0 Results"
}


function setGeneric(imgID){
    document.getElementById(imgID).src = "images/generic.jpg"
}

