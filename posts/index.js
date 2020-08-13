const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto')
const cors = require('cors')
const app = express();
const axios = require('axios');

const posts = {}

app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
    res.send(posts);
})
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[id] = {
        id, title
    };
    const event = {
        type: 'PostCreated',
        data: posts[id]
    }
    await axios.post('http://localhost:4005/events', event)
    res.status(201).send(posts[id]);
})
app.post('/events', (req, res) => {
    console.log('recived event', req.body.type);
    console.log('event payload', req.body.data);
    res.send({})
})

app.listen(4000, () => {
    console.log('listening on port 4000');
})