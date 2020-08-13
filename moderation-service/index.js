const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    switch (type) {
        case 'CommentCreated':{
            const {id, comment,  postId} = data
            const status = comment.includes('orange') ? 'rejected':'approved'
            const event = {
                type: 'CommentModerated',
                data: {
                    id, comment, status, postId
                }
            }
            await axios.post('http://localhost:4005/events', event)
            break;
        }
        default:
            break;

    }
    res.send({})
})

app.listen(4003, () => {
    console.log('listening on port 4003')
})

