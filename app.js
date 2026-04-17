import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, update, onValue, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Твой конфиг
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

// Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- Функции для игры ---

// 1. Регистрация нового игрока
window.registerPlayer = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Создаем запись в базе данных (путь /users/uid)
        await set(ref(db, 'users/' + user.uid), {
            username: username,
            coins: 0,
            wins: 0,
            active_skin: "default",
            inventory: { skins: ["default"] }
        });
        
        console.log("Регистрация успешна!");
    } catch (error) {
        console.error("Ошибка регистрации:", error.message);
    }
};

// 2. Создание пати (лобби)
window.createLobby = async (mapId) => {
    const user = auth.currentUser;
    if (!user) return alert("Нужно войти в аккаунт!");

    const newLobbyRef = push(ref(db, 'lobbies')); // Генерируем уникальный ID комнаты
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
    
    return newLobbyRef.key; // Возвращаем ID комнаты для приглашения друзей
};

// 3. Следим за состоянием игрока (авто-логин)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Игрок в сети:", user.uid);
        // Тут можно скрыть меню входа и показать главное меню игры
    } else {
        console.log("Игрок не авторизован");
    }
});

// Привязываем функцию к window, чтобы HTML её видел
window.register = async () => {
    // Получаем значения из полей ввода (убедись, что в HTML у них такие id)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = "Player_" + Math.floor(Math.random() * 1000); // Или возьми из инпута

    if (!email || !password) return alert("Заполни все поля!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Создаем запись в базе данных
        await set(ref(db, 'users/' + user.uid), {
            username: username,
            coins: 100, // Дарим стартовые монеты
            wins: 0,
            active_skin: "default",
            inventory: { skins: ["default"] }
        });
        
        alert("Регистрация успешна!");
        // Здесь можно переключить экран на меню
        document.getElementById('authPanel').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');

    } catch (error) {
        console.error("Ошибка:", error.code);
        alert("Ошибка: " + error.message);
    }
};

// То же самое для входа (login)
window.login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Вход выполнен!");
        document.getElementById('authPanel').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');
    } catch (error) {
        alert("Ошибка входа: " + error.message);
    }
};
