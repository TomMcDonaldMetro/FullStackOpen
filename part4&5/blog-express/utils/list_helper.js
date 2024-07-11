const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if(blogs.length === 0){
        return 0
    }
    else if(blogs.length === 1){
        return blogs[0].likes
    }else{
        let total = 0
        blogs.forEach(blog => total += blog.likes)
        return total
    }
    
}

const favoriteBlog = (blogs) => {

    let blog = blogs[0]
    let max = blogs[0].likes

    blogs.forEach(currBlog => {
        if(currBlog.likes > max){
            blog = currBlog
            max = currBlog.likes
        }
    })

    return blog
    // if we just wanted the value
    //return Math.max(...blogs.map(blog => blog.likes))

}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}