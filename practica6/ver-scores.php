<?php

// Obtener el parámetro `game` de la URL
$game = filter_input(INPUT_GET, "game");
if (!$game) {
    echo "Es necesario el parámetro URL 'game'.";
    exit();
}

$gameEncoded = urlencode($game);
$orderAsc = 1; // Orden por defecto ascendente
$urlGetScores = "http://primosoft.com.mx/games/api/getscores.php?game=$gameEncoded&orderAsc=$orderAsc";

// Llamada a la API usando cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $urlGetScores,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
]);

$responseContent = curl_exec($ch);
curl_close($ch);

// Convertir el string JSON a un array asociativo
$scores = json_decode($responseContent, true);

if (!$scores || !is_array($scores)) {
    echo "No se pudieron obtener los puntajes.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scores for <?=htmlspecialchars($game)?></title>
</head>
<body>
    <h1>Scores for <?=htmlspecialchars($game)?></h1>
    <ul>
        <?php foreach ($scores as $score): ?>
            <li>Player: <?=htmlspecialchars($score['player'])?> - Score: <?=htmlspecialchars($score['score'])?></li>
        <?php endforeach; ?>
    </ul>
    <a href="index.php">Volver a la lista de juegos</a>
</body>
</html>
