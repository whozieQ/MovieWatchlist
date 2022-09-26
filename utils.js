export function deleteArticles(){
    // clear any previous results
    const articles = Array.from(document.getElementsByTagName("article"))
    articles.forEach((article)=> {
        article.parentNode.removeChild(article)
    })
    const lines = Array.from(document.getElementsByTagName("hr"))
    lines.forEach((line)=> {
        line.parentNode.removeChild(line)
    })
}
