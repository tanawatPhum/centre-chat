let persistence
let constants;
let commonLogic;

module.exports = (configs) => {
    constants = configs.constants;
    persistence = require('../Persistence-Layer/group-persistence.js')(configs)
    commonLogic = require('./common-logic.js')(configs)
    return {
        saveUserGroupHistorys: saveUserGroupHistorys,
        findTargetGroup: findTargetGroup,
        mapDataUserGroupHistory: mapDataUserGroupHistory
    }
}

function saveUserGroupHistorys(groupUserHistorysObj) {
    return new Promise(async(resolve, reject) => {
        await persistence.deleteOldUserGroupHistory({ userId: groupUserHistorysObj.userId })
        persistence.saveUserGroupHistory(groupUserHistorysObj).then(() => {
            resolve(commonLogic.createResultSucess(constants.messages.updated, null));
        })
    })

}

function findTargetGroup(userHistorys, groupId) {
    return new Promise((resolve, reject) => {
        let targetGroup = userHistorys.find((obj) => obj.groupId === groupId)
        if (targetGroup) {
            resolve(commonLogic.createResultSucess(constants.messages.found, targetGroup));
        } else {
            resolve(commonLogic.createResultSucess(constants.messages.notFound, null));
        }
    })
}

function mapDataUserGroupHistory(dataObj) {
    let resultObj = {
        userId: dataObj.userId,
        userHistorys: []
    }
    dataObj.transaction.forEach((obj) => {
        let newObj = {
            groupId: obj.groupId,
            joinTime: new Date(obj.txDate),
            leaveTime: null,
            groupStatus: obj.txType
        }
        resultObj.userHistorys.push(newObj)
    })
    return resultObj
}