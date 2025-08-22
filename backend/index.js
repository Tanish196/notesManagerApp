require('dotenv').config(); // ← load env

const mongoose = require("mongoose");

// const mongoUri = process.env.MONGO_URI;
// Use mongoUri to connect with mongoose or MongoClient

// const config = require("./config.json")
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

// const mongoose = require("mongoose")
// mongoose.connect(config.connectionString)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const User = require('./models/user.model')
const Note = require('./models/note.model')

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken')
const { authenticateToken } = require('./utilities')

app.use(express.json())

// cors enables Cross-Origin Resource Sharing so the backend can talk to the frontend even if hosted on different domains/ports.
app.use(cors({
    origin: "https://notes-manager-app.vercel.app", // your Vercel frontend
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({ data: "hello" })
})

// Create Account
app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name required" })
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email required" })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password required" })
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: "User already exits" })
    }

    const user = new User({
        fullName,
        email,
        password
    })

    await user.save()

    const accessToken = jwt.sign({ user: { _id: user._id, email: user.email, fullName: user.fullName } }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3000m'
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "registration successful"
    })
    // Recommended ChatGPT version

    // const bcrypt = require('bcryptjs');

    // app.post('/create-account', async (req, res) => {
    //   const { fullName, email, password } = req.body;

    //   if (!fullName || !email || !password) {
    //     return res.status(400).json({ error: true, message: "All fields required" });
    //   }

    //   const isUser = await User.findOne({ email });
    //   if (isUser) {
    //     return res.json({ error: true, message: "User already exists" });
    //   }

    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   const user = new User({ fullName, email, password: hashedPassword });
    //   await user.save();

    //   const tokenPayload = {
    //     user: { _id: user._id, email: user.email, fullName: user.fullName }
    //   };

    //   const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    //   return res.json({
    //     error: false,
    //     user: tokenPayload.user,
    //     accessToken,
    //     message: "Registration successful"
    //   });
    // });
})

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ error: true, message: "Email not found" })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password not found" })
    }

    const userInfo = await User.findOne({ email: email })

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User not found" })
    }

    if (userInfo.email == email && userInfo.password == password) {
        // why wrapping of user??
        // If you want to namespace or organize your payload better (e.g., { user: ..., role: ... }).
        // To avoid potential naming collisions in the JWT payload with fields like iat, exp, etc.
        // If your frontend expects the data inside a user object after decoding.
        const user = { user: userInfo }

        // const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"3600m"});
        //  the above line can also be used if you don't want to wrap the userInfo   // It is actually the best practice available    
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600m" });

        return res.json({ error: false, message: "Logged in Sucessfully", email, accessToken })
    }
    else {
        return res.json({ error: true, message: "Invalid credentials" });
    }
})

// get User
app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user

    const isUser = await User.findOne({ _id: user._id })

    if (!isUser) {
        return res.status(401).json({ error: true, message: "User not found" })
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        }
    })
})

// Add Note
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body
    const { user } = req.user

    if (!title) {
        return res.status(400).json({ error: true, message: "Title required" })
    }

    try {
        const note = new Note({
            title, content, tags: tags || [], userId: user._id
        })

        await note.save()

        return res.json({
            error: false,
            note,
            message: "Note added sucessfully"
        });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

// Edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId
    const { user } = req.user
    const { title, isPinned, content, tags } = req.body

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" })
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' })
        }

        if (title) note.title = title
        if (content) note.content = content
        if (tags) note.tags = tags
        if (isPinned) note.isPinned = isPinned

        await note.save()

        return res.json({ error: false, message: "Note Edited", note });
    } catch {
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
})

// Note pinned
app.put('/note-pinned/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId
    const { user } = req.user
    const { isPinned } = req.body

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' })
        }

        note.isPinned = isPinned

        await note.save()

        return res.json({ error: false, message: "Note Edited", note });
    } catch {
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
})

// Get All Notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
    const { user } = req.user
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({ error: false, notes, message: "All notes retrieved" })
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

// Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const { user } = req.user
    const noteId = req.params.noteId
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        await Note.deleteOne({ _id: noteId, userId: user._id })
        return res.json({ error: false, message: "Note Deleted" })
    }
    catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

// Search Note
app.get('/search-note/', authenticateToken, async (req, res) => {
    const { user } = req.user
    const { query } = req.query

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required" })
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            // Matches if either the title or content contains the query string.
            $or: [
                // Uses regex: Performs a case-insensitive partial match (because of "i" in RegExp).
                { title: { $regex: new RegExp(query, "i") } },
                // Consider using text indexes and $ text instead of $ regex if performance becomes an issue and to use relevance score as a feature
                { content: { $regex: new RegExp(query, "i") } }
            ]
        })
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retreived successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app