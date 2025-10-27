class AuthApp {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Переключение между формами
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        // Отправка форм
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    showForm(formType) {
        // Скрываем все формы
        document.querySelectorAll('.form-container').forEach(form => {
            form.classList.remove('active');
        });

        // Показываем нужную форму
        document.getElementById(`${formType}-form`).classList.add('active');
        
        // Очищаем сообщения
        this.hideMessage();
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            this.setLoading(true);
            
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Вход выполнен успешно!', 'success');
                this.currentUser = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Через 1 секунду переходим в чат
                setTimeout(() => {
                    this.enterChat();
                }, 1000);
            } else {
                this.showMessage(data.error || 'Ошибка входа', 'error');
            }
        } catch (error) {
            this.showMessage('Ошибка соединения с сервером', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            this.setLoading(true);
            
            const response = await fetch(`${this.apiBase}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Регистрация успешна! Выполняется вход...', 'success');
                this.currentUser = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setTimeout(() => {
                    this.enterChat();
                }, 1500);
            } else {
                this.showMessage(data.error || 'Ошибка регистрации', 'error');
            }
        } catch (error) {
            this.showMessage('Ошибка соединения с сервером', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.currentUser = JSON.parse(user);
            this.enterChat();
        }
    }

    enterChat() {
        // Пока просто показываем сообщение
        this.showMessage(`Добро пожаловать в чат, ${this.currentUser.username}!`, 'success');
        
        // TODO: Здесь будет переход в интерфейс чата
        console.log('Переход в чат:', this.currentUser);
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
    }

    hideMessage() {
        document.getElementById('message').classList.add('hidden');
    }

    setLoading(loading) {
        const forms = document.querySelectorAll('form');
        const buttons = document.querySelectorAll('button[type="submit"]');
        
        if (loading) {
            forms.forEach(form => form.classList.add('loading'));
            buttons.forEach(button => {
                button.disabled = true;
                button.textContent = 'Загрузка...';
            });
        } else {
            forms.forEach(form => form.classList.remove('loading'));
            buttons.forEach(button => {
                button.disabled = false;
                button.textContent = button.closest('#loginForm') ? 'Войти' : 'Зарегистрироваться';
            });
        }
    }
}

// Запускаем приложение когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    new AuthApp();
});
