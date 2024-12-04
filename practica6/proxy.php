<?php
// Configurar las cabeceras necesarias para evitar problemas de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Validar los datos recibidos por POST
$score = filter_input(INPUT_POST, 'score', FILTER_VALIDATE_INT);
$player = filter_input(INPUT_POST, 'player', FILTER_SANITIZE_STRING);
$game = filter_input(INPUT_POST, 'game', FILTER_SANITIZE_STRING);

// Verificar que los datos sean válidos
if ($score === false || !$player || !$game) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
    exit();
}

// Preparar los datos para enviarlos a la API externa
$data = http_build_query([
    'score' => $score,
    'player' => $player,
    'game' => $game
]);

// URL de la API a la que se enviarán los datos
$url = 'http://primosoft.com.mx/games/api/addscore.php';

// Configurar cURL para enviar la solicitud
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $data,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded',
    ],
]);

// Ejecutar la solicitud cURL
$response = curl_exec($ch);

// Manejar errores en cURL
if (curl_errno($ch)) {
    echo json_encode(['success' => false, 'message' => 'Error en cURL: ' . curl_error($ch)]);
    curl_close($ch);
    exit();
}

curl_close($ch);

// Decodificar y pasar la respuesta al cliente
$responseData = json_decode($response, true);

if (isset($responseData['success']) && $responseData['success'] === true) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $responseData['message'] ?? 'Error desconocido al guardar el score.']);
}
