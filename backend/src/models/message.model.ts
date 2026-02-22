import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  encryptedText: {
    type: String,
    required: true,
  },

},
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);