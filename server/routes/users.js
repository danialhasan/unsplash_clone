// mongodb setup
const mongoose = require('mongoose')
const mongodbPassword = process.env.MONGODB_PASSWORD
const userSchema = require('../schema/userSchema.js')
const User = mongoose.model("user", userSchema, "Users")

// express setup
const express = require('express');
const router = express.Router();

// bcrypt setup 
const bcrypt = require('bcrypt');

const connectionString = `mongodb+srv://dbAdmin:${process.env.MONGODB_PASSWORD}@cluster0.wcdjk.mongodb.net/UnsplashClone?retryWrites=true&w=majority`;
try {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} catch {
    console.log("MongoDB Auth failed")
}

async function findUser(username) {
    //for some reason this doesn't return false when this is run for a username that
    //doesnt exist in the database
    return await User.findOne({
        username
    })
}

router.get('/', (req, res) => {
    res.send("You hit the /users route.")
});

router.route('/login')
    .get((req, res) => {
        res.send("This is the login GET route")
    })
    .post((req, res) => {
        console.log(req)
        res.send("This is the login POST route")
    })
router.post('/login/verify', (req, res) => {
    /**
     * This route will take in the username and password and compare them to the 
     * info in the database by using bcrypt's hash compare function 
     * to compare the given plaintext password to the hashed password that resides in the 
     * database. Logins will be done with Passportjs local strategy, with help
     * from Traversy Media. 
     */
    console.log(req.body.username)
    console.log(req.body.password)
    // createUser(req.body.username, req.body.password)
    if (findUser(req.body.username)) {
        //user is in the database, now verify the given
        //plaintext password to the databases' hashed password
        res.write("User was found in profiles database")
    } else {
        res.write("User was not found in profiles database.");
    }
    res.end()
})
router.post('/register', async (req, res) => {
    /**
     * This route will take in a username, password, name, and email and then
     * validate them all for specific parameters (email has an @, password is of certain length, etc). 
     * Then, it will check if the email is currently registered and then if the username is taken 
     * (checking if either are in database).
     * 
     * If both are no, then the new user is probably fine to register, so then the password will be 
     * hashed. A new profile will be created in the users database where all this information plus the
     * hashed password will reside. 
     * After that, the user should be good to log in, so they'll be redirected to the login page. 
     */
    let passwordsMatch = await checkPasswords(req.body.password, req.body.verifyPassword);
    let usernameIsAvailable = await usernameAvailable(req.body.username)
    let emailIsUnique = await emailUnique(req.body.email);
    let hashedPassword = await hashPassword(req.body.password)
    // console.log(hashedPassword)
    // let hash = await hashPassword("BruhMomentThisIsATestPassword");
    // console.log(hash)

    if (passwordsMatch && usernameIsAvailable && emailIsUnique && hashedPassword != undefined) {
        let newUser = await createAccount(req.body.username, req.body.name, req.body.email, hashedPassword);
        console.log('User saved to database')
        res.status(210).write("Account successfully created!")
    } else {
        console.log('User not saved to database')
        if (!passwordsMatch) {
            res.status(211).write("Passwords did not match.")
        } else if (!usernameIsAvailable) {
            res.status(212).write("Username was not available. ")
        } else if (!emailIsUnique) {
            res.status(213).write("The email used for registration is already registered to an account. If this is you, please log in with your password.")
        }
    }


    // hashPassword(req.body.password).then(async (hash) => {
    //     // hash should be the hash that is returned by the hashPassword function after it hashes the password.
    //     // Instead, it is undefined. Why? 
    //     console.log("test")

    //     console.log(`Passwords match: ${passwordsMatch}`)
    //     console.log(`username is available: ${usernameIsAvailable}`)
    //     console.log(`email is unique: ${emailIsUnique}`)
    //     if (passwordsMatch || usernameIsAvailable || emailIsUnique) {
    //         console.log("All tests pass")

    //         // let newUser = await createAccount(req.body.username, req.body.name, req.body.email, hash);
    //         // console.log(newUser)
    //         console.log(`hashed password: ${hash}`) //undefined
    //         let newUser = await createAccount(req.body.username, req.body.name, req.body.email, hash)
    //     } else {
    //         console.log("All tests do not pass")
    //     }
    // }, (error) => {
    //     throw err;
    // })
    res.end()
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

async function emailUnique(email) {
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
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, 10);
    // bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
    //     if (err) throw err;
    //     // Store hash in your password DB.
    //     console.log(hash)

    //     return hash;
    // });

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