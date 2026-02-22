import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    allowedRoles: [{
      type: String,
      enum: ["admin", "member", "owner"], // Roles allowed to access if not private (or in addition to members?)
      // distinct from workspace roles, but reusing the concept.
      // actually, if isPrivate is true, relying on `members` array is best.
      // if isPrivate is false, but we want "Admin Only", we can use this.
    }],
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;