let currentEmail = '';

async function sendCode() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (!email || !phone || !password) {
        alert('Заполните все поля');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentEmail = email;
            document.getElementById('regForm').style.display = 'none';
            document.getElementById('codeForm').style.display = 'flex';
            alert('Код отправлен на email');
        } else {
            alert(data.error || 'Ошибка');
        }
    } catch (error) {
        alert('Ошибка соединения с сервером');
    }
}

async function verifyCode() {
    const code = document.getElementById('code').value;

    try {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentEmail, code })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('codeForm').style.display = 'none';
            document.getElementById('rewardArea').style.display = 'block';
        } else {
            alert(data.error || 'Неверный код');
        }
    } catch (error) {
        alert('Ошибка соединения с сервером');
    }
}