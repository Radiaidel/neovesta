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
import { FormsModule } from "@angular/forms"
import * as L from "leaflet"
import type { Address } from "../../../models/residence.model"

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full h-[400px]">
      <div #mapContainer class="h-full w-full rounded-lg z-10 border border-gray-300 dark:border-gray-600"></div>
      
      <!-- Search Bar -->
      <div class="absolute top-3 left-3 right-20 z-20">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="searchLocation()"
            placeholder="Search for a location..."
            class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pr-10"
          />
          <button 
            type="button"
            (click)="searchLocation()"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- My Location Button -->
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

      <!-- Clear Fields Button - Only shown when a marker is placed -->
      <div *ngIf="marker" class="absolute bottom-3 right-3 z-20 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button 
          type="button" 
          (click)="clearFields()"
          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Clear Fields
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
  marker: L.Marker | null = null
  private defaultCenter = [40.7128, -74.0060] // New York City
  private defaultZoom = 13
  private markerZoom = 15
  searchQuery = ""

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

  searchLocation(): void {
    if (!this.map || !this.searchQuery.trim()) return

    const encodedQuery = encodeURIComponent(this.searchQuery.trim())
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0]
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)
          
          this.centerMap(lat, lng)
          this.addMarker(lat, lng)
          
          if (this.editable) {
            this.reverseGeocode(lat, lng)
          }
          
          // Clear search query after successful search
          this.searchQuery = ""
        } else {
          alert("Location not found. Please try a different search term.")
        }
      })
      .catch(error => {
        console.error("Error searching for location:", error)
        alert("Error searching for location. Please try again.")
      })
  }

  clearFields(): void {
    // Remove marker from map
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker)
      this.marker = null
    }
    
    // Clear address fields by emitting an object with empty values
    const emptyAddress: Partial<Address> = {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      latitude: null,
      longitude: null,
    }
    
    this.addressChange.emit(emptyAddress)
    
    // Reset map view to default
    if (this.map) {
      this.map.setView(this.defaultCenter as L.LatLngExpression, this.defaultZoom)
    }
  }
}