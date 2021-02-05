const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

let PROTO_PATH = __dirname + '/protos/author.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const author_proto = grpc.loadPackageDefinition(packageDefinition).author;

function main() {
    let server = new grpc.Server();
    server.addService(author_proto.authorService.service, require("./services/authorService.js"));
    server.bindAsync(process.env.HOST, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Server run on ${process.env.HOST}`);
    });
}

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => main());