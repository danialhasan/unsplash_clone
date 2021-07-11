// parse env variables
require('dotenv').config();

// mongodb setup
const mongoose = require('mongoose')
const mongodbPassword = process.env.MONGODB_PASSWORD
const userSchema = require('../schema/userSchema.js')
const User = mongoose.model("user", userSchema, "Users")

//  CORS middleware setup
const cors = require('cors');
// jwt setup
const jwt = require("jsonwebtoken")

// express setup
const express = require('express');
const router = express.Router();

// router.use(cors())

// bcrypt setup 
const bcrypt = require('bcrypt');

router.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://unsplash-clone-dh.netlify.app');
    res.setHeader('Access-Control-Allow-Origin', `${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    next()
})

// connecting to MongoDB with Mongoose
const connectionString = `mongodb+srv://dbAdmin:${process.env.MONGODB_PASSWORD}@cluster0.wcdjk.mongodb.net/UnsplashClone?retryWrites=true&w=majority`;
try {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} catch {
    console.log("MongoDB Auth failed")
}

async function findUser(email) {
    /**
     * findOne resolves to the document (if it exists), or null (if the document does not exist)
     */
    try {
        return await User.findOne({
            email
        })
    } catch {
        console.log("findUser function failed in user.js on server")
    }
}
// router.options('/logout', cors())

router.get('/', (req, res) => {
    res.send("You hit the /users route.")
});

async function emptyCollections() {
    let deleted = await User.deleteMany({})
    if (deleted) {
        console.log("All documents in collection deleted.")
    } else {
        console.log("There was an error in the deletion of documents.")
    }
}

router.route('/login')
    .get((req, res) => {
        res.send("This is the login GET route")
    })
    .post((req, res) => {
        console.log(req)
        res.send("This is the login POST route")
    })
router.post('/login/verify', async (req, res) => {
    console.log(req.body.email)
    console.log(req.body.password)
    // createUser(req.body.username, req.body.password)
    let userObject = await findUser(req.body.email)
    if (userObject != null) {
        // res.write("User was found in profiles database")
        console.log("User found \n\n");
        console.log(`Users plaintext password: ${req.body.password}`);
        console.log(`Users hashed password: ${userObject.hashedPassword}`);

        // see if incoming plaintext password == hashedPassword in database
        const passwordsMatch = await bcrypt.compare(req.body.password, userObject.hashedPassword);
        if (passwordsMatch) {
            console.log(`Passwords match: ${passwordsMatch}`)
            // NOTE log user in with JWT
            // generating JWT
            const accessTokenObject = {
                accessToken: jwt.sign(JSON.stringify(userObject.email), process.env.ACCESS_TOKEN_SECRET)
                // used to sign with JSON.stringify(userObject) and not just the email, but that 
                // made the access token balloon to huge sizes not fit for localstorage.
            }
            // console.log(JSON.stringify(userObject.email))
            res.status(214);
            res.statusMessage = "JWT Generated"
            res.json(accessTokenObject);
        } else {
            res.status(215);
            res.statusMessage = "Incorrect password"
            res.send("Incorrect password. Requested password did not match database password.")
        }
    } else {
        res.status(216);
        res.send("Email not found.");
        console.log("User not found \n\n")
    }
})
router.post('/register', async (req, res) => {
    let passwordsMatch = checkPasswords(req.body.password, req.body.verifyPassword);
    let usernameIsAvailable = await usernameAvailable(req.body.username)
    let emailIsUnique = await emailAvailable(req.body.email);
    let hashedPassword = await hashPassword(req.body.password)

    if (passwordsMatch && usernameIsAvailable && emailIsUnique && hashedPassword != undefined) {
        let newUser = await createAccount(req.body.username, req.body.name, req.body.email, hashedPassword);
        console.log('User saved to database');
        res.status(210).write("Account successfully created!");
    } else {
        console.log('User not saved to database');
        if (!passwordsMatch) {
            res.status(211).write("Passwords did  not match.");
        } else if (!usernameIsAvailable) {
            res.status(212).write("Username was not available. ");
        } else if (!emailIsUnique) {
            res.status(213).write("The email used for registration is already registered to an account. If this is you, please log in with your password.")
        }
    }
    res.end()
})

router.route('/profile')
    .post(async (req, res) => {
        // get profile data from mongodb, send to client to update vuex store
        console.log("Email received:")
        console.log(req.body)
        let user = await findUser(req.body.email);
        if (user == null) {
            res.status(217).send('User not found')
        } else {
            console.log('User profile found')
            console.log(user)
            res.send(user)
        }
    })
    .patch(async (req, res) => {

        const editedProfile = req.body.profile
        const oldEmail = req.body.oldEmail
        const oldUsername = req.body.oldUsername

        console.log(`oldEmail:${oldEmail}`)
        console.log(`oldUsername:${oldUsername}`)

        let usernameIsAvailable = await usernameAvailable(editedProfile.username)
        let emailIsUnique = await emailAvailable(editedProfile.email);

        if (oldEmail !== editedProfile.email) {
            if (!emailIsUnique) {
                res.status(218).send("Email is taken.")
                console.log(`Email ${editedProfile.email} was taken.`);
                return;
            }
        } else if (oldUsername !== editedProfile.username) {
            if (!usernameIsAvailable) {
                res.status(219).send('Username is taken.')
                console.log(`Email ${editedProfile.username} was taken.`)
                return;
            }
        }

        let user = await findUser(oldEmail);
        if (user == null) {
            console.log('user not found')
            return
        }
        user.username = editedProfile.username
        user.name = editedProfile.name
        user.bio = editedProfile.bio
        user.email = editedProfile.email
        user.save().then((savedUser) => {
            res.status(220);
            res.statusMessage = 'Email saved successfully';
            res.send(savedUser)
        })

        // res.write("User saved!")
        // res.send(user.email)
    })
router.patch('/profile/image', async (req, res) => {
    let user = await findUser(req.body.email)
    if (user == null) {
        console.error('user not found')
        return;
    }
    user.displayImage = req.body.image;
    user.save().then((savedUser) => {
        res.status(200).send(savedUser);
    }).catch((err) => {
        console.error(err);
        res.status(404).send(`User with email ${req.body.email} not found.`)
    })
})

function checkPasswords(p1, p2) {
    let regex = /^[A-Za-z0-9 ]+$/;

    if (!(p1 == p2)) {
        res.send(`Passwords do not match: ${p1} != ${p2}`);
        return;
    } else if (p1.length < 8 || !regex.test(p1)) {
        res.send(`Password ${p1} does not meet the complexity requirements.`)
        return;
    } else {
        return true
    }
}

async function usernameAvailable(username) {
    try {
        let usernameIsUnique = await User.exists({
            username
        })
        return !usernameIsUnique
    } catch (error) {
        throw new Error(`Unable to connect to the database.`)
    }
}

async function emailAvailable(email) {
    // checks database to see if email has been registered before.
    try {
        let emailIsUnique = await User.exists({
            email
        })
        return !emailIsUnique
    } catch (error) {
        throw new Error(`Unable to connect to the database.`)
    }
    // console.log(`emailIsAvailable (from the function itself): ${emailIsUnique}`)
    // return emailIsUnique; //sync, undefined
}

async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, 10);
}

async function createAccount(username, name, email, hashedPassword) {
    let newUser = await new User({
        username,
        email,
        name,
        hashedPassword,
    }).save();
    return newUser
}


module.exports = router;