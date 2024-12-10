document.addEventListener('DOMContentLoaded', loadLeaderboard);

function loadLeaderboard(){
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
        document.getElementById('playerNameInput').value = storedName;
    }
    renderLeaderboard();
    document.getElementById('saveNameBtn').addEventListener('click', saveName);
    document.getElementById('refreshBtn').addEventListener('click', renderLeaderboard);
    document.getElementById('backBtn').addEventListener('click', () => window.location.href='index.html');
}

function saveName(){
    const name = document.getElementById('playerNameInput').value.trim() || 'Player';
    localStorage.setItem('playerName', name);
    renderLeaderboard();
}

function renderLeaderboard(){
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = '';
    leaderboard.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx+1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
        tbody.appendChild(tr);
    });
}
