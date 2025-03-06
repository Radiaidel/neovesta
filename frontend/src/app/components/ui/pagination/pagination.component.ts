import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Page {{ currentPage + 1 }} of {{ totalPages }}
      </div>
      <div class="flex gap-2">
        <button 
          (click)="onPageChange(0)"
          [disabled]="isFirstPage"
          class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button 
          (click)="onPageChange(currentPage - 1)"
          [disabled]="isFirstPage"
          class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        @for (page of visiblePages; track page) {
          <button 
            (click)="onPageChange(page)"
            [class.bg-indigo-600]="currentPage === page"
            [class.text-white]="currentPage === page"
            [class.hover:bg-indigo-700]="currentPage === page"
            [class.border-indigo-600]="currentPage === page"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {{ page + 1 }}
          </button>
        }
        
        <button 
          (click)="onPageChange(currentPage + 1)"
          [disabled]="isLastPage"
          class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button 
          (click)="onPageChange(totalPages - 1)"
          [disabled]="isLastPage"
          class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
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

