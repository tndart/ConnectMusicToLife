Object.defineProperty(String.prototype, 'capitalize', {
    value() {
        return this.replace(/\w\S*/g, function (txt) {
            return txt
                .charAt(0)
                .toUpperCase() + txt
                .substr(1)
                .toLowerCase();
        });
    }
});

module.exports.sendResponse = (res, json) => {
    res.setHeader('Content-Type', 'application/json');
    //res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.setHeader("Access-Control-Allow-Methods", "GET, POST")
    res.send(JSON.stringify(json, null, 4));
    return res;
}