const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload());

//Endpoint to send a request to from react and send file across
app.post("/upload", function(req, res)
{
    //"req.files" contains the uploaded file

    if(req.files === null) return res.status(400).json({ msg: "No file uploaded" });

    const file = req.files.file;

    //Defining where to put file using "mv" function from "express-fileupload" middleware
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, function(err){ 
        if(err)
        {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
})

app.listen(5000, function(){ console.log("Server started..."); });