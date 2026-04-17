// 1. Объединенные импорты (убрали дубликаты)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    update, 
    onValue, 
    push 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyCJjzDSr6xTgpvcNDqUxRfdrAkrNqwg7yE",
    authDomain: "zsuero1-bot.firebaseapp.com",
    databaseURL: "https://zsuero1-bot-default-rtdb.firebaseio.com",
    projectId: "zsuero1-bot",
    storageBucket: "zsuero1-bot.firebasestorage.app",
    messagingSenderId: "140804077477",
    appId: "1:140804077477:web:d2d111aebb602ce7d05a4c",
    measurementId: "G-M0LK7KBB70"
};

// 3. Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- Логика Аутентификации ---

// Функция регистрации (привязана к window для HTML)
window.register = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Генерируем случайный ник, если нет поля ввода для него
    const username = "Player_" + Math.floor(Math.random() * 1000);

    if (!email || !password) return alert("Заполни все поля!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Создаем профиль игрока в Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            username: username,
            coins: 100,
            wins: 0,
            active_skin: "default",
            inventory: { skins: ["default"] }
        });
        
        alert("Регистрация прошла успешно!");
        showMainMenu();
    } catch (error) {
        console.error("Ошибка регистрации:", error.message);
        alert("Ошибка: " + error.message);
    }
};

// Функция входа
window.login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert("Введите данные для входа!");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Вы вошли в игру!");
        showMainMenu();
    } catch (error) {
        console.error("Ошибка входа:", error.message);
        alert("Неверный логин или пароль");
    }
};

// Слушатель состояния (автоматический вход)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Игрок авторизован:", user.uid);
        showMainMenu();
    } else {
        console.log("Нужна авторизация");
        showAuthPanel();
    }
});

// --- Вспомогательные функции интерфейса ---

function showMainMenu() {
    document.getElementById('authPanel').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function showAuthPanel() {
    document.getElementById('authPanel').classList.remove('hidden');
    document.getElementById('mainMenu').classList.add('hidden');
}

// --- Игровая логика ---

window.createLobby = async (mapId) => {
    const user = auth.currentUser;
    if (!user) return alert("Сначала войдите в аккаунт!");

    const newLobbyRef = push(ref(db, 'lobbies'));
    await set(newLobbyRef, {
        status: "waiting",
        map_id: mapId,
        creator: user.uid,
        players: {
            [user.uid]: {
                x: 400,
                y: 300,
                is_invisible: false
            }
        }
    });
    console.log("Лобби создано:", newLobbyRef.key);
    return newLobbyRef.key;
};
