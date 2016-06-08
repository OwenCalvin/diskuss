var version = 'v0.1-alpha';
var port = 8081;

var app = require('express')();
var http = require('http').Server(app);
var User = require('./app/models/User').User;

var users = [];
var channels = [];

// API

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/api.html');
});

// Info

app.get('/info', function(req, res) {
    res.send({ 'version':version });
});

// List users

app.get('/users/', function(req, res) {
    var displayedUsers = [];
    for (var i in users) {
        var user = User.create(users[i]);
        user.id = undefined;
        displayedUsers.push(user);
    }
    res.send(displayedUsers);
});

// Register

app.post('/users/register/:nick', function(req, res) {
    var availableNick = req.params.nick;
    var nick = null;
    var index = 0;
    do {
        var available = true;
        for (var i in users) {
            var user = users[i];
            if (index == 0 && user.nick == availableNick){
                available = false;
                break;
            }
            if (user.nick == availableNick + '_' + index) {
                available = false;
                break;
            }
        }
        if (available) {
            nick = availableNick;
            if (index > 0) {
                nick += '_' + index;
            }
        }
        else {
            index++;
        }
    } while (nick == null);
    
    user = new User(nick);
    users.push(user);
    res.send(user);
});

// Whois

app.get('/users/whois/:nick', function(req, res) {
    var user = null;
    for (var i in users) {
        var oneUser = users[i];
        if (oneUser.nick == req.params.nick) {
            user = User.create(oneUser);
            break;
        }
    }
    if (user == null) {
        res.send({ 'error': 'Unknown nick.' });
    }
    else {
        user.id = undefined;
        res.send(user);
    }
});

// List channels

app.get('/channels/', function(req, res){
    res.send(channels);
});

// Error handling

app.get('*', function(req, res) {
    res.send({ 'error': 'Unknown route.' });
});

app.post('*', function(req, res) {
    res.send({ 'error': 'Unknown route.' }); 
});

// Server listening

http.listen(port, function() {
    console.log('Server started on port ' + port); 
});
