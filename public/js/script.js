// Public javascript for frontend page
// Errors in browser console
(function () {
    Vue.component("popmodal", {
        template: "#popmodal",
        props: ["id"],
        data: function () {
            return {
                heading: "Some component",
                comments: [],
                title: "",
                description: "",
                username: "",
                file: null,
                id: null,
                comment: "",
                name: "",
            };
        },
        mounted: function () {
            //console.log("Component mounted");
            var that = this;
            axios
                .get("/images/" + this.id)
                .then(function (resp) {
                    // console.log("get /images/this.id response: ", resp);
                    // console.log("resp.data.img", resp.data.img);
                    var image = resp.data.img;
                    var comments = resp.data.comments;
                    console.log("we are here", comments);
                    that.id = image.id;
                    that.url = image.url;
                    //console.log("this.url", this.url);
                    that.title = image.title;
                    that.username = image.username;
                    that.description = image.description;
                    that.comments = comments;
                    console.log("that here", that);
                })
                .catch(function (err) {
                    console.log("error in axios GET images/id", err);
                });
        },
        methods: {
            handleClickImage: function (e) {
                e.preventDefault();
                console.log("this.name", this.name);
                console.log("this.comment", this.comment);
                var message = {
                    name: this.name,
                    comment: this.comment,
                    image_id: this.id,
                };
                //console.log("message :", message);
                axios
                    .post("/comment", message)
                    .then(function (resp) {
                        console.log("response", resp);
                    })
                    .catch(function (err) {
                        console.log("error in axios post comment", err);
                    });
            },
            closePop: function (e) {
                e.preventDefault();
                console.log("Clicked X to close!");
                this.$emit("close");
            },
        },
    });

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
            id: null,
            showModal: false,
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
                var that = this;
                e.preventDefault();
                var formData = new FormData();
                // console.log("username", username);
                // console.log("this.username", this.username);

                formData.append("imagetitle", this.imagetitle);
                formData.append("imagedescription", this.imagedescription);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from POST /upload: ", resp);
                        // console.log("resp.data from POST /upload: ", resp.data);
                        // console.log(
                        //     "resp.data from POST /upload: ",
                        //     resp.data[0]
                        // );
                        console.log(
                            "that.boardImages BEFORE unshift",
                            that.boardImages
                        );
                        that.boardImages.unshift(resp.data.image);
                        console.log(
                            "that.boardImages AFTER unshift",
                            that.boardImages
                        );
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
            handleClickPop: function (id) {
                //console.log("Popmodal clicked to open")
                this.id = id;
                this.showModal = true;
            },
            closePop: function () {
                //console.log("Popmodal clicked to close")
                this.showModal = false;
            },
        },
    });
})();
