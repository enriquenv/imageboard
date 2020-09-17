// Public javascript for frontend page
(function () {
    new Vue({
        el: "main",
        data: {
            h1: "Image Board SPA",
            h2: "Latest images",
            boardImages: [],
        },
        mounted: function () {
            var that = this;
            axios
                .get("/image-board")
                .then(function (resp) {
                    that.boardImages = resp.data.boardImages;
                })
                .catch(function (err) {
                    console.log("err in GET /image-board: ", err);
                });
        },
    });
})();
