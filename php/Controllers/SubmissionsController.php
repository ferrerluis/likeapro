<?php namespace LikeAPro\Controllers;
use calebdre\ApiSugar\ApiController;
use Flight;
use LikeAPro\Models\Submission;

class SubmissionsController extends ApiController{
    public $mappings = [
        'crud' => ['model' => "LikeAPro\\Models\\Submission", "resource_name" => "submissions"],
        'compare' => ['method' => 'post', 'route' => '/submissions/compare/@first_id/@second_id'],
    ];

    public function compare($first_id, $second_id){
        $trainingRun = Submission::findOrNew($first_id)->coordinates;
        $model = Submission::findOrNew($second_id)->coordinates;

        $trainingArray = json_decode($trainingRun);
        $modelArray = json_decode($model);
        $differencesArray = [];

        $i = 0;
        foreach($trainingArray as $coordinates){
            $differencesArray[] = [
                "accelerometer" => [
                    "x" =>  [$i]->accelerometer->x - $trainingArray->accelerometer->x,
                    "y" => $modelArray[$i]->accelerometer->y - $trainingArray->accelerometer->y,
                    "z" => $modelArray[$i]->accelerometer->z - $trainingArray->accelerometer->z,
                ],
                "gyroscope" => [
                    "x" => $modelArray[$i]->gyroscope->x - $trainingArray->gyroscope->x,
                    "y" => $modelArray[$i]->gyroscope->y - $trainingArray->gyroscope->y,
                    "z" => $modelArray[$i]->gyroscope->z - $trainingArray->gyroscope->z,
                ],
                "orientation" => [
                    "x" => $modelArray[$i]->orientation->x - $trainingArray->orientation->x,
                    "y" => $modelArray[$i]->orientation->y - $trainingArray->orientation->y,
                    "z" => $modelArray[$i]->orientation->z - $trainingArray->orientation->z,
                    "w" => $modelArray[$i]->orientation->w - $trainingArray->orientation->w,
                ]
            ];

            $i++;
        }

        Flight::json(["differences" => $differencesArray, "training" => $trainingArray, "model" => $modelArray]);
    }
}