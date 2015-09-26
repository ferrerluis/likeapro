var myApp = angular.module('mainApp', []);

myApp.controller('mainController', ['$scope', '$http', '$log', function($scope, $http, $log) {
		
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