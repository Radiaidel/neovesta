import { Component, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { type FormArray, FormBuilder, FormControl, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import {
  type Address,
  type CreateResidenceRequest,
  type Document,
  type DocumentUpload,
  type Residence,
  ResidenceStatus,
  type UpdateResidenceRequest,
} from "../../../models/residence.model"
import { ResidenceActions } from "../../../store/residence/residence.actions"
import { selectLoading, selectSelectedResidence } from "../../../store/residence/residence.selectors"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { MapComponent } from "../../ui/map/map.component"
import { HeaderComponent } from "../../shared/header/header.component";
import { trigger, transition, style, query, animate } from '@angular/animations';

@Component({
  selector: "app-residence-form",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, MapComponent, HeaderComponent],
  templateUrl: `./residence-form.component.html`,
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ResidenceFormComponent implements OnInit, OnDestroy {
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private destroy$ = new Subject<void>()

  loading$: Observable<boolean> = this.store.select(selectLoading)

  residenceForm: FormGroup
  isEditMode = false
  residenceId: string | null = null
  formErrors: Record<string, string> = {}

  // File uploads
  previewUrls: string[] = [];
  selectedImages: File[] = []
  selectedDocuments: DocumentUpload[] = []
  existingImageUrls: string[] = []
  existingDocuments: Document[] = []

  // Address
  currentAddress: Address | null = null

  isSubmitting = false

  // Expose enum to template
  ResidenceStatus = ResidenceStatus

  constructor() {
    this.residenceForm = this.createForm()
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get("id")
      if (id && id !== "new") {
        this.isEditMode = true
        this.residenceId = id
        this.store.dispatch(ResidenceActions.loadResidence({ id }))

        // Subscribe to selected residence for edit mode
        this.store
          .select(selectSelectedResidence)
          .pipe(takeUntil(this.destroy$))
          .subscribe((residence) => {
            if (residence) {
              this.patchForm(residence)
              this.existingImageUrls = [...residence.imageUrls]
              this.existingDocuments = [...residence.documents]

              if (residence.address.latitude && residence.address.longitude) {
                this.currentAddress = { ...residence.address }
              }
            }
          })
      }
    })

    // Subscribe to form value changes to validate
    this.residenceForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm()
    })
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];

    this.destroy$.next()
    this.destroy$.complete()

    if (this.isEditMode) {
      this.store.dispatch(ResidenceActions.resetSelectedResidence())
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
      status: [ResidenceStatus.ACTIVE, [Validators.required]],
      managerId: [""],
      startingPrice: [null, [Validators.required, Validators.min(0)]],
      totalApartments: [null, [Validators.required, Validators.min(1)]],
      availableApartments: [null, [Validators.required, Validators.min(0)]],
      contactInformation: [""],
      address: this.fb.group({
        street: [""],
        city: [""],
        state: [""],
        postalCode: [""],
        country: [""],
        latitude: [null],
        longitude: [null],
      }),
      amenities: this.fb.array([this.fb.control("")]),
    })
  }

  patchForm(residence: Residence): void {
    // Clear form arrays first
    while (this.amenitiesFormArray.length) {
      this.amenitiesFormArray.removeAt(0)
    }

    // Add amenities
    if (residence.amenities && residence.amenities.length > 0) {
      residence.amenities.forEach((amenity) => {
        this.amenitiesFormArray.push(this.fb.control(amenity))
      })
    } else {
      this.amenitiesFormArray.push(this.fb.control(""))
    }

    // Patch the rest of the form
    this.residenceForm.patchValue({
      name: residence.name,
      description: residence.description,
      status: residence.status,
      managerId: residence.managerId,
      startingPrice: residence.startingPrice,
      totalApartments: residence.totalApartments,
      availableApartments: residence.availableApartments,
      contactInformation: residence.contactInformation,
      address: residence.address,
    })
  }

  validateForm(): void {
    this.formErrors = {}

    const form = this.residenceForm

    // Check required fields
    if (form.get("name")?.invalid && form.get("name")?.errors?.["required"]) {
      this.formErrors["name"] = "Name is required"
    }

    if (form.get("status")?.invalid && form.get("status")?.errors?.["required"]) {
      this.formErrors["status"] = "Status is required"
    }

    if (form.get("startingPrice")?.invalid) {
      if (form.get("startingPrice")?.errors?.["required"]) {
        this.formErrors["startingPrice"] = "Starting price is required"
      } else if (form.get("startingPrice")?.errors?.["min"]) {
        this.formErrors["startingPrice"] = "Starting price must be at least 0"
      }
    }

    if (form.get("totalApartments")?.invalid) {
      if (form.get("totalApartments")?.errors?.["required"]) {
        this.formErrors["totalApartments"] = "Total apartments is required"
      } else if (form.get("totalApartments")?.errors?.["min"]) {
        this.formErrors["totalApartments"] = "Total apartments must be at least 1"
      }
    }

    if (form.get("availableApartments")?.invalid) {
      if (form.get("availableApartments")?.errors?.["required"]) {
        this.formErrors["availableApartments"] = "Available apartments is required"
      } else if (form.get("availableApartments")?.errors?.["min"]) {
        this.formErrors["availableApartments"] = "Available apartments must be at least 0"
      }
    }
  }

  onSubmit(): void {
    if (this.residenceForm.invalid) {
      this.validateForm()
      return
    }

    this.isSubmitting = true
    const formValue = this.residenceForm.value

    // Filter out empty values from arrays
    const amenities = formValue.amenities.filter((amenity: string) => amenity.trim() !== "")

    if (this.isEditMode && this.residenceId) {
      const updateRequest: UpdateResidenceRequest = {
        name: formValue.name,
        description: formValue.description,
        address: formValue.address,
        totalApartments: formValue.totalApartments,
        availableApartments: formValue.availableApartments,
        startingPrice: formValue.startingPrice,
        amenities,
        contactInformation: formValue.contactInformation,
      }

      // Create document uploads
      const documentUploads: DocumentUpload[] = this.selectedDocuments

      // Dispatch update action with files
      this.store.dispatch(
        ResidenceActions.updateResidenceWithFiles({
          id: this.residenceId,
          residence: updateRequest,
          images: this.selectedImages,
          documents: documentUploads,
          existingImageUrls: this.existingImageUrls,
          existingDocuments: this.existingDocuments,
        }),
      )
    } else {
      const createRequest: CreateResidenceRequest = {
        name: formValue.name,
        description: formValue.description,
        address: formValue.address,
        totalApartments: formValue.totalApartments,
        availableApartments: formValue.availableApartments,
        startingPrice: formValue.startingPrice,
        amenities,
        managerId: formValue.managerId || undefined,
        contactInformation: formValue.contactInformation,
        status: formValue.status,
      }

      // Create document uploads
      const documentUploads: DocumentUpload[] = this.selectedDocuments

      // Dispatch create action with files
      this.store.dispatch(
        ResidenceActions.createResidenceWithFiles({
          residence: createRequest,
          images: this.selectedImages,
          documents: documentUploads,
        }),
      )
    }
  }

  // Form array getters
  get amenitiesFormArray(): FormArray {
    return this.residenceForm.get("amenities") as FormArray
  }

  // Form array methods
  addAmenity(): void {
    this.amenitiesFormArray.push(this.fb.control(""))
  }

  removeAmenity(index: number): void {
    if (this.amenitiesFormArray.length > 1) {
      this.amenitiesFormArray.removeAt(index)
    }
  }

  // // File handling methods
  // onImagesSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement
  //   if (input.files) {
  //     const files = Array.from(input.files)
  //     this.selectedImages = [...this.selectedImages, ...files]
  //   }
  // }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      // Générer toutes les URLs en une fois
      const newUrls = files.map(file => URL.createObjectURL(file));
      this.previewUrls = [...this.previewUrls, ...newUrls];

      this.selectedImages = [...this.selectedImages, ...files];
    }
  }
  onDocumentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      const files = Array.from(input.files)
      const newDocs = files.map((file) => ({
        name: file.name,
        file: file,
        type: file.type,
      }))
      this.selectedDocuments = [...this.selectedDocuments, ...newDocs]
    }
  }

  // removeImage(index: number): void {
  //   this.selectedImages.splice(index, 1)
  //   this.selectedImages = [...this.selectedImages]
  // }
  removeImage(index: number): void {
    // Libérer l'URL avant de supprimer
    URL.revokeObjectURL(this.previewUrls[index]);

    this.previewUrls.splice(index, 1);
    this.selectedImages.splice(index, 1);

    // Créer de nouvelles références pour déclencher la détection
    this.previewUrls = [...this.previewUrls];
    this.selectedImages = [...this.selectedImages];
  }

  removeDocument(index: number): void {
    this.selectedDocuments.splice(index, 1)
    this.selectedDocuments = [...this.selectedDocuments]
  }

  removeExistingImage(index: number): void {
    this.existingImageUrls.splice(index, 1)
    this.existingImageUrls = [...this.existingImageUrls]
  }

  removeExistingDocument(index: number): void {
    this.existingDocuments.splice(index, 1)
    this.existingDocuments = [...this.existingDocuments]
  }

  getImagePreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  onAddressChange(address: Partial<Address>): void {
    const addressGroup = this.residenceForm.get("address") as FormGroup;

    // Mettez à jour uniquement les champs existants
    Object.keys(address).forEach((key) => {
      const value = address[key as keyof Address];
      if (value !== undefined && value !== null) {
        addressGroup.get(key)?.setValue(value);
      }
    });

    // Ne forcez pas les valeurs manquantes
    this.currentAddress = {
      street: address.street ?? this.currentAddress?.street ?? '',
      city: address.city ?? this.currentAddress?.city ?? '',
      state: address.state ?? this.currentAddress?.state ?? '',
      postalCode: address.postalCode ?? this.currentAddress?.postalCode ?? '',
      country: address.country ?? this.currentAddress?.country ?? '',
      latitude: address.latitude ?? this.currentAddress?.latitude ?? null,
      longitude: address.longitude ?? this.currentAddress?.longitude ?? null,
      ...this.currentAddress,
      ...address // Spread operator gère automatiquement les champs
    };
  }

  // onAddressChange(address: Partial<Address>): void {
  //   const addressGroup = this.residenceForm.get("address") as FormGroup

  //   // Type-safe way to update address fields
  //   const addressKeys: (keyof Address)[] = [
  //     'street', 'city', 'state', 'postalCode', 'country', 'latitude', 'longitude'
  //   ]

  //   addressKeys.forEach(key => {
  //     // Only add/update if the value exists
  //     if (address[key] !== undefined) {
  //       addressGroup.get(key)?.setValue(address[key] ?? null)
  //     }
  //   })

  //   // Update currentAddress with type safety
  //   this.currentAddress = {
  //     ...this.currentAddress,
  //     street: address.street ?? this.currentAddress?.street ?? '',
  //     city: address.city ?? this.currentAddress?.city ?? '',
  //     state: address.state ?? this.currentAddress?.state ?? '',
  //     postalCode: address.postalCode ?? this.currentAddress?.postalCode ?? '',
  //     country: address.country ?? this.currentAddress?.country ?? '',
  //     latitude: address.latitude ?? this.currentAddress?.latitude ?? null,
  //     longitude: address.longitude ?? this.currentAddress?.longitude ?? null,
  //   }
  // }

  // Track by function for ngFor
  trackByIndex(index: number): number {
    return index
  }

  currentStep = 0;
  steps = ['Basic Information', 'Address', 'Images & Documents'];

  setStep(index: number): void {
    this.currentStep = index;
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}

