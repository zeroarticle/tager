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
