<?php namespace LikeAPro\Controllers;
use calebdre\ApiSugar\ApiController;

class SubmissionsController extends ApiController{
    public $mappings = [
        'crud' => ['model' => "LikeAPro\\Models\\Submission", "resource_name" => "submissions"]
    ];
}