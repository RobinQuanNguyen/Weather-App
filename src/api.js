import axios from "axios";

const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY || "";

const openaiApiUrl = "https://api.openai.com/v1/chat/completions";
const openaiApiKey = process.env.REACT_APP_OPEN_API_KEY || "";

const getWeather = async (city, country_code = "") => {
  try {
    const q = country_code ? `${city},${country_code}` : city; // if country_code is not provided, use city as the only parameter
    const response = await axios.get(weatherApiUrl, {
      params: {
        q,
        appid: weatherApiKey,
      },
    });

    if (response.status === 200) {
      const weatherData = response.data;
      const name = weatherData.name;
      const weatherCondition = weatherData.weather[0].description;
      const temperature = (weatherData.main.temp - 273.15).toFixed(2);
      const humidity = weatherData.main.humidity;
      const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

      return { weatherCondition, temperature, humidity, icon, name };
    } else {
      console.error(`Error: ${response.status}, ${response.data.message}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const generateDynamicResponse = async (
  city,
  weatherCondition,
  temperature,
  humidity
) => {
  const prompt = `What are some outdoor activities suitable in ${city} when the weather is ${weatherCondition}, with a temperature of ${temperature} degrees Celsius and a humidity of ${humidity}%?`;

  try {
    const response = await axios.post(
      openaiApiUrl,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a travel assistant, skilled in recommending activities based on weather conditions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    if (response.status === 200) {
      return response?.data?.choices[0].message.content;
    } else {
      console.error(
        `Error: ${response.status}, ${response.data.error.message}`
      );
      return null;
    }
  } catch (error) {
    console.error("Error generating dynamic response:", error);
    return null;
  }
};

const getRecordTemp = async (city, currentTemp) => {
  try {
    // Get the temperature from the database
    let response = await axios.get(
      `http://localhost:3002/api/temperature/${city}`
    );

    if (response.data === null) {
      // If the city is not exist in the database, it will return 400
      await axios.post(`http://localhost:3002/api/temperature/`, {
        city: city,
        highestTemp: 0,
        lowestTemp: 0,
        // set both tempereature to 0, because we only want to save the city name if it is not exist in the database
      });

      // Get the temperature from the database again (after adding)
      response = await axios.get(
        `http://localhost:3002/api/temperature/${city}`
      );
    }

    // Compare the temperature from the database with the current temperature
    if (response.data.highestTemp < currentTemp) {
      // Update the highest temp
      await axios.put(`http://localhost:3002/api/temperature/${city}`, {
        highestTemp: currentTemp,
      });
    }

    if (response.data.lowestTemp >= currentTemp) {
      // Update the lowest temp
      await axios.put(`http://localhost:3002/api/temperature/${city}`, {
        lowestTemp: currentTemp,
      });
    }
    // Get the temp from the database again (after updating)
    response = await axios.get(`http://localhost:3002/api/temperature/${city}`);

    const highestTemp = response.data.highestTemp;
    const lowestTemp = response.data.lowestTemp;

    return { highestTemp, lowestTemp };
  } catch (error) {
    console.error("Error fetching highest temperature:", error);
    return null;
  }
};

export { getWeather, generateDynamicResponse, getRecordTemp };