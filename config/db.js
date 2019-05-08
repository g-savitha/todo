if(process.env.NODE_ENV==='production'){
    module.exports = {
        mongoURI: 'mongodb+srv://savitha:savitha@todoauth-8orh1.mongodb.net/test?retryWrites=true'
    }
}
else{
    module.exports = {
        mongoURI: 'mongodb://localhost/todo'
    }
}
