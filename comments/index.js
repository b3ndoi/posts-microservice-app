const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto')
const app = express();
const cors = require('cors')
const axios = require('axios');

const commentsByPostId = {}

app.use(bodyParser.json())
app.use(cors())


app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
})
app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const {comment} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({
        id, comment
    });
    commentsByPostId[req.params.id] = comments;
    const event = {
        type: 'CommentCreated',
        data: {
            id, comment, postId: req.params.id, status: 'pending'
        }
    }
    await axios.post('http://localhost:4005/events', event)
    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    if(req.body.type === 'CommentModerated'){
        const {id, comment, status, postId} = req.body.data
        const commentsFound = commentsByPostId[postId];
        commentsFound.map(commentData => {
            if(commentData.id === id){
                return req.body.data
            }
            return commentData
        })
        const event = {
            type: 'CommentUpdated',
            data: {
                id, comment, status, postId
            }
        }
        await axios.post('http://localhost:4005/events', event)
    }
    res.send({})
})

app.listen(4001, () => {
    console.log('listening on port 4001');
})