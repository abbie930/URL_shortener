// define function to randomly return a item in an array
function randomSelector(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

function shortenUrlGenerator() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetter = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'

  let collection = []
  collection = lowerCaseLetters + upperCaseLetter + numbers


  let shortenUrl = ''
  for(let i = 0; i < 5; i++) {
    shortenUrl += randomSelector(collection)
  }

  return shortenUrl
}

module.exports = shortenUrlGenerator

