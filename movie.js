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
        const icon = document.createElement("i")
        icon.classList.add("material-icons")
        if (listType === "searchPage"){
            if (isOnWatchlist){
                //html with a disabled button and no icon
                button.classList.add("addToWatchlist") 
                button.textContent = "On Watchlist"
                button.disabled = true
            } else {
                //html with an add button because we must be on the search page
                button.classList.add("addToWatchlist") 
                button.textContent = "Watchlist"
                button.disabled = false
                icon.textContent = "add_circle"
                button.insertAdjacentElement("afterbegin", icon)
            }
        }
        if (listType === "watchlistPage"){ 
            //html with a Remove button
            button.classList.add("removeFromWatchlist") 
            button.textContent = "Remove"
            button.disabled = false
            icon.textContent = "cancel"
            button.insertAdjacentElement("afterbegin", icon)
        } 
    }

}
