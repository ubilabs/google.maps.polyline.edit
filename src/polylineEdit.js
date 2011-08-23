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

(function(undefined){
  if (google.maps.Polyline.prototype.runEdit === undefined) {
    /**
     * Starts editing the polyline. Optional parameter <code>ghosts</code>
     * indicates the use of ghost markers in the middle of each segment. By
     * default, the <code>ghosts</code> is true.
     * 
     * @param {}
     *   ghosts - (true) include additional points in the middle of each segment
     */
    google.maps.Polyline.prototype.runEdit = function (ghosts) {
      if (ghosts === undefined) {
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
              self.getPath().getAt(this.marker.editIndex + 1)
            ]);
          }  
          ghostPath.getPath().setAt(1, this.getPosition());
        }

        function moveGhostMarkers(marker) {
          var vertex = self.getPath().getAt(marker.editIndex);
          var prevVertex = self.getPath().getAt(marker.editIndex - 1);
          if ((vertex !== undefined) && (vertex.ghostMarker !== undefined)) {
            var next = self.getPath().getAt(marker.editIndex + 1);
            if (google.maps.geometry === undefined) {
              vertex.ghostMarker.setPosition(
                new google.maps.LatLng(
                  vertex.lat() + 0.5 * (next.lat() - vertex.lat()), 
                  vertex.lng() + 0.5 * (next.lng() - vertex.lng())
                )
              );
            } else {
              vertex.ghostMarker.setPosition(
                google.maps.geometry.spherical.interpolate(
                  vertex, next, 0.5
                )
              );
            }
          }
          if ((prevVertex !== undefined) && (prevVertex.ghostMarker !== undefined)) {
            if (google.maps.geometry === undefined) {
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
          ghostPath.getPath().forEach(function() {
            ghostPath.getPath().pop();
          });
          
          self.getPath().insertAt(
            this.marker.editIndex + 1, 
            this.getPosition()
          );
          
          createMarkerVertex(
            self.getPath().getAt(this.marker.editIndex + 1)
          ).editIndex = this.marker.editIndex + 1;
          
          moveGhostMarkers(this.marker);
          
          createGhostMarkerVertex(
            self.getPath().getAt(this.marker.editIndex + 1)
          );
          
          self.getPath().forEach(function (vertex, index) {
            if (vertex.marker) {
              vertex.marker.editIndex = index;
            }
          });
        }

        function createGhostMarkerVertex(point) {
          if (point.marker.editIndex < self.getPath().getLength() - 1) {
            var next = self.getPath().getAt(point.marker.editIndex + 1);
            var position;
            
            if (google.maps.geometry === undefined) {
              position = new google.maps.LatLng(
                point.lat() + 0.5 * (next.lat() - point.lat()),
                point.lng() + 0.5 * (next.lng() - point.lng())
              ); 
            } else {
              position = google.maps.geometry.spherical.interpolate(
                point, next, 0.5
              );
            }
                        
            var vertex = new google.maps.Marker({
              position : position,
              map : self.getMap(),
              icon : imgGhostVertex,
              draggable : true,
              raiseOnDrag : false
            });
            
            google.maps.event.addListener(vertex, "mouseover", vertexGhostMouseOver);
            google.maps.event.addListener(vertex, "mouseout", vertexGhostMouseOut);
            google.maps.event.addListener(vertex, "drag", vertexGhostDrag);
            google.maps.event.addListener(vertex, "dragend", vertexGhostDragEnd);
            
            point.ghostMarker = vertex;
            vertex.marker = point.marker;
            return vertex;
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
        new google.maps.Size(11, 11), 
        new google.maps.Point(0, 0),
        new google.maps.Point(6, 6)
      );

      function vertexMouseOver() {
        this.setIcon(imgVertexOver);
      }

      function vertexMouseOut() {
        this.setIcon(imgVertex);
      }

      function vertexDrag() {
        var vertex = this.getPosition();
        vertex.marker = this;
        vertex.ghostMarker = self.getPath().getAt(this.editIndex).ghostMarker;
        self.getPath().setAt(this.editIndex, vertex);
        if (ghosts) {
          moveGhostMarkers(this);
        }
      }

      function vertexRightClick() {
        if (ghosts) {
          var vertex = self.getPath().getAt(this.editIndex),
            prevVertex = self.getPath().getAt(this.editIndex - 1);
            
          if (vertex.ghostMarker !== undefined) {
            vertex.ghostMarker.setMap(null);
          }
          
          self.getPath().removeAt(this.editIndex);
          
          if (prevVertex !== undefined) {
            if (this.editIndex < self.getPath().getLength()) {
              moveGhostMarkers(prevVertex.marker);
            } else {
              prevVertex.ghostMarker.setMap(null);
              prevVertex.ghostMarker = undefined;
            }
          }
        } else {
          self.getPath().removeAt(this.editIndex);
        }
        
        this.setMap(null);
        self.getPath().forEach(function (vertex, index) {
          if (vertex.marker) {
            vertex.marker.editIndex = index;
          }
        });
        
        if (self.getPath().getLength() === 1) {
          self.getPath().pop().marker.setMap(null);
        }
      }

      function createMarkerVertex(point) {
        var vertex = new google.maps.Marker({
          position : point,
          map : self.getMap(),
          icon : imgVertex,
          draggable : true,
          raiseOnDrag : false
        });
        
        google.maps.event.addListener(vertex, "mouseover", vertexMouseOver);
        google.maps.event.addListener(vertex, "mouseout", vertexMouseOut);
        google.maps.event.addListener(vertex, "drag", vertexDrag);
        google.maps.event.addListener(vertex, "rightclick", vertexRightClick);
        
        point.marker = vertex;
        return vertex;
      }

      this.getPath().forEach(function (vertex, index) {
        createMarkerVertex(vertex).editIndex = index;
        if (ghosts) {
          createGhostMarkerVertex(vertex);
        }
      });
    };
  }

  if (google.maps.Polyline.prototype.stopEdit === undefined) {
    /**
     * Stops editing polyline
    */
    google.maps.Polyline.prototype.stopEdit = function () {
      this.getPath().forEach(function (vertex, index) {
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
})();