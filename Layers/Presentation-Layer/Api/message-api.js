let messageLogic;
let app;
module.exports = (configs) => {
    app = configs.app;
    messageLogic = require('../../Logic-Layer/message-logic.js')(configs)
    saveMessage()
    findMessage()
    unsendMessage()
    deleteMessage()
    archiveMessage()

};

function saveMessage() {
    app.post('/api/save/message', (req, res) => {
        messageLogic.saveMessage(req.body).then((result) => {
            res.send(result)
        })

    })
}

function findMessage() {
    app.post('/api/find/message', (req, res) => {
        messageLogic.findMessage(req.body).then((result) => {
            res.send(result)
        })

    })
}

function unsendMessage() {
    app.post('/api/update/unsendMessage', (req, res) => {
        messageLogic.unsendMessage(req.body).then((result) => {
            res.send(result)
        })
    })
}

function deleteMessage() {
    app.get('/api/delete/deleteMessage', (req, res) => {
        messageLogic.deleteMessage(req.query.messageId).then((result) => {
            res.send(result)
        })
    })
}

function archiveMessage() {
    app.post('/api/get/archiveMessage', (req, res) => {
        messageLogic.archiveMessage(req.body).then((result) => {
            res.send(result)
        })
    })
}