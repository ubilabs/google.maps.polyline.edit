/**
 * @name polylineEdit for Google Maps V3 API
 * @version 1.0.1 [January 29, 2011]
 * @author: ryshkin@gmail.com
 * @fileoverview <b>Author:</b> ryshkin@gmail.com<br/> <b>Licence:</b>
 *   Licensed under <a
 *   href="http://opensource.org/licenses/mit-license.php">MIT</a>
 *   license.<br/> This library Extends the functionality of a
 *   class google.maps.Polyline by methods runEdit() and stopEdit()<br/>
 *   Enjoy guys:)<br/>
 *   Special thanks <code>Jan Pieter Waagmeester jieter@jpwaag.com</code> 
 *   for the idea of using the library google.maps.geometry , which performs 
 *   spherical linear interpolation between the two locations.
 */
/**
 * @name google
 * @class The fundamental namespace for Google APIs 
 */
/**
 * @name google.maps
 * @class The fundamental namespace for Google Maps V3 API 
 */
/**
 * @name google.maps.Polyline
 * @class Extends standart class google.maps.Polyline by methods runEdit() and
 *        stopEdit()
 */
if (typeof(google.maps.Polyline.prototype.runEdit) === "undefined") {
  /**
   * Starts editing the polyline. Optional parameter <code>ghosts</code>
   * indicates the use of ghost markers in the middle of each segment. By
   * default, the <code>ghosts</code> is true.
   * 
   * @param {}
   *   ghosts - (true) include additional points in the middle of each segment
   */
  google.maps.Polyline.prototype.runEdit = function (ghosts) {
    if (typeof ghosts === "undefined") {
      ghosts = true;
    }
    var self = this;
    if (ghosts) {
      var imgGhostVertex = new google.maps.MarkerImage(
        'css/ghostVertex.png', 
        new google.maps.Size(11, 11),
        new google.maps.Point(0, 0), 
        new google.maps.Point(6, 6)
      );
        
      var imgGhostVertexOver = new google.maps.MarkerImage(
        'css/ghostVertexOver.png', 
        new google.maps.Size(11, 11),
        new google.maps.Point(0, 0), 
        new google.maps.Point(6, 6)
      );
      
      var ghostPath = new google.maps.Polyline({
        map : this.getMap(),
        strokeColor : this.strokeColor,
        strokeOpacity : 0.2,
        strokeWeight : this.strokeWeight
      });
      
      function vertexGhostMouseOver() {
        this.setIcon(imgGhostVertexOver);
      }
      
      function vertexGhostMouseOut() {
        this.setIcon(imgGhostVertex);
      }
      
      function vertexGhostDrag() {
        if (ghostPath.getPath().getLength() === 0) {
          ghostPath.setPath([
            this.marker.getPosition(), 
            this.getPosition(), 
            self.getPath().getAt(this.marker.inex + 1)
          ]);
        }  
        ghostPath.getPath().setAt(1, this.getPosition());
      }
      
      function moveGhostMarkers(marker) {
        var vertex = self.getPath().getAt(marker.inex);
        var prevVertex = self.getPath().getAt(marker.inex - 1);
        if ((typeof(vertex) !== "undefined") && (typeof(vertex.ghostMarker) !== "undefined")) {
          if (typeof(google.maps.geometry) === "undefined") {
            vertex.ghostMarker.setPosition(
              new google.maps.LatLng(
                vertex.lat() + 0.5 * (self.getPath().getAt(marker.inex + 1).lat() - vertex.lat()), vertex.lng() + 0.5 * (self.getPath().getAt(marker.inex + 1).lng() - vertex.lng())
              )
            );
          } else {
            vertex.ghostMarker.setPosition(
              google.maps.geometry.spherical.interpolate(
                vertex, 
                self.getPath().getAt(marker.inex + 1), 
                0.5
              )
            );
          }
        }
        if ((typeof(prevVertex) !== "undefined") && (typeof(prevVertex.ghostMarker) !== "undefined")) {
          if (typeof(google.maps.geometry) === "undefined") {
            prevVertex.ghostMarker.setPosition(
              new google.maps.LatLng(
                prevVertex.lat() + 0.5 * (marker.getPosition().lat() - prevVertex.lat()), 
                prevVertex.lng() + 0.5 * (marker.getPosition().lng() - prevVertex.lng())
              )
            );
          } else {
            prevVertex.ghostMarker.setPosition(
              google.maps.geometry.spherical.interpolate(
                prevVertex, 
                marker.getPosition(), 
                0.5
              )
            );
          }
        }
      }
      
      function vertexGhostDragEnd() {
        ghostPath.getPath().forEach(function () {
          ghostPath.getPath().pop();
        });
        self.getPath().insertAt(this.marker.inex + 1, this.getPosition());
        createMarkerVertex(self.getPath().getAt(this.marker.inex + 1)).inex = this.marker.inex + 1;
        moveGhostMarkers(this.marker);
        createGhostMarkerVertex(self.getPath().getAt(this.marker.inex + 1));
        self.getPath().forEach(function (vertex, inex) {
          if (vertex.marker) {
            vertex.marker.inex = inex;
          }
        });
      }
      
      function createGhostMarkerVertex(point) {
        if (point.marker.inex < self.getPath().getLength() - 1) {
          var markerGhostVertex = new google.maps.Marker({
            position : (typeof(google.maps.geometry) === "undefined") ? new google.maps.LatLng(
              point.lat() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lat() - point.lat()),
              point.lng() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lng() - point.lng())
            ) : google.maps.geometry.spherical.interpolate(point, self.getPath().getAt(point.marker.inex + 1), 0.5),
            map : self.getMap(),
            icon : imgGhostVertex,
            draggable : true,
            raiseOnDrag : false
          });
          google.maps.event.addListener(markerGhostVertex, "mouseover", vertexGhostMouseOver);
          google.maps.event.addListener(markerGhostVertex, "mouseout", vertexGhostMouseOut);
          google.maps.event.addListener(markerGhostVertex, "drag", vertexGhostDrag);
          google.maps.event.addListener(markerGhostVertex, "dragend", vertexGhostDragEnd);
          point.ghostMarker = markerGhostVertex;
          markerGhostVertex.marker = point.marker;
          return markerGhostVertex;
        }
        return null;
      }
    }
    var imgVertex = new google.maps.MarkerImage(
      'css/vertex.png',
      new google.maps.Size(11, 11), 
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 6)
    );
      
    var imgVertexOver = new google.maps.MarkerImage('css/vertexOver.png',
      new google.maps.Size(11, 11), new google.maps.Point(0, 0),
      new google.maps.Point(6, 6));
      
    function vertexMouseOver() {
      this.setIcon(imgVertexOver);
    }
    
    function vertexMouseOut() {
      this.setIcon(imgVertex);
    }
    
    function vertexDrag() {
      var movedVertex = this.getPosition();
      movedVertex.marker = this;
      movedVertex.ghostMarker = self.getPath().getAt(this.inex).ghostMarker;
      self.getPath().setAt(this.inex, movedVertex);
      if (ghosts) {
        moveGhostMarkers(this);
      }
    }
    
    function vertexRightClick() {
      if (ghosts) {
        var vertex = self.getPath().getAt(this.inex);
        var prevVertex = self.getPath().getAt(this.inex - 1);
        if (typeof(vertex.ghostMarker) !== "undefined") {
          vertex.ghostMarker.setMap(null);
        }
        self.getPath().removeAt(this.inex);
        if (typeof(prevVertex) !== "undefined") {
          if (this.inex < self.getPath().getLength()) {
            moveGhostMarkers(prevVertex.marker);
          }
          else {
            prevVertex.ghostMarker.setMap(null);
            prevVertex.ghostMarker = undefined;
          }
        }
      } 
      else {
        self.getPath().removeAt(this.inex);
      }
      this.setMap(null);
      self.getPath().forEach(function (vertex, inex) {
        if (vertex.marker) {
          vertex.marker.inex = inex;
        }
      });
      if (self.getPath().getLength() === 1) {
        self.getPath().pop().marker.setMap(null);
      }
    }
    
    function createMarkerVertex(point) {
      var markerVertex = new google.maps.Marker({
        position : point,
        map : self.getMap(),
        icon : imgVertex,
        draggable : true,
        raiseOnDrag : false
      });
      google.maps.event.addListener(markerVertex, "mouseover", vertexMouseOver);
      google.maps.event.addListener(markerVertex, "mouseout", vertexMouseOut);
      google.maps.event.addListener(markerVertex, "drag", vertexDrag);
      google.maps.event.addListener(markerVertex, "rightclick", vertexRightClick);
      point.marker = markerVertex;
      return markerVertex;
    }
    
    this.getPath().forEach(function (vertex, inex) {
      createMarkerVertex(vertex).inex = inex;
      if (ghosts) {
        createGhostMarkerVertex(vertex);
      }
    });
  };
}

if (typeof(google.maps.Polyline.prototype.stopEdit) === "undefined") {
  /**
   * Stops editing polyline
  */
  google.maps.Polyline.prototype.stopEdit = function () {
    this.getPath().forEach(function (vertex, inex) {
      if (vertex.marker) {
        vertex.marker.setMap(null);
        vertex.marker = undefined;
      }
      if (vertex.ghostMarker) {
        vertex.ghostMarker.setMap(null);
        vertex.ghostMarker = undefined;
      }
    });
  };
}