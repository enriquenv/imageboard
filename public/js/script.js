// Public javascript for frontend page
// Errors in browser console
(function () {
    new Vue({
        el: "main",
        data: {
            h1: "Image Board SPA",
            h2: "Latest images",
            imagetitle: "", //name corrected
            imagedescription: "", //name corrected
            username: "",
            file: null,
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
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                console.log("this! ", this);
            },
            handleChange: function (e) {
                // console.log("handleChange is running!");
                // console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
