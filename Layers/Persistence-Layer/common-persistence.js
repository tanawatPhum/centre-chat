let constants;
let mongoose;

module.exports = (configs) => {
    constants = configs.constants;
    mongoose = configs.mongoose;
    return {
        saveDataToDB: saveDataToDB,
        findDataFromDB: findDataFromDB,
        deleteDataFromDB: deleteDataFromDB,
        updateDataToDB: updateDataToDB
    }
}

function saveDataToDB(objSave, model) {
    return new Promise((resolve, reject) => {
        //let schema = new mongoose.Schema(objSchema);
        //  let collection = mongoose.model(nameCollection, schema);
        let document = new model(objSave);
        console.log('**Obj for save:', document)
        document.save((err, result) => {
            if (err) return reject(err);
            resolve(result)
        })
    })
}

function findDataFromDB(conditions, model) {
    return new Promise((resolve, reject) => {
        model.find(conditions).exec((err, result) => {
            if (err) return reject(err);
            resolve(result)

        })
    })
}



function deleteDataFromDB(conditions, model) {
    return new Promise((resolve, reject) => {
        model.deleteMany(conditions, (err, result) => {
            if (err) return reject(err);
            resolve(result)

        })
    })
}


function updateDataToDB(conditions, objUpdate, model) {
    return new Promise((resolve, reject) => {
        model.updateMany(conditions, objUpdate, (err, result) => {
            if (err) return reject(err);
            resolve(result)
        })
    })
}