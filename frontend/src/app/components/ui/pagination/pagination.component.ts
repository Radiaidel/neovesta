import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between border-t border-[#E8E1D7] pt-6">
  <div class="text-sm text-[#6B7D86]">
    Page {{ currentPage + 1 }} of {{ totalPages }}
  </div>
  <div class="flex gap-1.5">
    <button 
      (click)="onPageChange(currentPage - 1)"
      [disabled]="isFirstPage"
      class="px-3 py-1.5 rounded-lg border border-[#E8E1D7] text-[#0A1C26] hover:bg-[#E8E1D7]/30 transition-colors disabled:opacity-40"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    
    @for (page of visiblePages; track page) {
      <button 
        (click)="onPageChange(page)"
        [class.bg-[#0A1C26]]="currentPage === page"
        [class.text-white]="currentPage === page"
        class="px-3.5 py-1.5 rounded-lg border border-[#E8E1D7] text-[#0A1C26] hover:bg-[#E8E1D7]/30 transition-colors"
      >
        {{ page + 1 }}
      </button>
    }
    
    <button 
      (click)="onPageChange(currentPage + 1)"
      [disabled]="isLastPage"
      class="px-3 py-1.5 rounded-lg border border-[#E8E1D7] text-[#0A1C26] hover:bg-[#E8E1D7]/30 transition-colors disabled:opacity-40"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 0
  @Input() totalPages = 0
  @Input() isFirstPage = true
  @Input() isLastPage = true
  @Output() pageChange = new EventEmitter<number>()

  get visiblePages(): number[] {
    const pages: number[] = []
    const maxVisiblePages = 5

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1)

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page)
    }
  }
}

