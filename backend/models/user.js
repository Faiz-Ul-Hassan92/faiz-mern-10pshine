import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique: true
    },
    email: {
        type: String,
        required : true,
        unique: true
    },
    password: {
        type: String,
        required : true
    }
}, {timestamps: true})


userSchema.pre("save", async function() {
    if (!this.isModified("password")) return; //if it isnt changed, dont hash again
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); //adding salt to the password for secure storing
    
})


//compare user password(entered/ plain text) with the stored salted password, by adding and hashing with the saved salt

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


const User = mongoose.model("User", userSchema)


export default User