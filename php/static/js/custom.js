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

myApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'homeController'
            })
            
            .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            // route for the about page
            .when('/dashboard', {
                templateUrl : 'pages/dashboard.html',
                controller  : 'dashboardController'
            })
            
            .otherwise({
                redirectTo: 'pages/home.html'
            });
    });

myApp.controller('mainController', ['$scope', '$http', '$log', '$interval', function($scope, $http, $log, $interval) {
		
        $scope.pro;
        $scope.selected = false;
        $scope.didSelect = function() {return $scope.selected};
        
        $scope.selectPro = function(pro) {
            
            $scope.pro = pro;
            $scope.selected = true;
        }
        
        $scope.model = {
            
            finished: false,
            isFinished: function() {return $scope.model.finished},
            text: 'Start',
            getText: function() {return $scope.model.text},
            clicked: false,
            continued: false,
            wasContinued: function() {return $scope.model.continued},
            coor: {
                ax: 0, ay: 0, az: 0,
                gx: 0, gy: 0, gz: 0,
                ox: 0, oy: 0, oz: 0, ow: 0
            },
            data: null
        }
        
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
            } else {
                
                $scope.stop(person);
                person.text = 'Start';
                person.clicked = false;                
                person.finished = true;
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
                
                $log.info(data);
                
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
        
        $scope.finalize = function() {
            
            $http.post('/submissions/compare', {
                user: $scope.user.data,
                model: $scope.model.data
            })
            
            .then(function(response) {
                
                $log.info(response);
            }, function(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
}]);