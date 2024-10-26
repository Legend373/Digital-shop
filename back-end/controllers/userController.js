
import userModel from "../models/userModel.js";
import validater from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
//route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, msg: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, msg: "Incorrect password" })
        }
        const token = createToken(user._id)
        res.json({ success: true, token })
    }
    catch (error) {
        console.log(error);
    }
}
//route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //checking user aready exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, msg: "user already exists" })
        }
        //validating email format and strong password
        if (!validater.isEmail(email)) {
            return res.json({ success: false, msg: "Invalid email" })

        }
        if (password.length < 8) {
            return res.json({ success: false, msg: "please enter a strong password" })

        }
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPssword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            name,
            email,
            password: hashedPssword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, msg: error.message })
    }
}
//route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, msg: "invalid credential" })
        }

    } catch (error) {
        res.json({ success: false, msg: "error.message" })

    }

}
export { loginUser, registerUser, adminLogin }