import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Feature, FeatureCategory, FeatureType } from "../../../models/feature.model";

@Component({
  selector: "app-feature-card",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./feature-card.component.html",
})
export class FeatureCardComponent {
  @Input() feature!: Feature;
  @Input() isManager = false;
  @Output() delete = new EventEmitter<void>();

  categoryColors: Record<FeatureCategory, string> = {
    [FeatureCategory.LEISURE]: "bg-blue-100 text-blue-800",
    [FeatureCategory.WELLNESS]: "bg-purple-100 text-purple-800",
    [FeatureCategory.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
    [FeatureCategory.TRANSPORT]: "bg-indigo-100 text-indigo-800",
    [FeatureCategory.CLEANING]: "bg-cyan-100 text-cyan-800",
    [FeatureCategory.CATERING]: "bg-orange-100 text-orange-800",
    [FeatureCategory.EDUCATION]: "bg-lime-100 text-lime-800",
    [FeatureCategory.SECURITY]: "bg-red-100 text-red-800",
    [FeatureCategory.ENTERTAINMENT]: "bg-pink-100 text-pink-800",
    [FeatureCategory.SPORT]: "bg-green-100 text-green-800",
    [FeatureCategory.HEALTH]: "bg-rose-100 text-rose-800",
    [FeatureCategory.KIDS]: "bg-amber-100 text-amber-800",
    [FeatureCategory.BUSINESS]: "bg-slate-100 text-slate-800",
    [FeatureCategory.OTHER]: "bg-gray-100 text-gray-800",
  };

  categoryIcons: Record<FeatureCategory, string> = {
    [FeatureCategory.LEISURE]: "umbrella-beach",
    [FeatureCategory.WELLNESS]: "spa",
    [FeatureCategory.MAINTENANCE]: "tools",
    [FeatureCategory.TRANSPORT]: "car",
    [FeatureCategory.CLEANING]: "broom",
    [FeatureCategory.CATERING]: "utensils",
    [FeatureCategory.EDUCATION]: "book",
    [FeatureCategory.SECURITY]: "shield-alt",
    [FeatureCategory.ENTERTAINMENT]: "film",
    [FeatureCategory.SPORT]: "running",
    [FeatureCategory.HEALTH]: "heartbeat",
    [FeatureCategory.KIDS]: "child",
    [FeatureCategory.BUSINESS]: "briefcase",
    [FeatureCategory.OTHER]: "ellipsis-h",
  };

  getCategoryColor(category: FeatureCategory): string {
    return this.categoryColors[category] || "bg-gray-100 text-gray-800";
  }

  getCategoryIcon(category: FeatureCategory): string {
    return this.categoryIcons[category] || "question";
  }

  formatFeatureType(type: FeatureType): string {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  formatFeatureCategory(category: FeatureCategory): string {
    return category.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  onDelete(): void {
    this.delete.emit();
  }
}
