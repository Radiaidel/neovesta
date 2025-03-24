import { Component, HostListener, type OnDestroy, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, CanDeactivate, Router, RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import { type Observable, Subject, takeUntil } from "rxjs"
import { ContractType, PaymentFrequency, PaymentMethod } from "../../../models/contract.model"
import { Role } from "../../../models/user.model"
import { AuthService } from "../../../services/auth.service"
import { ResidenceService } from "../../../services/residence.service"
import { UserService } from "../../../services/user.service"
import * as ContractActions from "../../../store/contract/contract.actions"
import { selectContractLoading, selectSelectedContract } from "../../../store/contract/contract.selectors"
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component"
import { HeaderComponent } from "../../shared/header/header.component";
import { CanComponentDeactivate } from "../../../guards/contract-required.guard"

@Component({
    selector: "app-contract-form",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent, HeaderComponent],
    templateUrl: `./contract-form.component.html`
})
export class ContractFormComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    private fb = inject(FormBuilder)
    private store = inject(Store)
    private route = inject(ActivatedRoute)
    private authService = inject(AuthService)
    private userService = inject(UserService)
    private residenceService = inject(ResidenceService)
    private destroy$ = new Subject<void>()

    loading$: Observable<boolean> = this.store.select(selectContractLoading)

    contractForm: FormGroup
    isEditMode = false
    contractId: string | null = null
    residentIdFromRoute: string | null = null
    formErrors: Record<string, string> = {}
    isSubmitting = false
    isFormDirty = false;
    residents: any[] = []
    residences: any[] = []

    ContractType = ContractType
    PaymentFrequency = PaymentFrequency
    PaymentMethod = PaymentMethod

    constructor() {
        this.contractForm = this.createForm()
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const id = params.get("id")
            if (id && id !== "new") {
                this.isEditMode = true
                this.contractId = id
                this.store.dispatch(ContractActions.loadContract({ id }))
                this.store.select(selectSelectedContract)
                .pipe(takeUntil(this.destroy$))
                .subscribe(contract => {
                  if (contract) {
                    this.contractForm.patchValue({
                      ...contract,
                      residentId: contract.residentId,        
                      residenceId: contract.residenceId,    
                      startDate: this.formatDate(contract.startDate),
                      endDate: this.formatDate(contract.endDate)
                    });
                    
                    if (this.residentIdFromRoute) {
                      this.contractForm.get('residentId')?.disable();
                    }
                    
                    this.contractForm.markAsPristine();
                  }
                });
            }

            this.residentIdFromRoute = params.get("residentId")
            if (this.residentIdFromRoute) {
                this.contractForm.patchValue({ residentId: this.residentIdFromRoute })
                this.contractForm.get("residentId")?.disable()
            }
        })

        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const residentId = params["residentId"]
            if (residentId) {
                this.contractForm.patchValue({ residentId: residentId })
                this.contractForm.get("residentId")?.disable()
                this.residentIdFromRoute = residentId
            }
        })

        this.loadResidents()
        this.loadResidences()

        this.contractForm.valueChanges.subscribe(() => {
            this.isFormDirty = this.contractForm.dirty;
        });
        this.contractForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.validateForm()
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
        if (this.contractForm.dirty) {
            $event.returnValue = true;
        }
    }

    canDeactivate(): boolean | Observable<boolean> {
        if (this.contractForm.dirty && !this.isSubmitting) {
            return confirm('Voulez-vous vraiment quitter sans sauvegarder les modifications ?');
        }
        return true;
    }
    createForm(): FormGroup {
        return this.fb.group({
            residentId: [null, [Validators.required]],
            residenceId: [null, [Validators.required]],
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]],
            contractType: [ContractType.LEASE, [Validators.required]],
            totalAmount: [null, [Validators.required, Validators.min(0)]],
            paidAmount: [0, [Validators.required, Validators.min(0)]],
            paymentFrequency: [PaymentFrequency.MONTHLY, [Validators.required]],
            paymentMethod: [PaymentMethod.BANK_TRANSFER, [Validators.required]],
            contractRules: [""],
        })
    }

    validateForm(): void {
        this.formErrors = {}
        const form = this.contractForm

        if (form.get("residentId")?.invalid && form.get("residentId")?.errors?.["required"]) {
            this.formErrors["residentId"] = "Resident is required"
        }

        if (form.get("residenceId")?.invalid && form.get("residenceId")?.errors?.["required"]) {
            this.formErrors["residenceId"] = "Residence is required"
        }

        if (form.get("startDate")?.invalid && form.get("startDate")?.errors?.["required"]) {
            this.formErrors["startDate"] = "Start date is required"
        }

        if (form.get("endDate")?.invalid && form.get("endDate")?.errors?.["required"]) {
            this.formErrors["endDate"] = "End date is required"
        }

        if (form.get("contractType")?.invalid && form.get("contractType")?.errors?.["required"]) {
            this.formErrors["contractType"] = "Contract type is required"
        }

        if (form.get("totalAmount")?.invalid) {
            if (form.get("totalAmount")?.errors?.["required"]) {
                this.formErrors["totalAmount"] = "Total amount is required"
            } else if (form.get("totalAmount")?.errors?.["min"]) {
                this.formErrors["totalAmount"] = "Total amount must be at least 0"
            }
        }

        if (form.get("paidAmount")?.invalid) {
            if (form.get("paidAmount")?.errors?.["required"]) {
                this.formErrors["paidAmount"] = "Paid amount is required"
            } else if (form.get("paidAmount")?.errors?.["min"]) {
                this.formErrors["paidAmount"] = "Paid amount must be at least 0"
            }
        }

        if (form.get("paymentFrequency")?.invalid && form.get("paymentFrequency")?.errors?.["required"]) {
            this.formErrors["paymentFrequency"] = "Payment frequency is required"
        }

        if (form.get("paymentMethod")?.invalid && form.get("paymentMethod")?.errors?.["required"]) {
            this.formErrors["paymentMethod"] = "Payment method is required"
        }

        const startDate = form.get("startDate")?.value
        const endDate = form.get("endDate")?.value
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            this.formErrors["endDate"] = "End date must be after start date"
        }

        const totalAmount = form.get("totalAmount")?.value
        const paidAmount = form.get("paidAmount")?.value
        if (totalAmount !== null && paidAmount !== null && paidAmount > totalAmount) {
            this.formErrors["paidAmount"] = "Paid amount cannot be greater than total amount"
        }
    }

    loadResidents(): void {
        this.userService.getAllUsers(0, 100).subscribe((response) => {
            this.residents = response.content.filter(user => user.role === Role.RESIDENT)
        })
    }

    loadResidences(): void {
        const currentUser = this.authService.getCurrentUser()
        if (currentUser) {
            if (currentUser.role === Role.RESIDENCE_MANAGER) {
                this.residenceService.getResidenceByManager(currentUser.id).subscribe((residence) => {
                    this.residences = [residence]
                    this.contractForm.patchValue({ residenceId: residence.id })
                })
            } else if (currentUser.role === Role.SUB_RESIDENCE_MANAGER && currentUser.managerId) {
                this.residenceService.getResidenceByManager(currentUser.managerId).subscribe((residence) => {
                    this.residences = [residence]
                    this.contractForm.patchValue({ residenceId: residence.id })
                })
            } else {
                this.residenceService
                    .getAllResidences({ page: 0, size: 100, sortBy: "name", sortDir: "asc" })
                    .subscribe((response) => {
                        this.residences = response.content
                    })
            }
        }
    }

    onSubmit(): void {
        if (this.contractForm.invalid) {
            this.validateForm()
            return
        }

        this.isSubmitting = true;
        this.contractForm.markAsPristine();

        const formValue = this.contractForm.getRawValue() 

        if (this.isEditMode && this.contractId) {
            this.store.dispatch(
                ContractActions.updateContract({
                    id: this.contractId,
                    contract: formValue,
                }),
            )
        } else {
            this.store.dispatch(
                ContractActions.createContract({
                    contract: formValue,
                }),
            )
        }
    }
    private formatDate(date: string | Date): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      }
    
}

