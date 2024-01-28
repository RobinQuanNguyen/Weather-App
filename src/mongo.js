const mongoose = require('mongoose')
//import mongoose from 'mongoose';

const url = "mongodb+srv://robin:phonglan4455@dtbase.bnswbxs.mongodb.net/weather_list?retryWrites=true&w=majority"

mongoose.set('strictQuery',false)
mongoose.connect(url)
// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

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

// Weather.find({}).then(result => { // find all
//     result.forEach(note => {
//       console.log(note.city)
//     })
//     mongoose.connection.close()
//   })

// Weather.findOne({ city: 'London' }).then(result => {
//     if (result) {
//       console.log("We found: " + result.city)
//     } else {
//       console.log('City not found')
//     }
//     mongoose.connection.close()
//   })

// const changeTemperature = async (city, newTemp) => {
//   const weather = await Weather.findOne({ city: city });

//   if (!weather) {
//       console.log('City not found');
//       return;
//   }

//   weather.highestTemp = newTemp;
//   await weather.save();

//   console.log('Temperature updated successfully');
// }

// Usage
// changeTemperature('Lahti', 15);

