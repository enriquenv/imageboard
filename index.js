// Server code
// Errors in terminal
const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Url } = require("./config");

app.use(express.static("public"));
app.use(express.json());

// copied from notes =>
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
// <= copied from notes

// let images = {};

// let boardImages = [
//     "https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg",
//     "https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg",
//     "https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg",
// ];

app.get("/image-board", (req, res) => {
    db.getImages().then(({ rows }) => {
        // console.log(rows);
        // console.log(rows.rows[0].id);
        // console.log(rows[2]id);
        // console.log(rows.rows[0].title);
        res.json(rows);
    });

    /*     db.getImages().then(({ rows }) => {
        res.json({ rows });
    }); */
    /*     res.json({
        boardImages,
    }); */
});
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file: ", req.file);
    console.log("input: ", req.body);

    // change to db insert with information
    if (req.file) {
        const filename = req.file.filename;
        const url = `${s3Url}${filename}`;
        // console.log("This is req.body inside app.post /upload", req.body);
        db.addImage(
            url,
            req.body.username,
            req.body.imagetitle,
            req.body.imagedescription
        ).then(({ rows }) => {
            console.log("rows0 in uploaded image", rows[0]);
            res.json({
                image: rows[0],
                success: true,
            });
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("listening"));
