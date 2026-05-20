import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultatService {
  private apiUrl = `${environment.apiUrl}/resultats`; // ex: http://localhost:5000/api/v1/resultats

  constructor(private http: HttpClient) { }

  // Appeler l'Aggregation Pipeline pour le tableau de bord
  getStatistiquesNationales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistiques`);
  }

  // Le fameux bouton rouge pour déverrouiller les résultats
  publierResultats(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/publier-tout`, {});
  }
}