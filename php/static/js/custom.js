function takeAverage(fullData) {
    
    var ax = 0, ay = 0, az = 0;
    var gx = 0, gy = 0, gz = 0;
    var ox = 0, oy = 0, oz = 0, ow = 0;
       
    for (var data in fullData) {
        
        data = fullData[data];
        var accelerometer = data.accelerometer;
        var gyroscope = data.gyroscope;
        var orientation = data.orientation;
        
        ax += accelerometer.x;
        ay += accelerometer.y;
        az += accelerometer.z;
        
        gx += gyroscope.x;
        gy += gyroscope.y;
        gz += gyroscope.z;
        
        ox += orientation.x;
        oy += orientation.y;
        oz += orientation.z;
        ow += orientation.w;
    }
    
    var numElem = fullData.length;
    
    var data = {
        
        accelerometer: {
            x: ax/numElem,
            y: ay/numElem,
            z: az/numElem
        },
        
        gyroscope: {
            x: gx/numElem,
            y: gy/numElem,
            z: gz/numElem
        },
        
        orientation: {
            x: ox/numElem,
            y: oy/numElem,
            z: oz/numElem,
            w: ow/numElem
        },
    };
    
    return data;
};

var myApp = angular.module('mainApp', ['ngRoute']);

myApp.controller('mainController', ['$scope', '$http', '$log', '$interval', function($scope, $http, $log, $interval) {
		
        $scope.action;
        $scope.actionSelected = false;
        $scope.didSelectAction = function() {return $scope.actionSelected};
        
        $scope.selectAction = function(action) {
            
            $scope.action = action;
            $scope.actionSelected = true;
        }
        
        $scope.activeLegend = 'x';
        
        $scope.isActive = function(legend) {
            
            if (legend === $scope.activeLegend) {
                
                return 'active';
            } else {
                
                return '';
            }
        }
        
        $scope.activateLegend = function(legend) {
            $scope.activeLegend = legend;
            $scope.renderGraph(legend);
        } 
        
        $scope.selectedAction = function(action) {
            
            if (action === $scope.action) {
                return true;
            } else {
                return false;
            }
        }
        
        $scope.pro;
        $scope.proSelected = false;
        $scope.didSelectPro = function() {return $scope.proSelected};
        
        $scope.selectPro = function(pro) {
            
            $scope.pro = pro;
            $scope.proSelected = true;
        }
        
        $scope.selectedPro = function(pro) {
            
            if (pro === $scope.pro) {
                return true;
            } else {
                return false;
            }
        }
        
        $scope.started = false;
        $scope.wasStarted = function() {if($scope.started) {return "red"} else {return ""}};
        
        $scope.user = {
            
            finished: false,
            isFinished: function() {return $scope.user.finished},
            text: 'Start',
            getText: function() {return $scope.user.text},            
            clicked: false,
            continued: false,
            wasContinued: function() {return $scope.user.continued},
            coor: {
                ax: 0, ay: 0, az: 0,
                gx: 0, gy: 0, gz: 0,
                ox: 0, oy: 0, oz: 0, ow: 0
            },
            data: null
        }
        
        Myo.connect('com.stolksdorf.myAwesomeApp');	   
    
        $scope.record = function(person) {
            
            if (!person.clicked) {
            
                $scope.start(person);
                person.text = 'Stop';
                person.clicked = true;
                person.finished = false; 
                $scope.started = true;
            } else {
                
                $scope.stop(person);
                person.text = 'Start';
                person.clicked = false;                
                person.finished = true;
                $scope.started = false;
            }
        }
    
        var halfSecond = []; //stores all the data that Myo returns every half a second
        var finalData = []; //stores the average of the data of halfSecond
        var promise;
    
		$scope.start = function(person) {
            
			Myo.on('imu', function(data) {
                
                var a = data.accelerometer;
                var g = data.gyroscope;
                var o = data.orientation;
                
                //$log.info(data);
                
                person.coor = {
                    ax: a.x, ay: a.y, az: a.z,
                    gx: g.x, gy: g.y, gz: g.z,
                    ox: o.x, oy: o.y, oz: o.z, ow: o.w
                };
                
				halfSecond.push(data);
			});
            
            promise = $interval($scope.save, 250);
		}
        
        $scope.save = function() {
            
            finalData.push(takeAverage(halfSecond));
            halfSecond = [];
        }
		
		$scope.stop = function(person) {

            $interval.cancel(promise);
            $scope.save();
            
            person.data = finalData;
            
            finalData = []; //empty finalData for next user to use     
			Myo.off('imu'); //myo stops returning data         
		}

        $scope.transformDataToGraphForm = function(data){
          var newData = {
              "model": {
                  "accelerometer": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "gyroscope": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "orientation": {
                      "x": [],
                      "y": [],
                      "z": [],
                      "w": []
                  }
              },
              "user": {
                  "accelerometer": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "gyroscope": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "orientation": {
                      "x": [],
                      "y": [],
                      "z": [],
                      "w": []
                  }
              },
              "differences": {
                  "accelerometer": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "gyroscope": {
                      "x": [],
                      "y": [],
                      "z": []
                  },

                  "orientation": {
                      "x": [],
                      "y": [],
                      "z": [],
                      "w": []
                  }
              }
          };

            for(var key in data){
                var datapoints = data[key];
                for(var i = 0; i < datapoints.length; i++){
                    var subject = datapoints[i];
                    for(var subjectData in subject){
                        var j = subject[subjectData];
                        for(var d in j){
                            newData[key][subjectData][d].push(j[d]);
                        }
                    }
                }
            }
            return newData;
        };

        $scope.renderGraph = function(axis) {
            var dataSource = $scope.aggregateXData;

            switch (axis) {
                case "x":
                    dataSource = $scope.aggregateXData;
                    break;
                case "y":
                    dataSource = $scope.aggregateYData;
                    break;
                case "z":
                    dataSource = $scope.aggregateZData;
                    break;
                case "w":
                    dataSource = $scope.aggregateWData;
                    break;
            }

            var fields = ["accelerometer", "gyroscope", "orientation"];
            var xModelUserDiffData = {
                "accelerometer": [],
                "gyroscope": [],
                "orientation": []
            };

            for (var i = 0; i < fields.length; i++) {
                if (dataSource[fields[i]].model.length > dataSource[fields[i]].user.length) {
                    dataSource[fields[i]].model = dataSource[fields[i]].model.slice(0, dataSource[fields[i]].user.length - 1);
                } else {
                    dataSource[fields[i]].user = dataSource[fields[i]].user.slice(0, dataSource[fields[i]].model.length - 1);
                }

                for (var j = 0; j < dataSource[fields[i]].user.length; j++) {
                    xModelUserDiffData[fields[i]].push({
                        "time": j,
                        "userVal": dataSource[fields[i]].user[j],
                        "modelVal": dataSource[fields[i]].model[j],
                        "diffVal": dataSource[fields[i]].differences[j]
                    });
                }

                $('.' + fields[i] + '-graph').empty();
                new Morris.Line({
                    element: $('.' + fields[i] + '-graph'),
                    data: xModelUserDiffData[fields[i]],
                    xkey: 'time',
                    ykeys: ['userVal', "modelVal", "diffVal"],
                    parseTime: false,
                    labels: ['You', "Model", "Difference"],
                    dateFormat: function () {
                        return "";
                    },
                    xLabelFormat: function (e) {
                        return (parseInt(e.x) / 1.5).toString() + "s";
                    },
                    grid: false,
                    hoverCallback: function (index, options, content, row) {
                        //return "Difference: " + xModelUserDiffData[fields[i]][index].diffVal;
                        return "";
                    }
                });
            }
        }

        $scope.finalize = function() {

            $http.post('/submissions/compare', {
                user: $scope.user.data,
                model: $scope.pro
            }).then(function (response) {
                $scope.coordinateData = $scope.transformDataToGraphForm(response.data);
                var modelData = $scope.coordinateData.model;
                var userData = $scope.coordinateData.user;
                var differencesData = $scope.coordinateData.differences;

                $scope.aggregateXData = {
                    "accelerometer": {
                        "model": modelData.accelerometer.x,
                        "user": userData.accelerometer.x,
                        "differences": differencesData.accelerometer.x
                    },

                    "gyroscope": {
                        "model": modelData.gyroscope.x,
                        "user": userData.gyroscope.x,
                        "differences": differencesData.gyroscope.x
                    },

                    "orientation": {
                        "model": modelData.orientation.x,
                        "user": userData.orientation.x,
                        "differences": differencesData.orientation.x
                    }
                };

                $scope.aggregateYData = {
                    "accelerometer": {
                        "model": modelData.accelerometer.y,
                        "user": userData.accelerometer.y,
                        "differences": differencesData.accelerometer.y
                    },

                    "gyroscope": {
                        "model": modelData.gyroscope.y,
                        "user": userData.gyroscope.y,
                        "differences": differencesData.gyroscope.y
                    },

                    "orientation": {
                        "model": modelData.orientation.y,
                        "user": userData.orientation.y,
                        "differences": differencesData.orientation.y
                    }
                };

                $scope.aggregateZData = {
                    "accelerometer": {
                        "model": modelData.accelerometer.z,
                        "user": userData.accelerometer.z,
                        "differences": differencesData.accelerometer.z
                    },

                    "gyroscope": {
                        "model": modelData.gyroscope.z,
                        "user": userData.gyroscope.z,
                        "differences": differencesData.gyroscope.z
                    },

                    "orientation": {
                        "model": modelData.orientation.z,
                        "user": userData.orientation.z,
                        "differences": differencesData.orientation.z
                    }
                };

                $scope.aggregateWData = {
                    "orientation": {
                        "model": modelData.orientation.w,
                        "user": userData.orientation.w,
                        "differences": differencesData.orientation.w
                    }
                };

                $scope.renderGraph("x");
            }, function (error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        }]);