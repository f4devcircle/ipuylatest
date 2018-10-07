const line = require('@line/bot-sdk')
const app = require('express')()
const PORT = process.env.PORT || 5000
const getLatestIpuy = require('./helpers/getLatestIpuy')

require('dotenv').config()
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const client = new line.Client(config)

app.get('/', (req, res) => {
  getLatestIpuy()
  .then(({data}) => {
    const shortcode = data.graphql.hashtag.edge_hashtag_to_top_posts.edges[0].node.shortcode
    const thumb = data.graphql.hashtag.edge_hashtag_to_top_posts.edges[0].node.thumbnail_src
    // console.log('---this is data', data)
    // console.log('---data', data.graphql.hashtag.edge_hashtag_to_media.edges[0])
    // console.log(shortcode, thumb)
    res.send({ shortcode, thumb })
  })
})

app.post('/callback', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => {
      console.log('error:', err)
      res.status(500).end()
    })
})

const handleEvent = (event) => {
  console.log('--event:', event)
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }
  let echo = {
    type: 'text',
    text: event.message.text
  }

  if(event.message.text == '/yupi') {
    getLatestIpuy()
      .then(({ data }) => {
        const shortcode = data.graphql.hashtag.edge_hashtag_to_top_posts.edges[0].node.shortcode
        const thumb = data.graphql.hashtag.edge_hashtag_to_top_posts.edges[0].node.thumbnail_src
        echo.text = 'ipuy latest!!'
        echo.type = 'image'
        echo.originalContentUrl = shortcode
        echo.previewImageUrl = shortcode
        echo.animated = false
        return client.replyMessage(event.replyToken, echo)
      })
      .catch(err => {
        echo.text = 'sorry cant handle this :('
        return client.replyMessage(event.replyToken, echo)
      })
  } else {
    return client.replyMessage(event.replyToken, echo)
  }
}

app.listen(PORT, () => console.log(`listening ${PORT}`))
