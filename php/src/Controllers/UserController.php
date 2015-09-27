<?php namespace LikeAPro\Controllers;
use calebdre\ApiSugar\ApiController;

class UserController extends ApiController{
    public $mappings = [
        'crud' => ['model' => "LikeAPro\\Models\\User", "resource_name" => "users"]
    ];
}