const axios = require('axios')

module.exports = () => {
  return new Promise ((resolve, reject) => {
    axios.get('https://www.instagram.com/explore/tags/yupijkt48/?__a=1')
    .then(result => {
      resolve(result)
    })
    .catch(err => {
      reject(err)
    })
  })
}