let persistence
let constants;
let buffer;
let commonLogic;
let fs;
let request;
let io;
let formData;
let http;
module.exports = (configs) => {
    constants = configs.constants;
    buffer = configs.buffer;
    fs = configs.fs;
    io = configs.io;
    request = configs.request;
    formData = configs.formData;
    http = configs.http;
    persistence = require('../Persistence-Layer/message-persistence.js')(configs)
    commonLogic = require('./common-logic.js')(configs)
    return {
        saveMessage: saveMessage,
        findMessage: findMessage,
        unsendMessage: unsendMessage,
        deleteMessage: deleteMessage,
        archiveMessage: archiveMessage
    }
}

function saveMessage(objMessage) {
    return new Promise((resolve) => {
        let dateNow = Date.now()
        objMessage.messageTime = dateNow
        objMessage['messageId'] = buffer.from(objMessage.userId + objMessage.groupId + dateNow).toString('base64')
        if (objMessage.userId && objMessage.groupId) {
            persistence.saveMessage(objMessage).then((result) => {
                let resultMessage = JSON.parse(JSON.stringify(result))
                resultMessage.refID = objMessage.refID
                persistence.saveMessageDetail(objMessage).then(() => {
                    io.emit('messageForGroup_' + objMessage.groupId, commonLogic.createResultEvent(constants.chatMessageStatus.new, result));
                    resolve(commonLogic.createResultSucess(constants.messages.created, null));
                }).catch((err) => {
                    resolve(commonLogic.createResultError(err, null));
                })
            }).catch((err) => {
                resolve(commonLogic.createResultError(err, null));
            })
        } else {
            resolve(commonLogic.createResultFailed(constants.messages.missingField, null))
        }
    })
}

function findMessage(objMessage) {
    return new Promise((resolve, reject) => {
        let targetTime = new Date(objMessage.messageTime);
        if (!objMessage.messageTime) {
            targetTime = null
        }
        let conditions = {
            find: {
                userId: objMessage.userId,
                groupId: objMessage.groupId
            },
            sort: {
                $natural: -1
            },
            glte: {
                fieldName: 'messageTime',
                fieldValue: targetTime
            },
            limit: objMessage.messageNumber
        }
        persistence.findMessage(conditions).then((result) => {
            if (result.length > 0) {
                resolve(commonLogic.createResultSucess(constants.messages.found, result))
            } else {
                resolve(commonLogic.createResultSucess(constants.messages.notFound, result))
            }
        }).catch((err) => {
            resolve(commonLogic.createResultError(err, null));
        })

    })

}

function deleteMessage(messageId) {
    let condition = { messageId: messageId }
    let objUpdate = {
        messageStatus: constants.chatMessageStatus.deleted
    }
    return new Promise((resolve, reject) => {
        persistence.unsendMessage(condition, objUpdate).then((result) => {
            resolve(commonLogic.createResultSucess(constants.messages.deleted, null))
        }).catch((err) => {
            resolve(commonLogic.createResultError(err, null));
        })


    })

}

function archiveMessage(objMessage) {
    return new Promise((resolve, reject) => {
        let conditions = {
            find: {
                userId: objMessage.userId,
                groupId: objMessage.groupId
            }
        }
        persistence.achiveMessage(conditions).then((result) => {
            if (result && result.length > 0) {
                let achiveList = []
                result.forEach((messageObj) => {
                    let achiveObj = {
                        "Sender Name": messageObj.userId,
                        "Message Id": messageObj.messageId,
                        "Message": messageObj.messageText,
                        "Message Type": messageObj.messageType,
                        "Message Time": messageObj.messageTime
                    }
                    achiveList.push(achiveObj)
                })

                let bufferOject = Buffer.from(JSON.stringify(achiveList));
                let dateNow = Date.now();
                let fileName = buffer.from(objMessage.userId + objMessage.groupId + dateNow).toString('base64');
                let formData = {
                    groupId: objMessage.groupId,
                    fileName: fileName,
                    fileType: 'json',
                    file: {
                        value: bufferOject, // Upload the first file in the multi-part post
                        options: {
                            filename: fileName
                        }
                    }
                };
                const options = {
                    uri: constants.appCenterHost + '/' + constants.uploadFileService,
                    formData: formData,
                    method: 'POST'
                }
                request(options, (err, response, body) => {
                    let achiveObj = {
                        archiveTime: dateNow,
                        archiveFileName: fileName,
                        archiveId: null
                    }
                    body = JSON.parse(body);
                    if (!err && body.success) {
                        let conditions = {
                            find: {
                                userId: objMessage.userId,
                                groupId: objMessage.groupId
                            }
                        }

                        achiveObj.archiveId = body.data.id
                        persistence.findArchiveHistory(conditions.find).then((result) => {
                            if (result.length > 0) {
                                result[0].archiveHistorys.push(achiveObj)
                                let condition = {
                                    update: {
                                        userId: objMessage.userId,
                                        groupId: objMessage.groupId
                                    }
                                }
                                let objUpdate = {
                                    archiveHistorys: result[0].archiveHistorys
                                }
                                persistence.updateArchiveHistory(condition.update, objUpdate).then((result) => {
                                    achiveObj.archiveTime = Date(achiveObj.archiveTime)
                                    resolve(commonLogic.createResultSucess(constants.messages.created, achiveObj));
                                }).catch((err) => {
                                    resolve(commonLogic.createResultError(err, null));
                                })
                            } else {
                                let objSaveFile = {
                                    userId: objMessage.userId,
                                    groupId: objMessage.groupId,
                                    archiveHistorys: [achiveObj]
                                }
                                persistence.saveArchiveHistory(objSaveFile).then((result) => {
                                    achiveObj.archiveTime = Date(achiveObj.archiveTime)
                                    resolve(commonLogic.createResultSucess(constants.messages.created, achiveObj));
                                }).catch((err) => {
                                    resolve(commonLogic.createResultError(err, null));
                                })
                            }
                        })
                    } else {
                        if (!body.success) {
                            resolve(commonLogic.createResultError(body.message, null));
                        } else {
                            resolve(commonLogic.createResultError(err, null));
                        }
                    }
                })
            } else {
                resolve(commonLogic.createResultSucess(constants.messages.notFound, result))
            }
        }).catch((err) => {
            resolve(commonLogic.createResultError(err, null));
        })

    })
}

function unsendMessage(objMessage) {
    let condition = { messageId: objMessage.messageId }
    let objUpdate = {
        messageStatus: constants.chatMessageStatus.unsend
    }
    return new Promise((resolve, reject) => {
        persistence.unsendMessage(condition, objUpdate).then((result) => {
            let objData = {
                messageId: objMessage.messageId,
            }
            io.emit('messageForGroup_' + objMessage.groupId, commonLogic.createResultEvent(constants.chatMessageStatus.unsend, objData));
            resolve(commonLogic.createResultSucess(constants.messages.updated, null))
        }).catch((err) => {
            resolve(commonLogic.createResultError(err, null));
        })


    })

}