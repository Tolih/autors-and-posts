const dotenv = require("dotenv");
dotenv.config();
const PROTO_PATH = __dirname + '/src/protos/author.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const author_proto = grpc.loadPackageDefinition(packageDefinition).author;

async function main() {
    let author = new author_proto.authorService(process.env.HOST, grpc.credentials.createInsecure());
    grpc_promise.promisifyAll(author);
    try {
        let authorId;
        let createResponse = await author.create().sendMessage({authorName: 'Jalol'});
        console.log('Response on createAuthor: ', createResponse);
        authorId = createResponse.id;

        let getAllResponse = await author.getAll().sendMessage();
        console.log('Response on getAllAuthor: ', getAllResponse);

        let updateResponse = await author.update().sendMessage({id: authorId, authorName: 'Jaloliddin'});
        console.log('Response on updateAuthor: ', updateResponse);

        let getByIdResponse = await author.getById().sendMessage({id: authorId});
        console.log('Response on getByIdAuthor: ', getByIdResponse);

        let deleteResponse = await author.delete().sendMessage({id: authorId});
        console.log('Response on deleteAuthor: ', deleteResponse);

    } catch (error) {
        console.error('Error: ', {message: error.message, stack: error.stack});
    }
}

main();