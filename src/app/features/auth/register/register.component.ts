import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxIntlTelInputModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  

  readonly roles = [
    { value: 'CANDIDAT', label: 'Candidat', description: 'Inscription aux examens' },
    { value: 'SURVEILLANT', label: 'Surveillant', description: 'Surveillance des salles' },
    { value: 'RESPONSABLE', label: 'Responsable', description: 'Gestion d\'un centre' },
    { value: 'ADMIN', label: 'Administrateur', description: 'Accès complet au système' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [null],
      role: ['CANDIDAT', Validators.required],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nom() { return this.registerForm.get('nom')!; }
  get prenom() { return this.registerForm.get('prenom')!; }
  get email() { return this.registerForm.get('email')!; }
  get telephone() { return this.registerForm.get('telephone')!; }
  get role() { return this.registerForm.get('role')!; }
  get motDePasse() { return this.registerForm.get('motDePasse')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = { ...this.registerForm.value };
    if (!payload.telephone) delete payload.telephone;

    this.authService.register(payload).subscribe({
      next: (user: { role: string }) => {
        this.isLoading = false;
        const roleRoutes: Record<string, string> = {
          ADMIN: '/admin/dashboard',
          RESPONSABLE: '/responsable/dashboard',
          SURVEILLANT: '/surveillant/dashboard',
          CANDIDAT: '/candidat/dashboard'
        };
        this.router.navigate([roleRoutes[user.role] ?? '/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}