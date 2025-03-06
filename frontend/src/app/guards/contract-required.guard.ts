import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContractRequiredGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Vérifiez si le composant implémente correctement canDeactivate
    return component.canDeactivate ? component.canDeactivate() : true;
    
    // Supprimez toute référence à getUserRole() si elle existe ailleurs dans ce fichier
  }
}