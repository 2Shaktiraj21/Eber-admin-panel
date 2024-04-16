// import { Component, OnInit } from '@angular/core';

// declare const google: any;

// @Component({
//   selector: 'app-google-maps',
//   templateUrl: './google-maps.component.html',
//   styleUrls: ['./google-maps.component.css']
// })
// export class GoogleMapsComponent implements OnInit {
//   marker:any;
//   map: any;
//   drawingManager: any;
//   selectedShape: any;

//   constructor() { }

//   ngOnInit(): void {
//     if (typeof google != 'undefined') { 
//       this.initMap();
//     }
     

//   }
//   showLocation(): void {
//     const searchBox = document.getElementById('searchBox') as HTMLInputElement;
//     searchBox.value = '';
//     if (this.map) {
//         this.map.setCenter({ lat: 0, lng: 0 });
//         this.map.setZoom(3);
//       this.marker.setMap(null);
//     }
// }


//   initMap() {
//     this.map = new google.maps.Map(document.getElementById('map'), {
//       center: { lat: 0, lng: 0 },
//       zoom: 2
//     });
//     //-------------------------------------------------------------------------------------------------------------------------------
//     const searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));

//     searchBox.addListener('places_changed', () => {
//         const places = searchBox.getPlaces();
//         console.log(places[0].geometry.location.lat());
//         console.log(places[0]);
//         console.log(places[0].geometry.location.lng());
        

//         if (places.length == 0) {
//             return;
//         }

//         if (this.marker) {
//             this.marker.setMap(null);
//         }

//         places.forEach((place) => {
//             if (!place.geometry) {
//                 console.log("Returned place contains no geometry");
//                 return;
//             }
         
//             this.marker = new google.maps.Marker({
//                 map: this.map,
//                 title: place.name,
//                 position: place.geometry.location
//             });
            
//             this.map.setCenter(place.geometry.location);
//             this.map.setZoom(10);
//         });
//     });

//     //-------------------------------------------------------------------------------------------------------------------------------

//     this.drawingManager = new google.maps.drawing.DrawingManager({
//       drawingMode: google.maps.drawing.OverlayType.POLYGON,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: ['polygon']
//       }
//     });

//     this.drawingManager.setMap(this.map);

//     google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
//       if (event.type == google.maps.drawing.OverlayType.POLYGON) {
//         if (this.selectedShape) {
//           this.selectedShape.setEditable(false);
//         }

//         this.selectedShape = event.overlay;
//         this.selectedShape.setEditable(true);

//         google.maps.event.addListener(this.selectedShape.getPath(), 'set_at', this.calArea.bind(this));
//         google.maps.event.addListener(this.selectedShape.getPath(), 'insert_at', this.calArea.bind(this));
//         this.calArea();
//       }
//     });
//   }

//   calArea() {
//     const area = google.maps.geometry.spherical.computeArea(this.selectedShape.getPath());
//     console.log('Area:', area.toFixed(2), 'sq meters');
//   }}
//------------------------------********************************---------------------------------************************************-------------------------------------

import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {
  marker: any;
  map: any;
  drawingManager: any;
  selectedShape: any;
  polygon: any;

  constructor() { }

  ngOnInit(): void {
    if (typeof google !== 'undefined') {
      this.initMap();
    }
  }
  
  isMarkerInsidePolygon(): boolean {
    return google.maps.geometry.poly.containsLocation(this.marker.getPosition(), this.polygon);
  }
  showLocation(): void {
    const searchBox = document.getElementById('searchBox') as HTMLInputElement;
    searchBox.value = '';
    if (this.map) {
      this.map.setCenter({ lat: 0, lng: 0 });
      this.map.setZoom(3);
      this.marker.setMap(null);
    }
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });

    const searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      if (this.marker) {
        this.marker.setMap(null);
      }

      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        this.marker = new google.maps.Marker({
          map: this.map,
          title: place.name,
          position: place.geometry.location
        });

        this.map.setCenter(place.geometry.location);
        this.map.setZoom(10);

        // Verify if marker is inside the polygon
        if (this.polygon && google.maps.geometry.poly.containsLocation(this.marker.getPosition(), this.polygon)) {
          console.log('Marker is inside the polygon zone');
        } else {
          console.log('Marker is outside the polygon zone');
        }
      });
    });
    
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      }
    });
    
    this.drawingManager.setMap(this.map);
    
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type == google.maps.drawing.OverlayType.POLYGON) {
        if (this.selectedShape) {
          // this.selectedShape.setEditable(false);
          this.selectedShape.setMap(null);
        }
        
        this.selectedShape = event.overlay;
        this.selectedShape.setEditable(true);
        this.polygon = this.selectedShape;

        google.maps.event.addListener(this.selectedShape.getPath(), 'set_at', this.calArea.bind(this));
        google.maps.event.addListener(this.selectedShape.getPath(), 'insert_at', this.calArea.bind(this));
        this.calArea();
      }
    });
  }
  

  calArea() {
    const area = google.maps.geometry.spherical.computeArea(this.selectedShape.getPath());
    console.log('Area:', area.toFixed(2), 'sq meters');
  }
}
