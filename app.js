<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Neon Chase</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #0a0a0a; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        #gameCanvas { display: none; width: 100vw; height: 100vh; }
        .ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .hidden { display: none !important; }
        .panel { background: rgba(20, 20, 20, 0.9); padding: 30px; border-radius: 10px; border: 1px solid #0ff; box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); }
        button { background: #0ff; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 5px; margin: 5px; transition: 0.2s; }
        button:hover { box-shadow: 0 0 15px #0ff; }
        input { padding: 10px; margin: 5px; background: #222; border: 1px solid #555; color: white; }
    </style>
</head>
<body>

    <div id="authPanel" class="ui-layer">
        <div class="panel">
            <h2>Регистрация / Вход</h2>
            <input type="email" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Пароль">
            <button onclick="login()">Войти</button>
            <button onclick="register()">Регистрация</button>
        </div>
    </div>

    <div id="mainMenu" class="ui-layer hidden">
        <div class="panel">
            <h2 id="playerNameDisplay">Привет, Игрок!</h2>
            <p>Монеты: <span id="coinsDisplay">0</span> | Победы: <span id="winsDisplay">0</span></p>
            <button onclick="findMatch()">Найти игру</button>
            <button onclick="createParty()">Создать Пати</button>
            <button onclick="openShop()">Магазин скинов</button>
            <button onclick="showLeaderboard()">Лидерборд</button>
        </div>
    </div>

    <canvas id="gameCanvas"></canvas>

    <script type="module" src="app.js"></script>
</body>
</html>