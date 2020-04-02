let app;
let https;
let constants
let io;
module.exports = (configs) => {
    app = configs.app;
    https = configs.https;
    constants = configs.constants;
    groupLogic = require('../../Logic-Layer/group-logic.js')(configs)
    getUserGroupHistorys()
}

function getUserGroupHistorys() {
    app.post('/api/update/userGroupHistory', (req, res) => {
        requestUserGroupHistorys(req.body).then((result) => {
            res.send(result)
        })
    })
}

function requestUserGroupHistorys(objReq) {
    return new Promise(async(resolve, reject) => {
        // https.get(constants.appCenterHost+'/'+appCenterGetUserGroupHistory+'?userId='+req.body.userId, (response) => {
        let mockData = {
            userId: "userIdtest",
            transaction: [{
                    groupId: "groupIdtest",
                    txDate: "2017-05-01T15:04:05.63Z",
                    txType: "join"
                },
                {
                    groupId: "Group c",
                    txDate: "2017-05-01T15:04:05.63Z",
                    txType: "leave"
                },
                {
                    groupId: "Group B",
                    txDate: "2017-05-01T15:04:05.63Z",
                    txType: "join"
                }
            ]
        }
        let resultData = groupLogic.mapDataUserGroupHistory(mockData)
        groupLogic.saveUserGroupHistorys(resultData).then((result) => {
                resolve(result)
            })
            //resolve(groupLogic.findTargetGroup(resultData.userHistorys, objReq.groupId))
            // })
    })

}