//alert("appjs" + typeof angular);
var app = angular.module('poopApp', ['ionic']);
//alert('app = ' + typeof app);
app.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
    alert('welcome');
    
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/login.html'
        });
    $stateProvider.state('add', {
        url: '/addkid',
        templateUrl: 'templates/add-kid.html'
    });

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'templates/register.html'
    });

    alert('here');
    //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
});

app.factory('API', function () {
    var api_key = 'BS_API_KEY';
    return api_key;
});

app.factory('User', function (API) {
    var el = new Everlive({
        apiKey: API,
        scheme: 'https',
        token: localStorage.getItem('token')
    });

    return {
        register: function register(data) {
            return el.Users.register(
                data.username,
                data.password,
                {
                    Email: data.username
                }
            ).then(function (data) {
                return data;
            }, function (err) {
                return err;
            });
        },
        login: function (loginData) {
            return el.Users.login(
                    loginData.username,
                    loginData.password)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        me: function () {
            return el.Users.currentUser()
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        }
    }
});

app.controller('ChildrenController', function ($scope) {
    $scope.kids = [{
        name: 'Bananas'
    }, {
        name: 'Apples'
    }];
});

app.controller('AddKidController', function ($scope) {
    $scope.addKid = function () {
        alert('add kid was clicked.');
    };
});

app.controller('RegisterController', function ($scope, $state, User) {
    $scope.registerData = {
        username: null,
        password: null
    };
    
    $scope.loginData = {
        username: null,
        password: null
    };
    
    $scope.isLogin = true;
    
    $scope.register = function () {
        User.register($scope.registerData).then(function (data) {
            if (data.result) {
                //log me in
                $scope.loginData.username = $scope.registerData.username;
                $scope.loginData.password = $scope.registerData.password;
                $scope.login();
                //$scope.closeRegister();
                $state.go("kids");
            } else {
                $ionicPopup.alert({
                    title: status.data.message,
                    template: 'Please try again!'
                });
            }
        });

        $state.go('add');
    };
    
    $scope.login = function () {
        User.login($scope.data).then(
            function (data) {
                $state.go()
            },
            function (err) {

            });
    };
});