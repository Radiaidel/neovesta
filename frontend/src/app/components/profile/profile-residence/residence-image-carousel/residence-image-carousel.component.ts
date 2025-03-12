import { Component, Input, OnInit } from '@angular/core';
import { Residence } from '../../../../models/residence.model'; // Adaptez votre modèle
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
  selector: 'app-residence-image-carousel',
    templateUrl: './residence-image-carousel.component.html',
})
export class ResidenceImageCarouselComponent implements OnInit {
    @Input() residence: any;
    activeImageIndex = 0;
  
    ngOnInit() {
      if (!this.residence?.imageUrls?.length) {
        this.residence.imageUrls = ['/assets/default-image.jpg'];
      }
    }
  
    setActiveImage(index: number): void {
      this.activeImageIndex = index;
    }
  
    nextImage(): void {
      this.activeImageIndex = 
        this.activeImageIndex === this.residence.imageUrls.length - 1 
          ? 0 
          : this.activeImageIndex + 1;
    }
  
    previousImage(): void {
      this.activeImageIndex = 
        this.activeImageIndex === 0 
          ? this.residence.imageUrls.length - 1 
          : this.activeImageIndex - 1;
    }
}