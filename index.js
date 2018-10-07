const app = require('express')()

app.get('/', (req, res) => {
  res.send({message: 'hello world'})
})

app.listen(3000, () => console.log('listening 3000'))
