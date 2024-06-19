const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema(
    {
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content : String,
        chat : {
            type : mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        },
        isVu : {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
)

const Message = mongoose.model('Message',MessageSchema);

module.exports = Message;