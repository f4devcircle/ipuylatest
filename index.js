const line = require('@line/bot-sdk')
const app = require('express')()
const PORT = process.env.PORT || 5000

require('dotenv').config()
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const client = new line.Client(config)

app.get('/', (req, res) => {
  res.send({message: 'hello world'})
})

app.post('/callback', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
         .then(result => {
           res.json(result)
         })
         .catch(err => {
           console.log(err)
           res.status(500).end()
         })
})

const handleEvent = (event) => {
  if(event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }
  const echo = {
    type: 'text',
    text: event.message.text
  }

  return client.replyMessage(event.replyToken, echo)
}

app.listen(PORT, () => console.log(`listening ${PORT}`))
