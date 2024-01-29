require('dotenv').config()

const REACT_APP_OPEN_API_KEY = process.env.REACT_APP_OPEN_API_KEY

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

PORT = process.env.PORT 

module.exports = {
    MONGODB_URI,
    PORT,
    REACT_APP_OPEN_API_KEY
}