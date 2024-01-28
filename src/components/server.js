const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); // Use cors middleware to allow cross-origin requests
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const Weather = require("./weather");

app.use(express.json()); // Add this line to parse JSON bodies

mongoose.connect("mongodb+srv://robin:phonglan4455@dtbase.bnswbxs.mongodb.net/weather_list?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add this endpoint to get record temperature by city
app.get("/api/temperature/:city", async (request, response) => {
    const city = request.params.city;
    const weather = await Weather.findOne({ city });
    //console.log(weather)
    if (weather) {
        response.json({ highestTemp: weather.highestTemp, lowestTemp: weather.lowestTemp});
    } else {
        //response.status(404).json({ error: 'City not found' });
        response.json(null)
    }
    
});

// Add this endpoint to save record temperature by city (if the city is not exist in the database, it will be added to the database)
app.post("/api/temperature/", async (request, response) => {
    const { city, highestTemp, lowestTemp } = request.body;

    // Check if the city is already exist in the database
    let weather = await Weather.findOne({ city })

    // Only happen if the city is not exist in the database
    if (!weather) {
        weather = new Weather({
            city: city,
            highestTemp: highestTemp,
            lowestTemp: lowestTemp,
        });

        await weather.save()
        response.status(201).json({ message: 'Data saved successfully' });
    } else {
        response.status(400).json({ error: 'City already exists' });
    }
})

app.put("/api/temperature/:city/", async (request, response) => {
    const city = request.params.city
    const highestTemp = request.body.highestTemp
    const lowestTemp = request.body.lowestTemp

    try {
        const weather = await Weather.findOne({ city });

        if (!weather) {
            return response.status(404).json({ error: 'City not found' });
        }

        if (highestTemp) {
            weather.highestTemp = highestTemp;
        }

        if (lowestTemp) {
            weather.lowestTemp = lowestTemp;
        }

        //weather.highestTemp = temp
        await weather.save();

        response.status(200).json(weather);
    } catch (error) {
        console.error('Error updating weather data:', error);
        response.status(500).json({ error: 'An error occurred while updating weather data' });
    }
});


app.listen(3002, () => console.log(`Server running on port ${3002}`));
