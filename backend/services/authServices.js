const { prisma } = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async ({ name, email, password }) => {
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
    })
    if (existingUser) {
         throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Email ko lowercase mein hi save karein
    const newUser = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail, 
            password: hashedPassword,
        }
    })

    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    // Password ko return karne se pehle remove karein
    delete newUser.password;
    return { newUser, token }
}

const login = async ({ email, password }) => {
    if (!email) {
        throw new Error("Email parameter is missing.");
    }

    const existingUser = await prisma.user.findUnique({
         where: { email: email.toLowerCase() } 
    })
    if (!existingUser) {
        throw new Error("User with this email does not exist.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid credentials payload verification failed.");
    }

    const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email, name: existingUser.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Password ko return karne se pehle remove karein
    delete existingUser.password;
    return { existingUser, token };
}

const verifyUser = async ({ userId }) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!user) {
        throw new Error('User not found.');
    }

    return { user };
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })
}   

module.exports = {
    signup, login, verifyUser, getAllUsers
}
