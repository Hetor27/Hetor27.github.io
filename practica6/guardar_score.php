<?php
// Validar los datos recibidos por POST
$score = filter_input(INPUT_POST, 'score', FILTER_VALIDATE_INT);
$player = filter_input(INPUT_POST, 'player', FILTER_SANITIZE_STRING);
$game = filter_input(INPUT_POST, 'game', FILTER_SANITIZE_STRING);

if (!$score || !$player || !$game) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
    exit();
}

// Configurar cURL para enviar la solicitud a la API
$url = 'http://primosoft.com.mx/games/api/addscore.php';
$data = http_build_query([
    'score' => $score,
    'player' => $player,
    'game' => $game
]);

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $data,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded'
    ],
]);

$response = curl_exec($curl);

if (curl_errno($curl)) {
    echo json_encode(['success' => false, 'message' => 'Error en cURL: ' . curl_error($curl)]);
    curl_close($curl);
    exit();
}

curl_close($curl);

// Decodificar la respuesta de la API y devolverla al cliente
$responseData = json_decode($response, true);

if (isset($responseData['success']) && $responseData['success'] === true) {
    echo json_encode(['success' => true]);
} else {
   // echo json_encode(['success' => false, 'message' => $responseData['_error'] ?? 'Error desconocido.']);
}
?>
