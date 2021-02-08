const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    name: {type: String}
}, {collection: 'author'});
const authorModel = mongoose.model('author', AuthorSchema);

const authorService = {
    create: async (call, callback) => {
        let result = await authorModel.create({name: call.request.authorName});
        callback(null, {success: !!result, id: result._id, authorName: result.name});
    },
    update: async (call, callback) => {
        let result = await authorModel.updateOne(
            {_id: mongoose.Types.ObjectId(call.request.id)},
            {$set: {name: call.request.authorName}}
        );

        callback(null, {success: !!result, id: call.request.id});
    },
    delete: async (call, callback) => {
        let result = await authorModel.deleteOne({_id: mongoose.Types.ObjectId(call.request.id)});

        callback(null, {success: !!result, id: result._id});
    },
    getAll: async (call, callback) => {
        let count = await authorModel.countDocuments();
        let result = await authorModel.aggregate([
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    authorName: '$name'
                }
            }
        ]);

        callback(null, {success: !!result, count: count, items: result});
    },
    getById: async (call, callback) => {
        let result = await authorModel.findById(mongoose.Types.ObjectId(call.request.id));

        callback(null, {success: !!result, id: result._id, authorName: result.name});
    }
};

module.exports = authorService;