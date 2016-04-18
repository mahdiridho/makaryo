angular.module('starter.services', [])
.factory('userService', function($http) {
    return {
        check: function (data){
            return $http.post(baseUrl+'userAPI.php',data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    };    
})
.factory('jobService', function($http) {
    return {
        createJob: function (data){
            return $http.post(baseUrl+'jobAPI.php',data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        listJob: function (data){
            return $http.post(baseUrl+'jobAPI.php',data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    };    
})