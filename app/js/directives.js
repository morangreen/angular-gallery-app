var galleryDirectives = angular.module('galleryDirectives', ['galleryServices','galleryControllers']);

galleryDirectives.directive("myGallery", function () {
    return {
        restrict: 'E',
        templateUrl: "template/my-gallery.html",
        scope: {
            feed: '=',
            search: '=',
            paging: '=',
            resultsPerPage: '=',
            sorting: '=',
            autoRotateTime: '='
        },
        controller:'galleryController',
        compile: function (element, attrs) {
            if (!attrs.search) {
                attrs.search = 'true';
            }
            if (!attrs.paging) {
                attrs.paging = 'true';
            }
            if (!attrs.resultsPerPage) {
                attrs.resultsPerPage = '10';
            }
            if (!attrs.sorting) {
                attrs.sorting = 'true';
            }
            if (!attrs.autoRotateTime) {
                attrs.autoRotateTime = '4';
            }
        }
    };
});
galleryDirectives.directive('noImage', function (settings) {

    var setDefaultImage = function (el) {
        el.attr('src', settings.noImageUrl);
    };
    return {
        restrict: 'A',
        link: function (scope, el, attr) {
            scope.$watch(function () {
                return attr.ngSrc;
            }, function () {
                var src = attr.ngSrc;

                if (!src) {
                    setDefaultImage(el);
                }
            });

            el.bind('error', function () {
                setDefaultImage(el);
            });
        }
    };
});

