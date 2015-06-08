var galleryFilters = angular.module('galleryFilters', []);

galleryFilters.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

galleryFilters.filter('myDate', function($filter) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
        return angularDateFilter(new Date(theDate.replace(/-/g,'/')), 'dd-MM-yyyy');
    }
});