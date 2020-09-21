const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.addImage = (url, username, imagetitle, imagedescription) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)  RETURNING*`,
        [url, username, imagetitle, imagedescription]
    );
};

module.exports.addComment = (comment, username, image_id) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, image_id]
    );
};

module.exports.getBigImage = (id) => {
    return db.query(
        `SELECT * FROM images
        WHERE id = ($1)`,
        [id]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = ($1)
        ORDER by id DESC`,
        [id]
    );
};

// module.exports.getImages = (id) => {
//     return db.query(`SELECT * FROM images where id = $1`, [id]);
// };
