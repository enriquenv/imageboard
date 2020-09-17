// Server code
const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

let images = {};

let boardImages = [
    "https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg",
    "https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg",
    "https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg",
];

app.get("/image-board", (req, res) => {
    res.json({
        boardImages,
    });
});

app.listen(8080, () => console.log("listening"));
