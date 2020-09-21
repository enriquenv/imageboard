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

app.get("/images/:id", (req, res) => {
    console.log("req.params in /images/:id", req.params);
    db.getBigImage(req.params.id)
        .then((result) => {
            //console.log("getBigImage result", result);
            let image = result.rows[0];
            db.getComments(result.rows[0].id)
                .then((list) => {
                    let comments = list.rows;
                    console.log("comments", comments);
                    res.json({
                        image,
                        comments,
                    });
                })
                .catch((err) => {
                    console.log("Error in getComments: ", err);
                });
        })
        .catch((err) => {
            console.log("Error in getBigImage: ", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("req.body in /comment", req.body);
    db.addComment(req.body.comment, req.body.name, req.body.image_id)
        .then(({ rows }) => {
            console.log("addComment rows: ", rows);
            res.json({
                comment: rows[0],
            });
        })
        .catch((err) => {
            console.log("error in addComment", err);
        });
});

app.listen(8080, () => console.log("listening"));
