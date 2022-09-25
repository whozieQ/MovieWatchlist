import { addWatchlist } from "./utils.js"

export class Movie {
    constructor(data){
            this.Title = data.Title
            this.imdbID = data.imdbID
            this.Watchlist = false
    }

    getHTML(){
        const imgSrc = this.Poster.length > 5 ? this.Poster : "images/generic.jpg"
        const watchlistHTML = this.Watchlist ? 
        `<button id="add-${this.imdbID}" class="addToWatchlist" onClick="addWatchlist('${this.imdbID}',true)" disabled> On Watchlist</button>` :
        `<button id="add-${this.imdbID}" class="addToWatchlist" onClick="addWatchlist('${this.imdbID}',true)">
        <i class="material-icons">add_circle</i>Watchlist</button>`

        return `
        <img id="${this.imdbID}" src="${imgSrc}" onError="setGeneric('${this.imdbID}')">
        <div class="mContainer">
            <div class="mHeading">
                <h2 class="movieTitle">${this.Title}</h2>
                <p>&#11088;<span class="rating"> ${this.Rating}</span></p>
            </div>
            <div class="mData">
                <p class="runtime">${this.Runtime}</p>
                <p class="genre">${this.Genre}</p>
                ${watchlistHTML}
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
