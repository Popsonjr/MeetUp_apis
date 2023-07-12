import User from "../models/user_model.js"
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
import createError from "../utils/createError.js"

export const register =  async (req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 3)
        const newUser = new User({
            ...req.body,
            password: hash
        })

        await newUser.save()
        res.status(201).send("User has been created")
    } catch (err) {
        next(err)
    }
}
export const login =  async (req, res, next) => {
    try {
        const user = await User.findOne({username:req.body.username})
        
        if (!user) return next(createError(404, "user not found!"))

        const checkPassword = bcrypt.compareSync(req.body.password, user.password)
        if(!checkPassword) return next(404, "wrong password or username!")

        const token = jwt.sign({
            id: user._id,
            isSeller : user.isSeller,
        }, 
        process.env.JWT_KEY
        )
        const {password, ...userInfo} = user._doc
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).send(userInfo)
    } catch (error) {
        next(error)
    }
}
export const logout =  async (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    }).status(200).send("User has been logged out.")
}