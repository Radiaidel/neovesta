import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { type Reservation, ReservationStatus } from "../../../models/reservation.model"

@Component({
    selector: "app-reservation-card",
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: "./reservation-card.component.html",
})
export class ReservationCardComponent {
  
    @Input() reservation!: Reservation
    @Input() isManager = false
    @Output() delete = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<{ id: string; scheduledDate: string }>()
    @Output() reject = new EventEmitter<{ id: string; adminNote: string }>()
    @Output() cancel = new EventEmitter<string>()

    ReservationStatus = ReservationStatus
    showConfirmForm = false
    showRejectForm = false
    scheduledDate = ""
    adminNote = ""

    onDelete(): void {
        this.delete.emit()
    }

    onConfirm(): void {
        if (this.scheduledDate) {
            this.confirm.emit({ id: this.reservation.id, scheduledDate: this.scheduledDate })
            this.showConfirmForm = false
            this.scheduledDate = ""
        }
    }

    onReject(): void {
        if (this.adminNote) {
            this.reject.emit({ id: this.reservation.id, adminNote: this.adminNote })
            this.showRejectForm = false
            this.adminNote = ""
        }
    }

    onCancel(): void {
        this.cancel.emit(this.reservation.id)
    }

    toggleConfirmForm(): void {
        this.showConfirmForm = !this.showConfirmForm
        this.showRejectForm = false
        if (this.showConfirmForm) {
            const requestedDate = new Date(this.reservation.requestedDate)
            this.scheduledDate = this.formatDateForInput(requestedDate)
        }
    }

    toggleRejectForm(): void {
        this.showRejectForm = !this.showRejectForm
        this.showConfirmForm = false
    }

    formatDate(dateString: string): string {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    formatDateForInput(date: Date): string {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    getStatusColor(status: ReservationStatus): string {
        switch (status) {
            case ReservationStatus.PENDING:
                return "bg-yellow-100 text-yellow-800"
            case ReservationStatus.CONFIRMED:
                return "bg-green-100 text-green-800"
            case ReservationStatus.REJECTED:
                return "bg-red-100 text-red-800"
            case ReservationStatus.CANCELLED:
                return "bg-gray-100 text-gray-800"
            case ReservationStatus.COMPLETED:
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    formatPrice(price: number): string {
        if (!price) return ""
        return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(price)
      }
    formatStatus(status: ReservationStatus): string {
        if (!status) return ""
        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
    }

    isPending(): boolean {
        if(this.reservation.status == ReservationStatus.PENDING)
            return true
        return false
    }

    getStatusTextColor(status: ReservationStatus): string {
        switch (status) {
          case ReservationStatus.PENDING:
            return "text-[#7B4D00]"
          case ReservationStatus.CONFIRMED:
            return "text-[#2E5931]"
          case ReservationStatus.REJECTED:
            return "text-[#7F2121]"
          case ReservationStatus.CANCELLED:
            return "text-[#424242]"
          case ReservationStatus.COMPLETED:
            return "text-[#0D47A1]"
          default:
            return "text-gray-800"
        }
      }
    
      getStatusDotColor(status: ReservationStatus): string {
        switch (status) {
          case ReservationStatus.PENDING:
            return "bg-[#FFB74D]"
          case ReservationStatus.CONFIRMED:
            return "bg-[#81C784]"
          case ReservationStatus.REJECTED:
            return "bg-[#E57373]"
          case ReservationStatus.CANCELLED:
            return "bg-[#9E9E9E]"
          case ReservationStatus.COMPLETED:
            return "bg-[#64B5F6]"
          default:
            return "bg-gray-500"
        }
      }
}

