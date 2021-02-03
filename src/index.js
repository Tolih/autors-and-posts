const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

let PROTO_PATH = __dirname + '/protos/author.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const author_proto = grpc.loadPackageDefinition(packageDefinition).author;

const AuthorSchema = new mongoose.Schema({
    name: {type: String}
}, {collection: 'author'});
const authorModel = mongoose.model('author', AuthorSchema);

async function createAuthor(call, callback) {
    let result = await authorModel.create({name: call.request.authorName});

    callback(null, {success: result ? true : false});
}

function main() {
    let server = new grpc.Server();
    server.addService(author_proto.createAuthor.service, {create: createAuthor});
    server.bindAsync(process.env.HOST, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Server run on ${process.env.HOST}`);
    });
}

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => main());