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

myApp.controller('mainController', ['$scope', '$http', '$log', function($scope, $http, $log) {
		
		
}]);

myApp.controller('dashboardController', ['$scope', '$http', '$log', '$interval', function($scope, $http, $log, $interval) {
		
        $scope.buttonStatus = 'Start';
		$scope.isRecording = false;
        Myo.connect('com.stolksdorf.myAwesomeApp');	   
    
        $scope.record = function() {
            
            if (!$scope.isRecording) {
            
                $scope.start();
                $scope.isRecording = true;
                $scope.buttonStatus = 'Stop';                
            } else {
                
                $scope.stop();
                $scope.isRecording = false;
                $scope.buttonStatus = 'Start';                                
            }
        }
    
        var halfSecond = [];
        var finalData = [];
        var promise;     
    
		$scope.start = function() {
                        
			Myo.on('imu', function(data) {
                
				halfSecond.push(data);
			});
            
            promise = $interval($scope.save, 500);
		}
        
        $scope.save = function() {
            
            finalData.push(takeAverage(halfSecond));
            halfSecond = [];        
        }
		
		$scope.stop = function() {

            $interval.cancel(promise);
            $scope.save();
			Myo.off('imu');
            $http.post('localhost:5000/compare', finalData);            
		}
}]);