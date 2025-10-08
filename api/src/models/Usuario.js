const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, minlength: 2 },
		email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
		password: { type: String, required: true, minlength: 8 },
		role: { type: String, enum: ["admin", "customer"], default: "customer" },
	},
	{ timestamps: true }
);

userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);
module.exports = User;

