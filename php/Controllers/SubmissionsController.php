<?php namespace LikeAPro\Controllers;
use calebdre\ApiSugar\ApiController;
use Flight;
use LikeAPro\Models\Submission;

class SubmissionsController extends ApiController{
    public $mappings = [
//        'crud' => ['model' => "LikeAPro\\Models\\Submission", "resource_name" => "submissions"],
        'compare' => ['method' => 'post', 'route' => '/submissions/compare'],
        'create' => ['method' => "post", 'route' => '/submissions']
    ];

    public function create(){
        $coords = Flight::request()->data->coordinates;
        $name = Flight::request()->data->name;

        $sub = new Submission();
        $sub->name = $name;
        $sub->coordinates = $coords;
        $sub->save();

        Flight::json(['success' => "yay!"]);
    }

    public function compare(){
        $trainingArray = Flight::request()->data->user;
        if(Flight::request()->data->friendSelected == true){
            $modelArray = Flight::request()->data->model;
        }else {
            $modelArray = json_decode(Submission::where("name", "=", Flight::request()->data->model)->first()->coordinates, true);
        }

        $differencesArray = [];

        $i = 0;
        foreach($trainingArray as $coordinates){
            if(! isset($modelArray[$i])) break;
            $differencesArray[] = [
                "accelerometer" => [
                    "x" => ($modelArray[$i]["accelerometer"]["x"] - $coordinates["accelerometer"]["x"]) * 100,
                    "y" => ($modelArray[$i]["accelerometer"]["y"] - $coordinates["accelerometer"]["y"]) * 100,
                    "z" => ($modelArray[$i]["accelerometer"]["z"] - $coordinates["accelerometer"]["z"]) * 100,
                ],
                "gyroscope" => [
                    "x" => ($modelArray[$i]["gyroscope"]["x"] - $coordinates["gyroscope"]["x"]) * 10,
                    "y" => ($modelArray[$i]["gyroscope"]["y"]  - $coordinates["gyroscope"]["y"]) * 10,
                    "z" => ($modelArray[$i]["gyroscope"]["z"] - $coordinates["gyroscope"]["z"]) * 10,
                ],
                "orientation" => [
                    "x" => ($modelArray[$i]["orientation"]["x"]  - $coordinates["orientation"]["x"])  * 10,
                    "y" => ($modelArray[$i]["orientation"]["y"] - $coordinates["orientation"]["y"]) * 10,
                    "z" => ($modelArray[$i]["orientation"]["z"]  - $coordinates["orientation"]["z"])* 10,
                    "w" => ($modelArray[$i]["orientation"]["w"] - $coordinates["orientation"]["w"]) * 10,
                ]
            ];

            $i++;
        }

        Flight::json(["differences" => $differencesArray, "user" => $trainingArray, "model" => $modelArray]);
    }
}