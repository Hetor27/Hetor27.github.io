fetch("http://primosoft.com.mx/games/api/getgames.php")
    .then(res => res.json())
    .then(games => {
        const gameList = document.querySelector("ul");
        gameList.innerHTML = ""; // Limpiar contenido inicial
        games.forEach(game => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = `ver-scores.php?game=${encodeURIComponent(game)}`;
            link.textContent = game;
            listItem.appendChild(link);
            gameList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching games:", error));
fetch('proxy.php')
    .then(response => response.json())
    .then(data => {
        console.log('Datos recibidos:', data);
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
    });

fetch('http://primosoft.com.mx/games/api/addscore.php', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.text()) // Cambiado a text para ver respuestas no válidas
    .then(data => {
        console.log('Respuesta de la API:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    