const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const midi = require('easymidi');

const port = 8080;

const inputs = midi.getInputs();
const input = new midi.Input(inputs[0]);
const output = new midi.Output(inputs[0]);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// Send a control change message
function sendControlChange(controlNumber, controlValue, type = 'cc') 
{
    if(type == 'cc')
    {
        output.send(type, {controller: controlNumber, value: controlValue, channel: 0});
    }
    else if(type == 'program')
    {
        output.send(type, {number: controlValue, channel: 0});
    }
    
}

// Configure a callback
input.on('message', (msg) => {
    console.log(msg);
    io.emit('traffic', msg);
});

//express routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/traffic', (req, res) => {
    res.render('traffic');
});

//client socket is senting 'vol' to server
io.on('connection', (socket) => {
    socket.on('gain', (msg) => {
        console.log("gain set from slider: " + msg);
        sendControlChange(70, msg);
    });
    socket.on('bass', (msg) => {
        console.log("bass set from slider: " + msg);
        sendControlChange(71, msg);
    });
    socket.on('mid', (msg) => {
        console.log("mid set from slider: " + msg);
        sendControlChange(72, msg);
    });
    socket.on('treb', (msg) => {
        console.log("treb set from slider: " + msg);
        sendControlChange(73, msg);
    });
    socket.on('vol', (msg) => {
        console.log("vol set from slider: " + msg);
        sendControlChange(74, msg);
    });
    socket.on('preset', (msg) => {
        console.log("preset set from socket: " + msg);
        sendControlChange(0,msg,'program');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
