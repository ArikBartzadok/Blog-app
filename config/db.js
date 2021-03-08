if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://Arik:123000@clusterblogapp.jqmxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}