module.exports = {
    appPort: 3000,
    appCenterHost: process.env.APPCENTER_URL || 'https://sandbox.oneweb.tech',
    appCenterGetUserGroupHistory: '',
    uploadFileService: '/FileService/uploadFile',
    mongoUrl: process.env.MONGO_URL || 'chatAdmin:password@localhost:27018',
    mongoUser: 'chatAdmin',
    mongoPassword: 'password',
    mongoDBName: process.env.MONGO_DB_NAME || 'chat_db',
    messageCollection: 'messages',
    rabbitMQHost: 'localhost',
    messageDetailCollection: 'message_details',
    userGroupHistoryCollection: 'user_group_histories',
    userArchiveHistoryCollection: 'user_archive_histories',
    allowedOrigins: process.env.ALLOW_ORIGIN || '*',
    messages: {
        success: "Success",
        failed: "Failed",
        updated: "Updated",
        deleted: "Deleted",
        error: "Error",
        missingField: 'Missing Field',
        created: "Created",
        found: "Found",
        notFound: "Not Found"
    },
    chatMessageStatus: {
        created: "Created",
        unsend: 'Unsend',
        deleted: 'Deleted',
        new: 'New'
    },
    chatGroupStatus: {
        leave: "leave",
        join: "join"
    }

}