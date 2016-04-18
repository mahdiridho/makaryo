angular.module('starter.controllers', [])
.controller('startCtrl', function($scope, $state, $ionicHistory) {
	if(localStorage.getItem('userPhone') != 'undefined' && localStorage.getItem('userPhone') != null && localStorage.getItem('userPhone') != '' && localStorage.getItem("tokenPhone") == checkToken(localStorage.getItem("userPhone"))){
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('jobinput');
	}else{
		$state.go('home');
	}
})
.controller('HomeCtrl', function($scope, $ionicHistory, $state) {
	$scope.goPage = function(page){
		$state.go(page);
	}
})
.controller('UserFormCtrl', function($scope, $state, $ionicHistory, $ionicLoading, $ionicPopup, userService) {
	$scope.user = {};
	$scope.auth = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			userService.check({
				'data1': $scope.user.phone
			}).success(function(usercheck){
				$ionicLoading.hide();
				if(usercheck == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(usercheck == "b")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan query database'});
				else if(usercheck == "c"){
					$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kami mengirim ulang nomer verifikasi, silahkan cek inbox SMS anda.'});
					$state.go('userV', {phone:$scope.user.phone});
				}
				else if(usercheck == "d"){
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('userP', {phone:$scope.user.phone});
				}
				else {
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('userV', {phone:$scope.user.phone});
				}
			});
		}
	}
})
.controller('UserVCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicPopup, userService) {
	$scope.user = {};
	$scope.verified = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			userService.check({
				'data1': 'verified',
				'data2': $stateParams.phone,
				'data3': $scope.user.vcode
			}).success(function(usercheck){
				$ionicLoading.hide();
				if(usercheck == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(usercheck == "b"){
					$ionicPopup.alert({
					title: 'Informasi',
					template: 'Selamat, nomer anda sudah terverifikasi. PIN anda: '+$scope.user.vcode+' dan demi keamanan segera lakukan perubahan pada menu setting!'})
					.then(function(popover){
						session = new Date().getTime();
						localStorage.setItem('userPhone',$stateParams.phone + ' ' +session);
						localStorage.setItem("tokenPhone", checkToken(localStorage.getItem("userPhone")));
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('jobinput');
					});
				}else{
					$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kode yang anda masukkan tidak sesuai'});
				}
			});
		}
	}
})
.controller('UserPCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicPopup, userService) {
	$scope.user = {};
	$scope.login = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			userService.check({
				'data1': 'login',
				'data2': $stateParams.phone,
				'data3': $scope.user.pcode
			}).success(function(usercheck){
				$ionicLoading.hide();
				if(usercheck == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(usercheck == "b"){
					session = new Date().getTime();
					localStorage.setItem('userPhone',$stateParams.phone + ' ' +session);
					localStorage.setItem("tokenPhone", checkToken(localStorage.getItem("userPhone")));
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('jobinput');
				}else{
					$ionicPopup.alert({
					title: 'Informasi',
					template: 'PIN salah'});
				}
			});
		}
	}
})
.controller('JobInputCtrl', function($scope, $state, $timeout, $ionicHistory, $cordovaGeolocation, $ionicLoading, $ionicPopup, jobService) {
	if(localStorage.getItem('userPhone') == 'undefined' || localStorage.getItem('userPhone') == null || localStorage.getItem('userPhone') == '' || localStorage.getItem("tokenPhone") != checkToken(localStorage.getItem("userPhone"))){
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('trash');
	}
	var lat;
	var long;
	$ionicLoading.show({
		template: '<img src="img/loading.gif" width="150">'
	});
	var posOptions = {timeout: 20000, enableHighAccuracy: true, maximumAge: 10000 };
	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
		if(localStorage.getItem("infoMap") == null){
			$ionicPopup.alert({title: 'Informasi',template: 'Geser marker merah pada peta untuk menentukan lokasi kerjaan'});
			localStorage.setItem("infoMap", "set");
		}
		lat  = position.coords.latitude;
		long = position.coords.longitude;
		var myLatlng = new google.maps.LatLng(lat, long);
		var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};          
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
		$scope.map = map;
		google.maps.event.addListenerOnce($scope.map, 'idle', function(){
			var marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: myLatlng,
				draggable:true
			});
			google.maps.event.addListener(marker, 'click', function () {
				$ionicLoading.show({
				  template: 'Latitude: '+lat+'<br>Longitude: '+long
				});
				$timeout(function() {
					$ionicLoading.hide();
				}, 1000);
			});
			google.maps.event.addListener(marker, 'dragend', function(evt){
				lat  = evt.latLng.lat();
				long = evt.latLng.lng();
				$ionicLoading.show({
				  template: 'Latitude: '+lat+'<br>Longitude: '+long
				});
				$timeout(function() {
					$ionicLoading.hide();
				}, 1000);
			});		 
		});
		$ionicLoading.hide();           
		 
	}, function(err) {
		$ionicLoading.hide();
		console.log(err);
	});
	$scope.job = {};
	$scope.saveJob = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			jobService.createJob({
				'data1': localStorage.getItem('userPhone').split(" ").shift(),
				'data2': lat+' '+long,
				'data3': $scope.job.location,
				'data4': $scope.job.title,
				'data5': $scope.job.whatsapp
			}).success(function(jobresult){
				$ionicLoading.hide();
				if(jobresult == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(jobresult == "b")$ionicPopup.alert({
					title: 'Informasi',
					template: 'User anda tidak valid'});
				else if(jobresult == "c")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan database query'});
				else{
					$scope.job = {};
					$ionicPopup.alert({
					title: 'Informasi',
					template: 'Data kerjaan berhasil disimpan'});
					$state.go('profile');
				}
			});
		}
	}
	$scope.logout = function(){
		localStorage.removeItem('userPhone');
		localStorage.removeItem('tokenPhone');
		localStorage.removeItem('userName');
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('trash');
	}
})
.controller('TrashCtrl', function($state, $ionicHistory) {
	$ionicHistory.nextViewOptions({
		disableBack: true
	});
	$state.go('home');
})
.controller('ProfileCtrl', function($scope, $state, $ionicHistory, $ionicModal, $ionicLoading, $ionicPopup, userService) {
	$ionicLoading.show({
	  template: '<img src="img/loading.gif" width="150">'
	});
	if(localStorage.getItem('userName') == '' || localStorage.getItem('userName') == 'undefined' || localStorage.getItem('userName') == null){
		userService.check({'data1': 'get','data2': localStorage.getItem('userPhone').split(" ").shift()}).success(function(result){
			$ionicLoading.hide();
			if(result.name == 'n')
				$scope.name='Nama belum diupdate';
			else
				$scope.name = result.name;
			$scope.phone = localStorage.getItem('userPhone').split(" ").shift();
			localStorage.setItem('userName', $scope.name);
		});
	}else{
		$ionicLoading.hide();
		$scope.name=localStorage.getItem('userName');
		$scope.phone = localStorage.getItem('userPhone').split(" ").shift();
	}
	$scope.jobs = {};
	$scope.jobList = function(){
		$ionicLoading.show({
		  template: '<img src="img/loading.gif" width="150">'
		});
		userService.check({'data1': 'job','data2': localStorage.getItem('userPhone').split(" ").shift()}).success(function(result){
			$ionicLoading.hide();
			$scope.jobs = result;
		});
	}
	$scope.user = {};
	$scope.editName = function(){
		$scope.user.name = $scope.name;
		showModal($scope, $ionicModal, 'editname.html', true);
	}
	$scope.changePw = function(){
		showModal($scope, $ionicModal, 'editpassword.html', true);
	}
	$scope.goback = function(){
		$ionicHistory.goBack();
	}
	$scope.closeModal = function(){
		$scope.Modal.hide();
		$scope.Modal.remove();
	}
	$scope.updateName = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			userService.check({
				'data1': 'name',
				'data2': $scope.user.name,
				'data3': localStorage.getItem('userPhone').split(" ").shift()
			}).success(function(result){
				$ionicLoading.hide();
				if(result == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(result == "b")$ionicPopup.alert({
					title: 'Informasi',
					template: 'User anda tidak valid'});
				else if(result == "c")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan database query'});
				else{
					$scope.name = $scope.user.name;
					localStorage.setItem('userName', $scope.name);
					$scope.Modal.hide();
					$scope.Modal.remove();
				}
			});
		}
	}
	$scope.updatePIN = function(statusForm){
		if(!statusForm){
  			$ionicLoading.show({
			  template: '<img src="img/loading.gif" width="150">'
			});
			userService.check({
				'data1': 'pin',
				'data2': $scope.user.pin,
				'data3': localStorage.getItem('userPhone').split(" ").shift()
			}).success(function(result){
				$ionicLoading.hide();
 				if(result == "a")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan koneksi database'});
				else if(result == "b")$ionicPopup.alert({
					title: 'Informasi',
					template: 'User anda tidak valid'});
				else if(result == "c")$ionicPopup.alert({
					title: 'Informasi',
					template: 'Kesalahan database query'});
				else{
					$scope.Modal.hide();
					$scope.Modal.remove();
				}
			});
		}
	}
})
.controller('JobInfoCtrl', function($scope, $state, $ionicHistory, $ionicModal, $ionicLoading, $timeout, $cordovaGeolocation, $cordovaClipboard, jobService) {
	$scope.doRefresh = function(){
		$scope.loadingList = {'display':'block'};
		jobService.listJob({'data1':'list'}).success(function(result){
			$scope.jobs = result;console.log(result);
			$scope.loadingList = {'display':'none'};
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
	}
	$scope.doRefresh();
	$scope.goback = function(){
		$ionicHistory.goBack();
	}
 	var lat;
	var long;
	var posOptions = {timeout: 20000, enableHighAccuracy: true, maximumAge: 10000 };
	$scope.showLocation = function(mapPos){
		showModal($scope, $ionicModal, 'mapModal.html', true);
		$scope.loading = {display:'block'};
		$cordovaGeolocation.getCurrentPosition(posOptions).then(function () {
			lat  = mapPos.split(" ").shift();
			long = mapPos.split(" ").pop();
			var myLatlng = new google.maps.LatLng(lat, long);
			var mapOptions = {
				center: myLatlng,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};          
			var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
			$scope.map = map;
			google.maps.event.addListenerOnce($scope.map, 'idle', function(){
				var marker = new google.maps.Marker({
					map: $scope.map,
					animation: google.maps.Animation.DROP,
					position: myLatlng
				});
			});
			$scope.loading = {display:'none'};
		}, function(err) {
			$scope.loading = {display:'none'};
			console.log(err);
		});
	}
	$scope.copywa = function(index){
		$cordovaClipboard.copy($scope.jobs[index].whatsapp).then(function () {
  			$ionicLoading.show({
			  template: 'Copy to clipboard'
			});
			$timeout(function() {
				$ionicLoading.hide();
			}, 1000);
		});
	}
	$scope.closeModal = function(){
		$scope.Modal.hide();
		$scope.Modal.remove();
	}
});