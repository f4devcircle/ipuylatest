const app = require('express')()

app.get('/', (req, res) => {
  res.send({message: 'hello world'})
})

app.listen(80, () => console.log('listening 80'))
