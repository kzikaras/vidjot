if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb+srv://kurtzikaras:Halothedog123@cluster0-p2n6y.mongodb.net/test?retryWrites=true&w=majority'}
}else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}