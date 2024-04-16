import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var google:any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  // map: any;
  // geocoder: any;
  // marker: any;

  map: any;
  geocoder: any;
  marker: any;
  searchInputValue: string = '';

  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 10
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.geocoder = new google.maps.Geocoder();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.map.setCenter(pos);
        this.addMarker(pos);
      }, () => {
        this.handleLocationError(true, this.map.getCenter());
      });
    } else {
      this.handleLocationError(false, this.map.getCenter());
    }

    const input = document.getElementById('search-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
      this.addMarker(place.geometry.location);
    });

    this.map.addListener('click', (event: { latLng: any; }) => {
      this.geocoder.geocode({ 'location': event.latLng }, (results: { formatted_address: any; }[], status: string) => {
        if (status === 'OK') {
          if (results[0]) {
            this.map.setZoom(17);
            this.addMarker(event.latLng);
            this.searchInputValue = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  handleLocationError(browserHasGeolocation: boolean, pos: any) {
    const infoWindowContent = browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.';
    const infoWindow = new google.maps.InfoWindow({ map: this.map });
    infoWindow.setPosition(pos);
    infoWindow.setContent(infoWindowContent);
  }

  addMarker(location: any) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  }
}
