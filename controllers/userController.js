import { User } from '../models/userModels.js';


export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body

        //if user exists return error
        let user = await User.findOne({ email })  // shortHand for email:email
        if (user) return res.status(400)
            .json({ success: false, message: "User already exists." })

        // creating user
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id:"profile pic",
                url:"https://i.dummyjson.com/data/products/1/1.jpg"
            }
        });
        res.status(201).json({
            success: true,
            message: "Can't register",
            user
        })


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't register"
        })
    }
}

