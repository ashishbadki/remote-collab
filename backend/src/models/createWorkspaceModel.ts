import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

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
    },
    members: [memberSchema],
},
{
    timestamps: true,
}
)

export default mongoose.model("Workspace", createWokspaceSchema)
