function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

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

myApp.controller('dashboardController', ['$scope', '$http', '$log', function($scope, $http, $log) {
		
		$scope.disabled = "";
	
		$scope.start = function() {
			
			$scope.disabled = "disabled";

			Myo.connect('com.stolksdorf.myAwesomeApp');

			Myo.on('imu', function(data) {
				console.log(data);
			});
		}
		
		$scope.stop = function() {
			
			$scope.disabled = "disabled";

			Myo.connect('com.stolksdorf.myAwesomeApp');

			Myo.on('imu', function(data) {
				console.log(data);
			});
		}
}]);