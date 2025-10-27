<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Чат Система</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .chat-layout {
            display: flex;
            height: 80vh;
            gap: 20px;
            margin-top: 20px;
        }
        
        .sidebar {
            width: 300px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        
        .chat-area {
            flex: 1;
            background: white;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .message-input {
            display: flex;
            gap: 10px;
        }
        
        .message-input input {
            flex: 1;
        }
        
        .user-info {
            background: #667eea;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        
        .room-list {
            list-style: none;
            padding: 0;
        }
        
        .room-list li {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
        }
        
        .room-list li:hover {
            background: #e9ecef;
        }
        
        .room-list li.active {
            background: #667eea;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="chat-container">
            <div class="chat-header">
                <h1>💬 Чат Система</h1>
                <div class="user-controls">
                    <span id="current-user">Пользователь</span>
                    <button id="logoutBtn" class="btn btn-secondary">Выйти</button>
                </div>
            </div>

            <div class="chat-layout">
                <!-- Боковая панель с комнатами -->
                <div class="sidebar">
                    <h3>Комнаты</h3>
                    <ul class="room-list" id="room-list">
                        <li class="active" data-room="general">📢 Общий чат</li>
                        <li data-room="random">🎲 Случайные темы</li>
                        <li data-room="help">❓ Помощь</li>
                    </ul>
                    
                    <div class="online-users">
                        <h3>Онлайн (3)</h3>
                        <ul id="users-list">
                            <li>👤 User1</li>
                            <li>👤 User2</li>
                            <li>👤 User3</li>
                        </ul>
                    </div>
                </div>

                <!-- Область чата -->
                <div class="chat-area">
                    <div class="current-room">
                        <h3 id="current-room-name">📢 Общий чат</h3>
                    </div>
                    
                    <div class="messages" id="messages">
                        <div class="message-system">
                            Добро пожаловать в чат! Выберите комнату слева.
                        </div>
                        <div class="message-item">
                            <strong>User1:</strong> Привет всем!
                        </div>
                        <div class="message-item">
                            <strong>User2:</strong> Как дела?
                        </div>
                    </div>
                    
                    <div class="message-input">
                        <input type="text" id="message-input" placeholder="Введите сообщение..." disabled>
                        <button id="send-btn" class="btn btn-primary" disabled>Отправить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Проверяем авторизацию
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            window.location.href = 'login.html';
        }

        const user = JSON.parse(userData);
        
        // Показываем имя пользователя
        document.getElementById('current-user').textContent = user.username;

        // Выход
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });

        // Логика выбора комнаты
        const roomItems = document.querySelectorAll('.room-list li');
        const currentRoomName = document.getElementById('current-room-name');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        const messagesContainer = document.getElementById('messages');

        roomItems.forEach(room => {
            room.addEventListener('click', () => {
                // Убираем активный класс у всех
                roomItems.forEach(r => r.classList.remove('active'));
                // Добавляем активный класс текущему
                room.classList.add('active');
                
                // Обновляем название комнаты
                const roomName = room.textContent;
                currentRoomName.textContent = roomName;
                
                // Активируем поле ввода
                messageInput.disabled = false;
                sendBtn.disabled = false;
                messageInput.placeholder = `Введите сообщение в ${roomName}...`;
                
                // Показываем системное сообщение
                messagesContainer.innerHTML = `
                    <div class="message-system">
                        Вы вошли в комнату: ${roomName}
                    </div>
                `;
            });
        });

        // Отправка сообщения
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                messageElement.innerHTML = `<strong>${user.username}:</strong> ${message}`;
                
                messagesContainer.appendChild(messageElement);
                messageInput.value = '';
                
                // Прокрутка вниз
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // TODO: Отправка на сервер
                console.log('Отправка сообщения:', message);
            }
        }

        // Активируем первую комнату по умолчанию
        roomItems[0].click();
    </script>
</body>
</html>
