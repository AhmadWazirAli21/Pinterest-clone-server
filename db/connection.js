const mongoose = require('mongoose');
const connectDB = (url) => {
    try {
        mongoose.connect(url).then(() => {
            console.log("database connected 👌");
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB