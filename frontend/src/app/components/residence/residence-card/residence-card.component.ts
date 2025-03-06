import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import type { Residence, ResidenceStatus } from "../../../models/residence.model"

@Component({
  selector: 'app-residence-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './residence-card.component.html',
    
})
export class ResidenceCardComponent {
  @Input() residence!: Residence
  @Output() delete = new EventEmitter<void>()

  formatStatus(status: ResidenceStatus): string {
    return status.replace("_", " ")
  }

  onDelete(): void {
    this.delete.emit()
  }
}

