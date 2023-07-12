import User from "../models/user_model.js"
import jwt  from "jsonwebtoken"
import createError from "../utils/createError.js"

export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)

    jwt.verify(token,process.env.JWT_KEY, async (err, payload) => {
        if(req.userId !== user._id.toString()){
            return next(createError(403, "you can delete only your account!")) 
        }
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send("Account deleted successfully")
    })
    
}