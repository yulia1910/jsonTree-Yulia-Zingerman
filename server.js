var express = require("express");
var app = express();
app.use(express.static('./dist/jsontree'));
app.get('/*', function(req, res){
    res.sendFile('index.html', {root: 'dist/jsontree/'});
});
app.listen(process.env.PORT || 4800);