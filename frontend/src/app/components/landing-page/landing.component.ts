import { Component } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'landing-app-landing',
  standalone: true,
  imports: [ FooterComponent , HeaderComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
   
}
