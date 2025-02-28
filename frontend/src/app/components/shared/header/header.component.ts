// header.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Role, User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  dropdownOpen = false;
  mobileMenuOpen = false;
 
  constructor(private authService: AuthService) {}
 
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }
 
  get isAdminOrSuperAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN || this.currentUser?.role === Role.SUPER_ADMIN;
  }
 
  get isManagerOrSubManager(): boolean {
    return this.currentUser?.role === Role.RESIDENCE_MANAGER || this.currentUser?.role === Role.SUB_RESIDENCE_MANAGER;
  }
 
  get isResidentOrManagerOrSubManager(): boolean {
    return [Role.RESIDENT, Role.RESIDENCE_MANAGER, Role.SUB_RESIDENCE_MANAGER].includes(this.currentUser?.role!);
  }
 
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.mobileMenuOpen = false;
    }
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.dropdownOpen = false;
    }
  }
 
  getInitials(): string {
    if (this.currentUser && this.currentUser.firstName && this.currentUser.lastName) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
    }
    return 'NU'; // No User fallback
  }
 
  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
  }
}