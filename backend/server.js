const express= require('express');
const connectToMongo= require('./db');
const { configDotenv } = require('dotenv');
var cors = require('cors');


const app = express();
configDotenv();

connectToMongo();
app.use(cors())
app.use(express.json());

//routes
app.use('/student',require('./routes/student'))
app.use('/courses',require('./routes/course'))
app.use('/admin',require('./routes/admin'))

const port= process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
