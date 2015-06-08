var galleryServices = angular.module('galleryServices', ['ngStorage']);

galleryServices.factory('feed', ['$q', '$http', 'localStorageAccess' , function ($q, $http, localStorageAccess) {
    var getImages = function (feed) {
        var deferred = $q.defer();

        if (localStorageAccess.hasFeed()) {
            deferred.resolve(localStorageAccess.getFeed());
        }
        else {
            if (typeof(feed) == 'object') {
                //var arr = [];
                //arr[0] = feed;
                localStorageAccess.initFeed(feed);
                deferred.resolve(feed);
            }
            else {
                $http.get(feed).success(function (data) {
                    localStorageAccess.initFeed(data);
                    deferred.resolve(data);
                })
            }
        }
        return deferred.promise;
    };

    return {
        getImages: getImages
    };
}]);

galleryServices.factory('settings', function () {
    return {
        noImageUrl: "images/missing.png"
    };
});

galleryServices.factory('localStorageAccess', ['$localStorage', function ($localStorage) {
    var getFeed = function () {
        return angular.fromJson($localStorage.myGalleryFeed);
    };

    var initFeed = function (myGalleryFeed) {
        $localStorage.myGalleryFeed = angular.toJson(myGalleryFeed);
        $localStorage.myGalleryBlackList = '[]';
    };

    var deleteImg = function (imgObj) {
        var imgs = angular.fromJson($localStorage.myGalleryFeed);
        var index = -1;
        for (i = 0; i < imgs.length; i++) {
            if (imgs[i].url == imgObj.url) {
                index = i;
                break;
            }
        }

        imgs.splice(index, 1);
        $localStorage.myGalleryFeed = angular.toJson(imgs);

        var blackListimgs = angular.fromJson($localStorage.myGalleryBlackList);
        blackListimgs.push(imgObj);
        $localStorage.myGalleryBlackList = angular.toJson(blackListimgs);
    };

    var clear = function () {
        $localStorage.myGalleryFeed = '';
        $localStorage.myGalleryBlackList = '[]';
    }

    var hasFeed = function () {
        return $localStorage.hasOwnProperty('myGalleryFeed') &&
            $localStorage.myGalleryFeed != '';
    };

    return {
        getFeed: getFeed,
        initFeed: initFeed,
        deleteImg: deleteImg,
        clear:clear,
        hasFeed: hasFeed
    };
}]);

