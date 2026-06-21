import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    img:{
        type: String,
        default: ""
    },
    description:{
        type: String,
        required: false

    },
    isSeller:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: ["customer","provider","admin"],
        default: "customer"
    }
},{timestamps: true});

export default mongoose.model("User",userSchema);