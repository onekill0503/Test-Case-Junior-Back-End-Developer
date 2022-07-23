const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer')
const path = require('path')

// Cors
app.use(cors())

// parse request data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer({
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) => {
            console.log(file)
            cb(null,`${path.parse(file.originalname).name}_${Date.now()}${path.extname(file.originalname)}`);
        }
    }),
}).array('images'))

// Routes
const IndexRoutes = require("./routes/index")

app.use("/" , IndexRoutes)

app.listen(3333 , () => console.log("Running at 3333"))