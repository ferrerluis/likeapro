<?php namespace LikeAPro\Controllers;
use calebdre\ApiSugar\ApiController;
use Flight;
use LikeAPro\Models\Submission;

class SubmissionsController extends ApiController{
    public $mappings = [
        'crud' => ['model' => "LikeAPro\\Models\\Submission", "resource_name" => "submissions"],
        'compare' => ['method' => 'post', 'route' => '/submissions/compare'],
    ];

    public function compare(){
        $trainingArray = Flight::request()->data->user;
        $modelArray = Flight::request()->data->model;
        $differencesArray = [];

        $i = 0;
        foreach($trainingArray as $coordinates){
            if(! isset($modelArray[$i])) break;
            $differencesArray[] = [
                "accelerometer" => [
                    "x" => $modelArray[$i]["accelerometer"]["x"] - $coordinates["accelerometer"]["x"],
                    "y" => $modelArray[$i]["accelerometer"]["y"] - $coordinates["accelerometer"]["y"],
                    "z" => $modelArray[$i]["accelerometer"]["z"] - $coordinates["accelerometer"]["z"],
                ],
                "gyroscope" => [
                    "x" => $modelArray[$i]["gyroscope"]["x"] - $coordinates["gyroscope"]["x"],
                    "y" => $modelArray[$i]["gyroscope"]["y"]  - $coordinates["gyroscope"]["y"],
                    "z" => $modelArray[$i]["gyroscope"]["z"] - $coordinates["gyroscope"]["z"],
                ],
                "orientation" => [
                    "x" => $modelArray[$i]["orientation"]["x"]  - $coordinates["orientation"]["x"],
                    "y" => $modelArray[$i]["orientation"]["y"] - $coordinates["orientation"]["y"],
                    "z" => $modelArray[$i]["orientation"]["z"]  - $coordinates["orientation"]["z"],
                    "w" => $modelArray[$i]["orientation"]["w"] - $coordinates["orientation"]["w"],
                ]
            ];

            $i++;
        }

        Flight::json(["differences" => $differencesArray, "user" => $trainingArray, "model" => $modelArray]);
    }
}