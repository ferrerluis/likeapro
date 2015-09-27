<?php namespace LikeAPro\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model{
    protected $table = "submissions";
    public $timestamps = false;
    protected $fillable = [
        "coordinates",
        "name",
        "category",
        "model"
    ];
}