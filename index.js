const app = require('express')()
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send({message: 'hello world'})
})

app.listen(PORT, () => console.log(`listening ${PORT}`))
