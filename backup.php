<?php

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);
$json = json_encode($data);

// Configurar las cabeceras HTTP para indicar que la respuesta es JSON
header('Content-Type: application/json');


$file_name = 'backup/data_' . date("d-m-Y_H-i-s", time()) . '.json';
file_put_contents($file_name, $json);

?>