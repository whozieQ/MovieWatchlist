import { listContext } from "./utils.js"

export class Movie {
    constructor(data){
            this.Title = data.Title
            this.imdbID = data.imdbID
            this.Genre = data.Genre ?? ""
            this.Plot = data.Plot ?? ""
            this.Poster = data.Poster ?? "images/generic.jpg"
            this.Runtime = data.Runtime ?? ""
            this.Rating = data.imdbRating ?? ""
        }

    getHTML(){
        //catch invalid, N/A, missing poster source
        // const imgSrc = this.Poster.length > 5 ? this.Poster : "images/generic.jpg"
        //a separate call to setWatchlistButton is necessary to finish populating 
        //that part of the article
        return `
        <img id="${this.imdbID}" src="${this.Poster}" onError="setGeneric('${this.imdbID}')">
        <div class="mContainer">
            <div class="mHeading">
                <h2 class="movieTitle large">${this.Title}</h2>
                <p>&#11088;<span class="rating smallLight"> ${this.Rating}</span></p>
            </div>
            <div class="mData smallLight">
                <p class="runtime">${this.Runtime}</p>
                <p class="genre">${this.Genre}</p>
                <button id="btn-${this.imdbID}" class="watchlistBtn smallLight">Watchlist</button>
            </div>
            <p class="mPlot">${this.Plot}</p>
        </div>`
    }
    async setDetails(){
        const response = await fetch(`https://www.omdbapi.com/?&apikey=8f10a4d2&i=${this.imdbID}`) 
        const result = await response.json()
        this.Genre = result.Genre
        this.Plot = result.Plot
        this.Poster = result.Poster.length > 5 ? result.Poster : "images/generic.jpg"
        this.Runtime = result.Runtime
        this.Rating = result.imdbRating
    }
    setWatchlistButton(isOnWatchlist,listType){
        //create proper HTML for the watchlist button based on which page this is
        //and based on whether it is on the watchlist already or not
        const button = document.getElementById(`btn-${this.imdbID}`)
        //clear any existing button content
        button.innerHTML = ""
        const icon = document.createElement("i")
        icon.id = `ico-${this.imdbID}`
        if (listType === listContext.search){
            if (isOnWatchlist){
                //html with a disabled button and no icon
                button.classList.add("addToWatchlist") 
                button.textContent = "On Watchlist"
                button.disabled = true
            } else {
                //html with an add button because we must be on the search page
                button.classList.add("addToWatchlist") 
                button.disabled = false
                if (screen.width < 500){
                    button.textContent = ""
                    icon.classList.add("material-symbols-outlined")
                    icon.classList.add("addToWatchlist")
                    icon.textContent = "heart_plus"
                } else {
                    button.textContent = "Watchlist"
                    icon.classList.add("material-icons")
                    icon.classList.add("addToWatchlist")
                    icon.textContent = "add_circle"
                }
                button.insertAdjacentElement("afterbegin", icon)
            }
        }
        if (listType === listContext.watchlist){ 
            //html with a Remove button
            button.classList.add("removeFromWatchlist") 
            button.disabled = false
            button.textContent = ''
            if (screen.width < 500){
                icon.classList.add("material-symbols-outlined")
                icon.classList.add("removeFromWatchlist")
                icon.textContent = "heart_minus"
        } else {
                icon.classList.add("material-icons")
                icon.classList.add("removeFromWatchlist")
                button.textContent = "Remove"
                icon.textContent = "cancel"
            }
        button.insertAdjacentElement("afterbegin", icon)
        } 
        if (screen.width < 500){
        }
    }

}
