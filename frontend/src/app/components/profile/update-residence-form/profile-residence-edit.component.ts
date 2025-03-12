import { Component, type OnInit, Input, Output, EventEmitter, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { ProfileResidence } from "../../../models/profile.model"
import type { Address } from "../../../models/residence.model"
import { MapComponent } from "../../ui/map/map.component"

@Component({
  selector: "app-profile-residence-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapComponent],
  templateUrl: "./profile-residence-edit.component.html",
})
export class ProfileResidenceEditComponent implements OnInit {
  private fb = inject(FormBuilder)

  @Input() residence!: ProfileResidence
  @Output() save = new EventEmitter<any>()
  @Output() cancel = new EventEmitter<void>()

  residenceForm!: FormGroup
  mapAddress: Address | null = null

  ngOnInit(): void {
    this.initForm()
    this.mapAddress = this.residence.address
  }

  private initForm(): void {
    this.residenceForm = this.fb.group({
      name: [this.residence.name, Validators.required],
      description: [this.residence.description, Validators.required],
      address: this.fb.group({
        street: [this.residence.address.street, Validators.required],
        city: [this.residence.address.city, Validators.required],
        state: [this.residence.address.state, Validators.required],
        postalCode: [this.residence.address.postalCode, Validators.required],
        country: [this.residence.address.country, Validators.required],
        latitude: [this.residence.address.latitude || null],
        longitude: [this.residence.address.longitude || null],
      }),
      totalApartments: [this.residence.totalApartments, [Validators.required, Validators.min(0)]],
      availableApartments: [this.residence.availableApartments, [Validators.required, Validators.min(0)]],
      startingPrice: [this.residence.startingPrice, [Validators.required, Validators.min(0)]],
      contactInformation: [this.residence.contactInformation, Validators.required],
      amenities: [this.residence.amenities.join(", ")],
    })
  }

  onSubmit(): void {
    if (this.residenceForm.valid) {
      const formValue = { ...this.residenceForm.value }
      if (formValue.amenities) {
        formValue.amenities = formValue.amenities
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "")
      }

      this.save.emit(formValue)
    }
  }

  onAddressChange(partialAddress: Partial<Address>): void {
    const addressForm = this.residenceForm.get("address")
    if (addressForm) {
      if (partialAddress.street) addressForm.get("street")?.setValue(partialAddress.street)
      if (partialAddress.city) addressForm.get("city")?.setValue(partialAddress.city)
      if (partialAddress.state) addressForm.get("state")?.setValue(partialAddress.state)
      if (partialAddress.postalCode) addressForm.get("postalCode")?.setValue(partialAddress.postalCode)
      if (partialAddress.country) addressForm.get("country")?.setValue(partialAddress.country)
      if (partialAddress.latitude) addressForm.get("latitude")?.setValue(partialAddress.latitude)
      if (partialAddress.longitude) addressForm.get("longitude")?.setValue(partialAddress.longitude)
    }
  }

  onCancel(): void {
    this.cancel.emit()
  }
}

