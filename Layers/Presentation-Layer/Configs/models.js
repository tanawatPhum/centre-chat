module.exports = (mongoose, constants) => {
    let objectSchemaMessage = new mongoose.Schema({
        userId: 'string',
        messageId: 'string',
        groupId: 'string',
        messageType: 'string',
        messageTime: { type: Date, default: Date.now },
        messageNumber: 'number',
        messageText: 'string',
        messageRefId: 'string',
        messageStatus: { type: String, default: constants.chatMessageStatus.created },
    });

    let objectSchemaMessageDetail = new mongoose.Schema({
        userId: 'string',
        messageId: 'string',
        messageType: 'string',
        messageDetail: 'Mixed'
    })

    let objectSchemaUserGroupHistory = new mongoose.Schema({
        userId: 'string',
        userHistorys: [{
            groupId: 'string',
            joinTime: { type: Date, default: Date.now },
            leaveTime: { type: Date, default: Date.now },
            groupStatus: 'string'
        }]
    })
    let objectSchemaUserArchiveHistory = new mongoose.Schema({
        userId: 'string',
        groupId: 'string',
        archiveHistorys: [{
            archiveTime: { type: Date, default: Date.now },
            archiveFileName: 'string',
            archiveId: 'string'
        }]
    })
    return {
        modelMessages: mongoose.model(constants.messageCollection, objectSchemaMessage),
        modelMessageDetails: mongoose.model(constants.messageDetailCollection, objectSchemaMessageDetail),
        modelUserGroupHistory: mongoose.model(constants.userGroupHistoryCollection, objectSchemaUserGroupHistory),
        modelUserArchiveHistory: mongoose.model(constants.userArchiveHistoryCollection, objectSchemaUserArchiveHistory),
    }
}