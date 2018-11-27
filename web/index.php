<?php
error_reporting(E_ERROR | E_PARSE);

require __DIR__ . '/../vendor/autoload.php';

$app = new app\opening\Application();
$app->run();
