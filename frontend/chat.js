<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Чат Система</title>
    <link rel="stylesheet" href="стили.css">
</head>
<body>
    <div class="container">
        <div class="chat-container">
            <h1>💬 Чат Система</h1>
            <p>Добро пожаловать в чат! Этот интерфейс мы создадим следующим шагом.</p>
            <button id="logoutBtn" class="btn btn-secondary">Выйти</button>
        </div>
    </div>

    <script>
        // Проверяем авторизацию
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            window.location.href = 'вход.html';
        }

        // Выход
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'вход.html';
        });
    </script>
</body>
</html>
