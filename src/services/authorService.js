const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    name: {type: String}
}, {collection: 'author'});
const authorModel = mongoose.model('author', AuthorSchema);

const authorService = {
    create: async (call, callback) => {
        let result = await authorModel.create({name: call.request.authorName});
        callback(null, {success: !!result, id: result._id});
    },
    update: async (call, callback) => {
        console.log(call.request.id);
        console.log(mongoose.Types.ObjectId(call.request.id));
        let result = authorModel.updateOne({_id: mongoose.Types.ObjectId(call.request.id)}, {name: call.request.authorName});

        callback(null, {success: !!result, id: result._id});
    },
    delete: async (call, callback) => {
        let result = authorModel.deleteOne({_id: mongoose.Types.ObjectId(call.request.id)});

        callback(null, {success: !!result, id: result._id});
    },
    getAll: async (call, callback) => {
        let count = await authorModel.countDocuments();
        let result = await authorModel.find();

        callback(null, {success: !!result, count: count/*, items: result*/});
    },
    getById: async (call, callback) => {
        let result = await authorModel.find({_id: mongoose.Types.ObjectId(call.request.id)});

        callback(null, {success: !!result, id: result._id, authorName: result.name});
    }
};

module.exports = authorService;