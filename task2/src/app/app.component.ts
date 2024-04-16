import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var google: any;

@Component({
  standalone: true,
  imports: [ FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fromInput: string = '';
  toInput: string = '';
  map: any;
  directionsService: any;
  directionsRenderer: any;
  fromPlace: any;
  toPlace: any;
  distance: string = '';
  duration: string = '';

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    const mapProperties = {
      center: new google.maps.LatLng(0, 0),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapProperties);
    this.directionsRenderer.setMap(this.map);

    this.initAutocomplete();
  }

  initAutocomplete() {
    const autocompleteFrom = new google.maps.places.Autocomplete(document.getElementById('from'));
    const autocompleteTo = new google.maps.places.Autocomplete(document.getElementById('to'));

    autocompleteFrom.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.fromPlace = autocompleteFrom.getPlace();
        this.showMarker(this.fromPlace);
        this.calculateDistance();
      });
    });

    autocompleteTo.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.toPlace = autocompleteTo.getPlace();
        this.showMarker(this.toPlace);
        this.calculateDistance();
      });
    });
  }

  showMarker(place: any) {
    if (!place.geometry) {
      console.log('Place details not available');
      return;
    }

    this.map.setCenter(place.geometry.location);

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
  }

  calculateDistance() {
    if (this.fromPlace && this.toPlace) {
      const request = {
        origin: this.fromPlace.geometry.location,
        destination: this.toPlace.geometry.location,
        travelMode: 'DRIVING'
      };
      this.directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(result);
          this.distance = 'Distance: ' + result.routes[0].legs[0].distance.text;
          this.duration = 'Duration: ' + result.routes[0].legs[0].duration.text;
        } else {
          console.log('Directions request failed: ' + status);
        }
      });
    }
  }
}
