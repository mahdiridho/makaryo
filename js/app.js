angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($compileProvider, $stateProvider, $ionicConfigProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(sms|tel|mailto|whatsapp):/);
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $stateProvider
  .state('home', {
	cache: false,
    url: '/home',
    templateUrl: 'templates/home.htm',
    controller: 'HomeCtrl'
  })
  .state('help', {
    url: '/help',
    templateUrl: 'templates/help.htm'
  })
  .state('userV', {
	cache: false,
    url: '/userV/:phone',
    templateUrl: 'templates/userV.htm',
    controller: 'UserVCtrl'
  })
  .state('userP', {
	cache: false,
    url: '/userP/:phone',
    templateUrl: 'templates/userP.htm',
    controller: 'UserPCtrl'
  })
  .state('userform', {
	cache: false,
    url: '/userform',
    templateUrl: 'templates/userform.htm',
    controller: 'UserFormCtrl'
  })
  .state('jobinput', {
	cache: false,
    url: '/jobinput',
    templateUrl: 'templates/jobInput.htm',
    controller: 'JobInputCtrl'
  })
  .state('jobinfo', {
	cache: false,
    url: '/jobinfo',
    templateUrl: 'templates/jobinfo.htm',
    controller: 'JobInfoCtrl'
  })
  .state('profile', {
	cache: false,
    url: '/profile',
    templateUrl: 'templates/profile.htm',
    controller: 'ProfileCtrl'
  })
  .state('trash', {
	cache: false,
    url: '/trash',
    templateUrl: 'templates/trash.htm',
    controller: 'TrashCtrl'
  })
});
var baseUrl = "http://makaryo.onfinger.net/";
var session;var cekphone;
function checkToken(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
function showModal($scope, $ionicModal, templateUrl, backButton) {
	$ionicModal.fromTemplateUrl(templateUrl, {
		scope: $scope,
		hardwareBackButtonClose: backButton
	}).then(function(modal) {
		$scope.Modal = modal;
		$scope.Modal.show();
	});
}
