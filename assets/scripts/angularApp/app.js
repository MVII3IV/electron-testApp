var app = angular.module("app", []);

app.controller("mainController", function ($scope) {

    Pace.options.ajax.trackWebSockets = false;
    $scope.virtualHost = require('electron').remote.getGlobal('sharedObj').name;
    $scope.server = {};
    $scope.server = {
        name: "localhost",
        port: 8080,
    };
    $scope.server.url = "ws://" + $scope.server.name + ":" + $scope.server.port + "/chat";
    $scope.version = "v.1.0";

    $scope.updateURL = function(){
        $scope.server.url = "ws://" + $scope.server.name + ":" + $scope.server.port + "/chat";
    }
    
    $scope.messages = [
        {   name: "Registration",       type: 1,    payload: [$scope.virtualHost, JSON.stringify({vmsVersion:"1.3.7.0",appInfo:"",processExecutionId:""})]  },
        {   name: "App Connected",      type: 9,    payload: [$scope.virtualHost, JSON.stringify({"appInfo":"C:\\apps\\QA\\Audi\\MockCrawler.exe v1.0.0.0","processExecutionId":""})]},
        {   name: "App Disconnected",   type: 8,    payload: [$scope.virtualHost, ""] },
        {   name: "VMS Connected",      type: 11,   payload: [$scope.virtualHost, JSON.stringify({"appInfo":"C:\\apps\\QA\\Audi\\MockCrawler.exe v1.0.0.0","processExecutionId":""})]},
        {   name: "VMS Disconnected",   type: 10,   payload: [$scope.virtualHost] }
    ];


    $scope.outputMessages = [];


    

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "width": "50px",
        "positionClass": "toast-bottom-left",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
      } 

//"{"date":1513708291,"type":1,"payload":["DZ-ALLDATA1758","{"vmsVersion":"1.3.7.0","appInfo":"","processExecutionId":""}"]}"

    //WEBSOCKET CLIENT
    $scope.socket = {};

    var onSocketError = function (error) {
        console.error('WebSocket Error', error);
    };

    function onSocketOpen() {
        console.log("Opened socket.");
    }

    function onSocketMessage(evt) {
        $scope.outputMessages.push(evt.data);
        $scope.$apply();
        $("#output").scrollTop($("#output").prop('scrollHeight'));
    };

    $scope.clearLog = function(){
        $scope.outputMessages = [];
        toastr.success("All messages have been removed", "Log cleaned");

    }

    $scope.sendMessage = function (type, payload) {
        var message = {
            type: type.type,
            payload: payload,
            date: new Date().getTime()
        };
        $scope.socket.send(JSON.stringify(message));
        toastr.success(type.name + " message was sent", "Message Sent")
    };

    $scope.open = function () {
        $scope.socket = new WebSocket($scope.server.url);
        $scope.socket.onerror = onSocketError;
        $scope.socket.onopen = onSocketOpen;
        $scope.socket.onmessage = onSocketMessage;
        $scope.socket.onclose = function () {
            //try to reconnect in 10 seconds
            setTimeout(function () {
                $scope.open();
            }, 10000);
        };
        toastr.success("Connection stablished successfully", "Connected");
    };

    $scope.close = function () {
        $scope.socket.onclose = undefined;
        $scope.socket.close();
        onopenCallbacks = [];
    };

});