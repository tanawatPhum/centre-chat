let constants;
let reultData = {
    status: null,
    message: null,
    objData: null
}

let reultEvent = {
    status: null,
    event: null,
    objData: null
}
module.exports = (configs) => {
    constants = configs.constants
    return {
        createResultSucess: createResultSucess,
        createResultFailed: createResultFailed,
        createResultError: createResultError,
        createResultEvent: createResultEvent
    }
}

function createResultSucess(message, objData) {
    reultData.status = constants.messages.success;
    reultData.message = message;
    reultData.objData = objData;
    return reultData

}

function createResultFailed(message, objData) {
    reultData.status = constants.messages.failed;
    reultData.message = message;
    reultData.objData = objData;
    return reultData
}

function createResultError(message, objData) {
    reultData.status = constants.messages.error;
    reultData.message = message;
    reultData.objData = objData;
    return reultData
}


function createResultEvent(event, objData) {
    reultEvent.status = constants.messages.success;
    reultEvent.event = event;
    reultEvent.objData = objData;
    return reultEvent
}