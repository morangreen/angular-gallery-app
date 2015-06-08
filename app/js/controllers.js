var galleryControllers = angular.module('galleryControllers', ['galleryServices', 'galleryFilters',
    'galleryControllers',
    'ui.bootstrap']);
galleryControllers.controller('galleryController',
    ['$scope', '$modal','$filter', 'feed', 'localStorageAccess', 'filterFilter',
        function ($scope, $modal,$filter, feed, localStorageAccess, filterFilter) {
            $scope.sortProp = 'date';
            $scope.images = [];

            $scope.itemsPerPage = parseInt($scope.resultsPerPage);
            $scope.isPagination = Boolean($scope.paging);
            $scope.isSorting = Boolean($scope.sorting);
            $scope.isSearch = Boolean($scope.search);
            $scope.currentPage = 1;

            $scope.pageCount = function () {
                return Math.ceil($scope.images.length / $scope.itemsPerPage);
            };

            $scope.myOrderBy = function (img) {
                var orderByValue = img.title;
                if ($scope.sortProp == 'date') {
                    orderByValue = new Date(img.date);
                }

                return orderByValue;
            };

            $scope.$watchGroup(['query', 'deleted'], function (newValues, oldValues, scope) {
                if (newValues[0] != oldValues[0]) {// query changed
                    $scope.filteredImages = filterFilter($scope.images, newValues[0]);
                }
                $scope.totalItems = $scope.filteredImages.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                $scope.currentPage = 1;
            });

            feed.getImages($scope.feed).then(function (data) {
                $scope.images = data;
                $scope.totalItems = $scope.images.length;

            });

            $scope.animationsEnabled = true;
            $scope.clearLocalStorage = function () {
                localStorageAccess.clear();
            },
            $scope.delete = function (imgObj) {
                $scope.images.splice($scope.images.indexOf(imgObj), 1);
                $scope.deleted = imgObj;
                localStorageAccess.deleteImg(imgObj);
            },
                $scope.open = function (imgObj) {

                    $scope.selectedImg = imgObj;
                    var modalInstance = $modal.open({
                        scope: $scope,
                        animation: $scope.animationsEnabled,
                        templateUrl: 'template/gallery-modal.html',
                        controller: function ($scope, $modalInstance) {
                            $scope.myInterval = parseInt($scope.$parent.autoRotateTime) * 1000;
                            var slides = $scope.slides = [];
                            $scope.addSlide = function (slideToPush) {
                                if (slideToPush.url == $scope.$parent.selectedImg.url) {
                                    slideToPush.active = true;
                                }
                                else {
                                    slideToPush.active = false;
                                }
                                slides.push(slideToPush);
                            };

                            $scope.$parent.filteredImages.forEach(function (entry) {
                                $scope.addSlide(entry);
                            });

                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                            };
                        }
                    });
                };
        }]);
