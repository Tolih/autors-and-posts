const dotenv = require("dotenv");
dotenv.config();
const PROTO_PATH = __dirname + '/src/protos/author.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const author_proto = grpc.loadPackageDefinition(packageDefinition).author;

function main() {
    let author = new author_proto.authorService(process.env.HOST, grpc.credentials.createInsecure());

    try {
        let authorId;
        author.create({authorName: 'Jalol'}, function(err, response) {
            if (err) throw err;
            console.log('Response on createAuthor: ', response);
            authorId = response.id;

            author.getAll({}, function(err, response) {
                if (err) throw err;
                console.log('Response on getAllAuthor: ', response);

                author.update({id: authorId, authorName: 'Jaloliddin'}, function(err, response) {
                    if (err) throw err;
                    console.log('Response on updateAuthor: ', response);

                    author.getById({id: authorId}, function (err, response) {
                        if (err) throw err;
                        console.log('Response on getByIdAuthor: ', response);
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error: ', {message: error.message, stack: error.stack});
    }
}

main();