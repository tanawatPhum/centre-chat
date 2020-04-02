let constants;
let mongoose;
let commonPersistence;
let models;



module.exports = (configs) => {

    constants = configs.constants;
    mongoose = configs.mongoose;
    models = configs.models;
    commonPersistence = require('./common-persistence.js')(configs)
    return {
        saveMessage: saveMessage,
        saveMessageDetail: saveMessageDetail,
        findMessage: findMessage,
        unsendMessage: unsendMessage,
        deleteMessage: deleteMessage,
        achiveMessage: achiveMessage,
        saveArchiveHistory: saveArchiveHistory,
        findArchiveHistory: findArchiveHistory,
        updateArchiveHistory: updateArchiveHistory
    }
}

function saveMessage(objSave) {
    return commonPersistence.saveDataToDB(objSave, models.modelMessages)
}

function saveMessageDetail(objSave) {
    return commonPersistence.saveDataToDB(objSave, models.modelMessageDetails)
}


function findMessage(conditions) {
    return new Promise((resolve, reject) => {
        models.modelUserGroupHistory.findOne({ userId: conditions.find.userId, 'userHistorys.groupId': conditions.find.groupId })
            .exec((err, result) => {
                if (err) return reject(err);
                if (result && result.userHistorys.length > 0 && result.userHistorys[0].groupStatus !== constants.chatGroupStatus.leave) {
                    let targetUserHistory = result.userHistorys[0]
                    models.modelMessages.find({
                        groupId: conditions.find.groupId,
                        messageStatus: { $ne: constants.chatMessageStatus.deleted },
                        messageTime: { $gte: targetUserHistory.joinTime, $lte: conditions.glte.fieldValue }
                    }).sort(conditions.sort).limit(conditions.limit).exec((err, result) => {
                        if (err) return reject(err);
                        resolve(result)
                    })
                } else {
                    resolve([])
                }
            })
    })
}



function achiveMessage(conditions) {
    return new Promise((resolve, reject) => {
        models.modelUserGroupHistory.findOne({ userId: conditions.find.userId, 'userHistorys.groupId': conditions.find.groupId })
            .exec((err, result) => {
                if (err) return reject(err);
                if (result && result.userHistorys.length > 0 && result.userHistorys[0].groupStatus !== constants.chatGroupStatus.leave) {
                    let targetUserHistory = result.userHistorys[0]
                    models.modelMessages.find({
                        groupId: conditions.find.groupId,
                        messageStatus: { $ne: constants.chatMessageStatus.deleted },
                        messageTime: { $gte: targetUserHistory.joinTime }
                    }).exec((err, result) => {
                        if (err) return reject(err);
                        resolve(result)
                    })
                } else {
                    resolve(result)
                }
            })

    })

}

function saveArchiveHistory(objSave) {
    return commonPersistence.saveDataToDB(objSave, models.modelUserArchiveHistory)
}

function findArchiveHistory(objFind) {
    return commonPersistence.findDataFromDB(objFind, models.modelUserArchiveHistory)
}

function updateArchiveHistory(condition, objUpdate) {
    return commonPersistence.updateDataToDB(condition, objUpdate, models.modelUserArchiveHistory)
}


function unsendMessage(condition, objUpdate) {
    return commonPersistence.updateDataToDB(condition, objUpdate, models.modelMessages)
}


function deleteMessage(condition, objUpdate) {
    return commonPersistence.updateDataToDB(condition, objUpdate, models.modelMessages)
}