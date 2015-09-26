var myApp = angular.module('mainApp', []);

myApp.controller('mainController', ['$scope', '$http', '$log', function($scope, $http, $log) {
		
		$scope.isClicked = false;
	
		$scope.clicked = function() {
			
			return $scope.isClicked
		}
	
		$scope.click = function() {
			
			Myo.connect('com.stolksdorf.myAwesomeApp');

			Myo.on('fist', function(){
				console.log('Hello Myo!');
				this.vibrate();
			});
			
			$scope.isClicked = true;
		}
}]);