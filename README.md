Polyline editing for the Google Maps V3 API
===========================================

This library extends the `google.maps.Polyline` class by `runEdit()` and `stopEdit()`.

### Usage ###

    var polyline = new google.maps.Polyline({
      map : map,
      path:[...]
    });
    
    polyline.runEdit();

### Thanks ###

[Origial work](http://www.mistechko.sumy.ua/jscript/google/map/polylineEdit/docs/reference.html) is done by [Dmitry Ryshkin](mailto:ryshkin@gmail.com).

Special thanks [Jan Pieter Waagmeester](mailto:jieter@jpwaag.com) for the idea of using the library google.maps.geometry, which performs spherical linear interpolation between the two locations.

### License ###

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).