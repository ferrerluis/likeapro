<?php
include "vendor/autoload.php";

use calebdre\ApiSugar\Api;
use LikeAPro\Controllers\SubmissionsController;
use LikeAPro\Controllers\UserController;

$api = new Api();
$api->configureDB([
   'driver' => "mysql",
    "host" => "localhost",
    "database" =>"likeapro",
    "username" => "root",
    "password" => "",
    "charset" => "utf8",
    "collation" => "utf8_unicode_ci",
    "prefix" => ""
]);

$api->addClass(new SubmissionsController());
$api->addClass(new UserController());

$api->execute();