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

module.exports.showImages = (id) => {
    return db.query(`SELECT * FROM images where id = $1`, [id]);
};
