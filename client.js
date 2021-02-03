const PROTO_PATH = __dirname + '/src/protos/author.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const author_proto = grpc.loadPackageDefinition(packageDefinition).author;

function main() {
    let author = new author_proto.createAuthor('localhost:5050', grpc.credentials.createInsecure());

    author.create({authorName: 'Jalol'}, function(err, response) {
        console.log('Response: ', response.success);
    });
}

main();