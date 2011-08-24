Polyline editing for the Google Maps V3 API
===========================================

This library adds an `edit` method to the `google.maps.Polyline` class. When the polyline is in edit mode it shows up draggable markers for every point. Right clicking an existing marker will remove it. By default you will see transparent "ghost" markers. Click and drag them to add new points to the polyline. 


![Screenshot](https://github.com/ubilabs/google.maps.polyline.edit/raw/master/screenshot.png)


### Examples ###

* [Default example](http://ubilabs.github.com/google.maps.polyline.edit/examples/default.html)
* [Advanced example](http://ubilabs.github.com/google.maps.polyline.edit/examples/advanced.html)

### Basic Usage ###

```javascript

var polyline = new google.maps.Polyline({
  map: map,
  path: [
    new google.maps.LatLng(40.77153,-73.97722),
    new google.maps.LatLng(40.77803,-73.96657)
  ]
});

polyline.edit(); // start edit

```

### Stopping an edit ###

To stop editing simply pass `false` to the method.

``` javascript

polyline.edit(false);

```

### Options for editing ###

You can disable ghost markers by passing an options object and set the `ghost` property to `false`. 

``` javascript
var options = {
  ghosts: false
}

polyline.edit(true, options);

```

### Events ###

While in edit mode events are fired while interacting with the polyline.

* `edit_start` - Editing was enabled.
* `edit_end` - Editing was disabled. Passes the new `path`.
* `update_at` - A point was edited. Passes `index` and `position`
* `insert_at` - A point was added. Passes `index` and `position`
* `remove_at` - A point was deleted. Passes `index` and `position`

Example:

```javascript

// when editing started
google.maps.event.addListener(polyline, 'edit_start', function(){
  log("[edit_start]");
});

// when editing in finished
google.maps.event.addListener(polyline, 'edit_end', function(path){
  var coords = [];
  
  path.forEach(function(position){ 
    coords.push(position.toUrlValue(5));
  });
  
  log("[edit_end]   path: " + coords.join(" | "));
});

// when a single point has been moved
google.maps.event.addListener(polyline, 'update_at', function(index, position){
  log("[update_at]  index: " +  index +  " position: " + position);
});

// when a new point has been added
google.maps.event.addListener(polyline, 'insert_at', function(index, position){
  log("[insert_at]  index: " +  index +  " position: " + position);
});

// when a point was deleted
google.maps.event.addListener(polyline, 'remove_at', function(index, position){
  log("[remove_at]  index: " +  index +  " position: " + position);
});

```

### Marker images ###

**Note:** This class uses several marker images in edit mode. 

* ![GhostVertex](https://github.com/ubilabs/google.maps.polyline.edit/raw/master/src/images/ghostVertex.png) - ghostVertex.png
* ![GhostVertexOver](https://github.com/ubilabs/google.maps.polyline.edit/raw/master/src/images/ghostVertexOver.png) - ghostVertexOver.png
* ![Vertex](https://github.com/ubilabs/google.maps.polyline.edit/raw/master/src/images/vertex.png) - vertex.png
* ![VertexOver](https://github.com/ubilabs/google.maps.polyline.edit/raw/master/src/images/vertexOver.png) - vertexOver.png

By default it looks for those images in "[../src/images/](https://github.com/ubilabs/google.maps.polyline.edit/tree/master/src/images/)". 

You can override this settings globally:

```javascript
google.maps.Polyline.prototype.edit.settings.imagePath = "/myImages/polyline/" 
```

or you can pass the `imagePath` option to the `edit` call:

```javascript
polyline.edit(true, {
  imagePath: "/myImages/polyline/"
}); 
```


### Thanks ###

[Origial work](http://www.mistechko.sumy.ua/jscript/google/map/polylineEdit/docs/reference.html) is done by [Dmitry Ryshkin](mailto:ryshkin@gmail.com). Special thanks [Jan Pieter Waagmeester](mailto:jieter@jpwaag.com) for the idea of using the library google.maps.geometry, which performs spherical linear interpolation between the two locations.

### License ###

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).