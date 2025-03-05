import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import * as L from "leaflet"
import type { Address } from "../../../models/residence.model"

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[400px]">
      <div #mapContainer class="h-full w-full rounded-lg z-10 border border-gray-300 dark:border-gray-600"></div>
      <div class="absolute top-3 right-3 z-20 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button 
          type="button" 
          (click)="findMyLocation()"
          class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          My Location
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-height: 400px;
      overflow: hidden;
    }
  `]
})
export class MapComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() address: Address | null = null
  @Input() editable = false
  @Output() addressChange = new EventEmitter<Partial<Address>>()
  @ViewChild("mapContainer") mapContainer!: ElementRef

  private map: L.Map | null = null
  private marker: L.Marker | null = null
  private defaultCenter = [40.7128, -74.0060] // New York City
  private defaultZoom = 13
  private markerZoom = 15


  private defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap()
    }, 100)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return

    if (changes["address"] && this.address && this.address.latitude && this.address.longitude) {
      this.centerMap(this.address.latitude, this.address.longitude)
      this.addMarker(this.address.latitude, this.address.longitude)
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }

  private initMap(): void {
    if (this.map) return

    try {
     
      L.Marker.prototype.options.icon = this.defaultIcon;
      this.map = L.map(this.mapContainer.nativeElement, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(this.defaultCenter as L.LatLngExpression, this.defaultZoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      }).addTo(this.map)

      if (this.address && this.address.latitude && this.address.longitude) {
        this.centerMap(this.address.latitude, this.address.longitude)
        this.addMarker(this.address.latitude, this.address.longitude)
      }

      if (this.editable && this.map) {
        this.map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng
          this.addMarker(lat, lng)
          this.reverseGeocode(lat, lng)
        })
      }

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize()
        }
      }, 200)
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  private centerMap(lat: number, lng: number): void {
    if (!this.map) return
    this.map.setView([lat, lng], this.markerZoom)
  }

  private addMarker(lat: number, lng: number): void {
    if (!this.map) return

    if (this.marker) {
      this.map.removeLayer(this.marker)
    }

    this.marker = L.marker([lat, lng]).addTo(this.map)
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
      .then((response) => response.json())
      .then((data) => {
        const address: Partial<Address> = {
          street: data.address.road || "",
          city: data.address.city || data.address.town || data.address.village || "",
          state: data.address.state || "",
          postalCode: data.address.postcode || "",
          country: data.address.country || "",
          latitude: lat,
          longitude: lng,
        }

        this.addressChange.emit(address)
      })
      .catch((error) => {
        console.error("Error during reverse geocoding:", error)
      })
  }

  findMyLocation(): void {
    if (!this.map) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.centerMap(lat, lng)
          this.addMarker(lat, lng)

          if (this.editable) {
            this.reverseGeocode(lat, lng)
          }
        },
        (error) => {
          console.error("Error getting current location:", error)
          alert("Unable to get your current location. Please check your browser permissions.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }
}