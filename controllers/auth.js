const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//REGISTER
const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, iam } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newUser = new User({
            firstName, lastName, email, password: hashedPassword,
            ...(iam === 'admin' ? { role: iam } : {})
        })
        const savedUser = await newUser.save()
        // Exclude password from the response
        const { password: removedPassword, ...userWithoutPassword } = savedUser._doc;
        res.status(200).json(userWithoutPassword);

    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }

}

// ADMIN LOGIN
const AdminLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json("User not found!")
        }
        if (user.role !== "admin") {
            return res.status(401).json({ message: "Not Admin" })
        }
        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            return res.status(401).json("Wrong credentials!")
        }

        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: "14d" })
        const { password, ...info } = user._doc
        res.status(200).json({ ...info, access_token: token })

    }
    catch (err) {
        throw new Error(err)
    }
}



//LOGIN
const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate('tenant')

        if (!user) {
            return res.status(404).json("User not found!")
        }
        const match = await bcrypt.compare(req.body.password, user.tenant.password)

        if (!match) {
            return res.status(401).json("Wrong credentials!")
        }

        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: "14d" })
        const { password, ...info } = user._doc
        res.status(200).json({ ...info, access_token: token })

    }
    catch (err) {
        throw new Error(err)
    }
}



//LOGOUT
const LogoutWithCookies = async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).send("User logged out successfully!")

    }
    catch (err) {
        throw new Error(err)
    }
}



// refetch user
const Refetch = async (req, res) => {
    // extract the token from the authorization header 
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    try {
        // verify the token
        const decoded = jwt.verify(token, process.env.SECRET);

        //At this point, you have the decoded user information (decoded)
        res.status(200).json({ ...decoded, access_token: token });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized - Invalid token" })
    }
}


//LOGOUT USER
const Logout = async (req, res) => {
    try {
        // Assuming you have some mechanism to invalidate or revoke the user's token on the server-side
        // For example, you might have a database of revoked tokens
        // When a user logs out, you add their token to this database

        // Invalidate or revoke the user's token on the server-side
        // This step will depend on your authentication mechanism
        // For demonstration purposes, let's assume you have a function revokeToken(token)
        // that adds the token to a list of revoked tokens
        const userToken = req.headers.authorization?.split(' ')[1];
        revokeToken(userToken);

        // Send a success response
        res.status(200).send("User logged out successfully!");
    } catch (err) {
        // Handle errors
        throw new Error(err);
    }
};



module.exports = {
    Register,
    Login,
    LogoutWithCookies,
    Refetch,
    Logout,
    AdminLogin
}