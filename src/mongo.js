const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const weatherSchema = new mongoose.Schema({
    city: String,
    highestTemp: Number,
    lowestTemp: Number,
})

const Weather = mongoose.model('Weather', weatherSchema)

const weather = new Weather({
    city: 'Lahti',
    highestTemp: 10,
    lowestTemp: -10,
})

weather.save().then(result => {
    console.log('highest temperature saved!')
    mongoose.connection.close()
})
