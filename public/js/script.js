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
                    that.boardImages = resp.data;
                    console.log(resp.data[0]);
                    console.log(resp);
                })
                .catch(function (err) {
                    console.log("err in GET /image-board: ", err);
                });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("imagetitle", this.imagetitle);
                formData.append("imagedescription", this.imagedescription);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from POST /upload: ", resp);
                    })
                    .catch(function (err) {
                        console.log("err from POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // console.log("handleChange is running!");
                // console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
