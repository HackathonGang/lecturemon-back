function getUnis() {
    db = createdb();
    let unis = []
    db.each(`SELECT (name) FROM unis;`, function(err, row) {
        unis.push(row[0]);
    })
    return unis;
}

module.exports.createdb = createdb;
module.exports = 'dbmethods';