// 

const movieListSection = document.getElementById("movieList")
const searchButton = document.getElementById("searchBtn")
const searchInputEl = document.getElementById("searchInput")
let movieResults = []

searchButton.addEventListener("click",showResults)
searchInputEl.addEventListener("keypress",event=>{
    if (event.key === "Enter"){
        event.preventDefault()
        searchButton.click()
    }
})

async function showResults(){
    movieListSection.innerHTML = `<p id="no-data-state" style="display: none">Unable to find what you're looking for. Please try another search.</p>`
    movieResults = []
    const searchFor = encodeURIComponent(searchInputEl.value)
    const url = `http://www.omdbapi.com/?&apikey=8f10a4d2&s=${searchFor}&type=movie`
    // const url = "http://www.omdbapi.com/?&apikey=8f10a4d2&s=Susan+Says+So"
    const response = await fetch(url)
    const result = await response.json()
    console.log(result.Response)
    if (result.Response == false || result.Response === 'False') { 
        setNoDataState()
        return 0 
    }
    movieListSection.classList.remove("initial-state")
    for (let i = 0; i < result.Search.length; i++){
        // console.log("1 in for loop")
        let movie = new Movie(result.Search[i])
        await movie.getDetails()
        movieResults.push(movie)
        // console.log(movie.Poster)
        const article = document.createElement("article")
        article.innerHTML = movie.getHTML()
        movieListSection.appendChild(article)
        const line = document.createElement("hr")
        line.style.width = "50%"
        line.style.marginTop = "1rem"
        line.style.marginBottom = "1rem"
        movieListSection.appendChild(line)
    }
}

function setNoDataState(){
    console.log("setting no data state")
    document.getElementById("no-data-state").style.display = "block"
    movieListSection.classList.remove("initial-state")
}

async function getMovieDetail(movie){
    const response = await fetch(`http://www.omdbapi.com/?&apikey=8f10a4d2&i=${movie.imdbID}`) 
    const result = await response.json()
    // need to handle error
    // console.log("2 in getMovieDetail")
    // console.log(result)
    movie.Genre = result.Genre
    movie.Plot = result.Plot
    movie.Poster = result.Poster
    movie.Runtime = result.Runtime
    movie.Rating = result.imdbRating
    return movie
}
class Movie {
    constructor(data){
            this.Title = data.Title
            this.imdbID = data.imdbID
            this.Watchlist = false
    }

    getHTML(){
        return `
        <img id="${this.imdbID}" src="${this.Poster}" onError="setGeneric('${this.imdbID}')">
        <div class="mContainer">
            <div class="mHeading">
                <h2 class="movieTitle">${this.Title}</h2>
                <p>&#11088;<span class="rating"> ${this.Rating}</span></p>
            </div>
            <div class="mData">
                <p class="runtime">${this.Runtime}</p>
                <p class="genre">${this.Genre}</p>
                <button id="add-${this.imdbID}" class="addToWatchlist" onClick="addWatchlist('${this.imdbID}',true)"><i class="material-icons">add_circle</i>Watchlist</button>
            </div>
            <p class="mPlot">${this.Plot}</p>
        </div>`
    }
    async getDetails(){
        const response = await fetch(`http://www.omdbapi.com/?&apikey=8f10a4d2&i=${this.imdbID}`) 
        const result = await response.json()
        this.Genre = result.Genre
        this.Plot = result.Plot
        this.Poster = result.Poster
        this.Poster = result.Poster
        this.Runtime = result.Runtime
        this.Rating = result.imdbRating
    }
    setWatchlist(value){
        value ? this.Watchlist = true : this.Watchlist = false
    }
}

function setGeneric(imgID){
    document.getElementById(imgID).src = "images/generic.jpg"
}

function addWatchlist(btnID,value){
    console.log("watchlist click" + btnID)
    const movie =  movieResults.find(element => element.imdbID === btnID)
    movie.setWatchlist(value)
    if (value){
        // disable button
        // Change button to On Watchlist
        // remove the + icon?
    } else{
        //switch icon to add button
    }
}