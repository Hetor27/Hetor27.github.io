<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Práctica 06: APIs</title>
</head>
<body>
    <h1>Práctica 06: APIs</h1>
    <h2>Games:</h2>
    <ul>
        <?php foreach ($games as $game): ?>
            <li>
                <a href="ver-scores.php?game=<?=urlencode($game)?>">
                    <?=$game?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
    <script src="js/index.js"></script>
    <a href="index.html">VOLVER AL JUEGO</a> 
</body>
</html>
