const router = require("./routes/api").router;
module.exports = function(app) {
    app.use('/api', router);
}