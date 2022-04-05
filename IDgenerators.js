function ownerID() {
    return Math.random().toString(30).substr(2, 9) ;
};

function taskID() {
    return Math.random().toString(45).substr(3, 9) ;
}

module.exports = {ownerID, taskID}