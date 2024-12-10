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

    // Typed.js on "Hall of Fame"
    new Typed('#leaderboardTitle', {
      strings: ["Hall of Fame", "Legends of the Grid", "Eternal Glory..."],
      typeSpeed:50,
      backSpeed:30,
      backDelay:2000,
      loop:true
    });

    // Lottie animation for frame
    lottie.loadAnimation({
      container:document.getElementById('frameLottie'),
      renderer:'svg',
      loop:true,
      autoplay:true,
      path:'animations/frame.json'
    });
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
