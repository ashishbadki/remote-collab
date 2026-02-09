import mongoose from "mongoose";

const createWokspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["personal", "team", "startup", "enterprise"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true,
}
)

export default mongoose.model("Workspace", createWokspaceSchema)
