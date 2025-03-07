import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { PaymentStatus, type Subscription, SubscriptionType } from "../../../models/subscription.model"

@Component({
  selector: "app-subscription-card",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./subscription-card.component.html",
})
export class SubscriptionCardComponent {
  @Input() subscription!: Subscription
  @Input() isManager = false
  @Output() delete = new EventEmitter<void>()
  @Output() confirm = new EventEmitter<{ id: string; adminNote: string }>()
  @Output() refuse = new EventEmitter<{ id: string; adminNote: string }>()
  @Output() updatePayment = new EventEmitter<{ id: string; status: string }>()

  PaymentStatus = PaymentStatus
  SubscriptionType = SubscriptionType

  showConfirmForm = false
  showRefuseForm = false
  showPaymentForm = false
  adminNote = ""
  selectedPaymentStatus = ""

  onDelete(): void {
    this.delete.emit()
  }

  onConfirm(): void {
    if (this.adminNote) {
      this.confirm.emit({ id: this.subscription.id, adminNote: this.adminNote })
      this.showConfirmForm = false
      this.adminNote = ""
    }
  }

  onRefuse(): void {
    if (this.adminNote) {
      this.refuse.emit({ id: this.subscription.id, adminNote: this.adminNote })
      this.showRefuseForm = false
      this.adminNote = ""
    }
  }

  onUpdatePayment(): void {
    if (this.selectedPaymentStatus) {
      this.updatePayment.emit({ id: this.subscription.id, status: this.selectedPaymentStatus })
      this.showPaymentForm = false
      this.selectedPaymentStatus = ""
    }
  }

  toggleConfirmForm(): void {
    this.showConfirmForm = !this.showConfirmForm
    this.showRefuseForm = false
    this.showPaymentForm = false
  }

  toggleRefuseForm(): void {
    this.showRefuseForm = !this.showRefuseForm
    this.showConfirmForm = false
    this.showPaymentForm = false
  }

  togglePaymentForm(): void {
    this.showPaymentForm = !this.showPaymentForm
    this.showConfirmForm = false
    this.showRefuseForm = false
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  formatSubscriptionType(type: SubscriptionType): string {
    if (!type) return ""
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  formatPaymentStatus(status: PaymentStatus): string {
    if (!status) return ""
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  getPaymentStatusColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-800"
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800"
      case PaymentStatus.REFUNDED:
        return "bg-blue-100 text-blue-800"
      case PaymentStatus.CANCELLED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}

