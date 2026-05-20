import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Appel à ton API Express pour se connecter
  login(credentials: { email: string, mdp: string }) {
    return this.http.post<{ token: string, role: string }>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem('jwt_token', res.token);
          localStorage.setItem('user_role', res.role);
        })
      );
  }

  // Appel à ton API Express pour s'inscrire
  register(data: { nom: string, prenom: string, email: string, telephone?: string, role: string, motDePasse: string }) {
    return this.http.post<{ role: string }>(`${environment.apiUrl}/auth/register`, data);
  }

  // Déconnexion et suppression du token
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Récupère le token JWT depuis localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Vérifie si l'utilisateur a un token (pour le Guard)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // Récupère les informations de l'utilisateur actuel
  get currentUser() {
    return {
      token: localStorage.getItem('jwt_token'),
      role: localStorage.getItem('user_role')
    };
  }
}