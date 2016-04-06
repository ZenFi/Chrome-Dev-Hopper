angular.module('app', ['ngAnimate'])

.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.text());
        });
      });

      // model -> view
      ctrl.$render = function() {
        elm.html(ctrl.$viewValue);
      };
    }
  };
})

.run(function($rootScope, $timeout) {

  chrome.storage.sync.get('projects', function(data){
    $rootScope.projects = data.projects || $rootScope.projects;

    $rootScope.$apply();
  });

  $rootScope.projects = [];

  $rootScope.newProject = function() {
    $rootScope.projects.unshift({
      environments: [{}]
    });
  };

  $rootScope.save = function() {
    chrome.storage.sync.set({ projects: angular.copy($rootScope.projects) });
    $rootScope.saved = true;
    $timeout(function(){
      $rootScope.saved = false;
    }, 2000);
  };
  
  $rootScope.inspect = function() {
    if ($rootScope.showCode) {
      try { $rootScope.projects = JSON.parse($rootScope.code); }
      catch (err) { }
    } else {
      $rootScope.code = JSON.stringify(angular.copy($rootScope.projects), null, 2);
    }
    $rootScope.showCode = !$rootScope.showCode;
  }

  $rootScope.newProject();
});
