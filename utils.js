export function addWatchlist(btnID,value){
    const movie =  movieResults.find(element => element.imdbID === btnID)
    movie.setWatchlist(value)
    let watchlist = localStorage.getItem("watchlist") ?? []
    watchlist = JSON.parse(watchlist)
    watchlist.push(movie)
    localStorage.setItem("watchlist",JSON.stringify(watchlist))
    console.log(`add-${movie.imdbID}`)
    if (value){
        document.getElementById(`add-${movie.imdbID}`).disabled = true
        document.getElementById(`add-${movie.imdbID}`).textContent = "On Watchlist"
    } else{
        //switch icon to add button
    }
}
