const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')
const app = express();

const posts = {}

app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body
    handelEvent(type, data)
})


const handelEvent = (type, data) => {
    switch (type) {
        case 'PostCreated':{
            const {id, title} = data
            posts[id] = {id, title, comments:[]}
            break;
        }
        case 'CommentCreated':{
            const {id, comment, status, postId} = data
            posts[postId].comments.push({id, comment, status});
            break;
        }
        case 'CommentUpdated':{
            const {id, postId} = data
            posts[postId].comments = posts[postId].comments.map(commentData => {
                if(commentData.id === id){
                    return data
                }
                return commentData
            })

            console.log(data)
            console.log(posts[postId].comments)
            break;
        }
        default:
            break;

    }
}

app.listen(4002, async () => {
    console.log('listening on port 4002')
    const events = await axios.get('http://localhost:4005/events');
    
    events.data.map(({type, data}) => {
        console.log('Handeling event:', type)
        handelEvent(type, data)
    })
})
