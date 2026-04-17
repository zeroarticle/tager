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

// 1. Конфигурация твоего проекта
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

// 2. Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- СИСТЕМА АВТОРИЗАЦИИ (Исправленная) ---

window.register = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = "Player_" + Math.floor(Math.random() * 1000);

    if (!email || !password) return alert("Заполни все поля!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Создаем запись в БД
        await set(ref(db, 'users/' + user.uid), {
            username: username,
            coins: 100,
            wins: 0,
            active_skin: "#00ffff", // Начальный бирюзовый цвет
            inventory: ["#00ffff"]
        });
        
        alert("Регистрация успешна!");
    } catch (error) {
        alert("Ошибка: " + error.message);
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Вход выполнен!");
    } catch (error) {
        alert("Ошибка входа: " + error.message);
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authPanel').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');
        loadUserData(user.uid);
    } else {
        document.getElementById('authPanel').classList.remove('hidden');
        document.getElementById('mainMenu').classList.add('hidden');
    }
});

// --- ЛОГИКА МЕНЮ (То, что вылетало в консоль) ---

function loadUserData(uid) {
    onValue(ref(db, 'users/' + uid), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('coinsDisplay').innerText = data.coins || 0;
            document.getElementById('winsDisplay').innerText = data.wins || 0;
            document.getElementById('playerNameDisplay').innerText = "Привет, " + data.username;
        }
    });
}

window.findMatch = () => {
    alert("Поиск публичных игр (в разработке)...");
};

window.createParty = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const lobbyId = push(ref(db, 'lobbies')).key;
    await set(ref(db, 'lobbies/' + lobbyId), {
        status: "waiting",
        map_id: "map_" + (Math.floor(Math.random() * 5) + 1), // Случайная из 5 карт
        players: {
            [user.uid]: { x: 100, y: 100, color: "#00ffff" }
        }
    });
    alert("Лобби создано! ID: " + lobbyId);
};

window.openShop = () => {
    alert("Магазин: Скин 'Красный неон' - 500 монет. (Скоро)");
};

window.showLeaderboard = () => {
    alert("Топ игроков загружается...");
};
