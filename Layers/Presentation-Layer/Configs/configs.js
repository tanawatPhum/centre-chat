let requires = require('./requires.js')
let constants = require('./constants.js')


let app = requires.express();
let mongoose = requires.mongoose;
let http = requires.http.createServer(app);
let io = requires.socketIo(http);
let bodyParser = requires.parser;
let buffer = requires.buffer.Buffer
let https = requires.https;
let fs = requires.fs;
let request = requires.request;
let cors = requires.cors;
let formData = requires.formData;
let amqp = requires.amqp
let allowedOrigin = constants.allowedOrigin;


let models = require('./models.js')(mongoose, constants)

function initialConfigs() {
    http.listen(constants.appPort, (ev) => {
        console.log(`App listening on port ${constants.appPort}`)
    })
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use(cors({
        origin: allowedOrigin
    }));

    mongoose.connect(`
    mongodb://${constants.mongoUrl}`, { dbName: constants.mongoDBName, useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {


            console.log(`Mongo Connected on ${constants.mongoDBName}`)

        }, err => {
            console.log(`Mongo Connect error ${err}`)
        })
    io.sockets.on('connection', (socket) => {
        console.log('Socket user connected');
    });

    // amqp.connect('amqp://' + constants.rabbitMQHost, (err, connection) => {
    //     if (err) {
    //         console.log(`Amqp connect error ${err}`)
    //         throw err;
    //     }
    //     connection.createChannel((err, channel) => {
    //         if (err) {
    //             console.log(`Amqp create error ${err}`)
    //             throw err;
    //         }
    //         console.log(`Amqp created`)
    //         const queue = 'hello';
    //         const msg = 'Hello world';
    //         channel.assertQueue(queue, { durable: true });
    //         channel.sendToQueue(queue, Buffer.from(msg));
    //         console.log(" [x] Sent %s", msg);

    //     });
    // });


}




module.exports = {
    initialConfigs: initialConfigs,
    app: app,
    mongoose: mongoose,
    io: io,
    buffer: buffer,
    formData: formData,
    constants: constants,
    models: models,
    http: http,
    https: https,
    fs: fs,
    request: request,
}