const express = require('express');
const app = express();
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


// Send a control change message
function sendControlChange(controlNumber, controlValue) 
{
    output.send('cc', {controller: controlNumber, value: controlValue, channel: 0});
}

// Configure a callback
input.on('message', (msg) => {
    console.log(msg);
});


//express routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/test/vol', (req, res) => {
    let vol = req.body.vol;

    const controlNumber = 74; // control index
    const controlValue = vol; // control value

    // Send a control change message
    sendControlChange(controlNumber, controlValue);
    res.send('Volume set to ' + vol);
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});