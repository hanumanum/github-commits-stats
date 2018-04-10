const express = require('express')
const app = express()
const commitsData = require('./repodata.json')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function(req, res) {  
    res.render('index', { commitsData: commitsData })
});

app.get('/user/:user', function(req, res) {  
    var commitsDataSelected = commitsData.filter(num => {
        return num.name == req.params.user;
    });
    res.render('user', { commitsData: commitsDataSelected })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))