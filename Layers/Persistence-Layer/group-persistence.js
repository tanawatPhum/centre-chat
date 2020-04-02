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
        saveUserGroupHistory: saveUserGroupHistory,
        deleteOldUserGroupHistory: deleteOldUserGroupHistory
    }
}

function saveUserGroupHistory(objSave) {
    return commonPersistence.saveDataToDB(objSave, models.modelUserGroupHistory)
}

function deleteOldUserGroupHistory(condition) {
    return commonPersistence.deleteDataFromDB(condition, models.modelUserGroupHistory)
}