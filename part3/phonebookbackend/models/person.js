const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URL

console.log(`connecting to`, url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
    type: String,
    minLength: 3,
    required: true
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          console.log("V" , v)
          const parts = v.split("-")
          // if it has more than one dash
          if(parts.length > 2 || parts.length < 2){
            return false
          }
          // if it has less than 8 numbers
          if(!(parts[0].length + parts[1].length >= 8)){
            return false
          }
          // if first part isn't 2 or 3 numbers
          if(!(parts[0].length >= 2 && parts[0].length <= 3)) {
            return false
          }
          // if the parts are not numbers only (could regex)
          if(Number(parts[0]) == NaN || Number(parts[1]) == NaN){
            return false
          }
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)
