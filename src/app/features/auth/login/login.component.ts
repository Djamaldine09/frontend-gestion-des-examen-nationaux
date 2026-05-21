import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  loginWithGoogle(): void {
    // 1. Ouvre le popup Google
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      
      // 2. Récupère le jeton sécurisé de Google
      const googleToken = user.idToken;

      // 3. Envoie le jeton à ton backend Express
      this.http.post('http://localhost:3000/api/auth/google', { token: googleToken })
        .subscribe({
          next: (response: any) => {
            // 4. Succès ! Ton backend a renvoyé ton JWT
            localStorage.setItem('token', response.jwt);
            console.log('Connexion réussie au système national !');
            // Redirection vers le tableau de bord...
          },
          error: (err) => console.error('Erreur backend', err)
        });
    });
  }

  loginWithFacebook(): void {
    console.log('Redirection vers Facebook Auth...');
    // Logique d'authentification Facebook
  }

  loginWithPhone(): void {
    console.log('Ouverture du composant de connexion par SMS...');
    // Redirection vers une route ou ouverture d'un modal pour le téléphone
  }



  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get motDePasse() { return this.loginForm.get('motDePasse')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Redirection selon le rôle
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