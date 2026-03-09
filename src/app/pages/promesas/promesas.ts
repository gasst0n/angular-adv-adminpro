import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  standalone: true,
  imports: [],
  templateUrl: './promesas.html',
  styles: ``,
})
export class Promesas implements OnInit {

  ngOnInit(): void {
    // Llama y loguea resultado/errores
    this.getUsuarios()
      .then(users => console.log('Usuarios:', users))
      .catch(err => console.error('Error getUsuarios:', err));
  }

  /**
   * Trae usuarios desde ReqRes usando API Key y maneja:
   * - 4xx/5xx
   * - Respuestas HTML (p.ej., challenge de Cloudflare)
   */
  async getUsuarios(): Promise<any[]> {
    const API_KEY = 'TU_API_KEY_AQUI'; // Mover a environment.ts en prod
    const url = 'https://reqres.in/api/users?page=2';

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'reqres_a22485d72f34420699062e6f9aba4bc1',                // <-- requerido por ReqRes
        'Accept': 'application/json',        // sugiere JSON
        'Content-Type': 'application/json',  // opcional para GET
        'Referer': 'https://reqres.in/',     // ayuda a parecer navegador
        'User-Agent': 'Mozilla/5.0',         // idem (algunos clientes lo ignoran)
      },
      // credentials: 'include', // NO aplica cross-origin con cookies de CF
    });

    // Si el servidor devolvió HTML (p.ej. challenge de Cloudflare), no intentes parsear como JSON
    const ctype = resp.headers.get('content-type') || '';
    if (!resp.ok) {
      // Lee texto para inspeccionar errores de API
      const text = await resp.text();
      // Pistas comunes:
      // - {"error":"missing_api_key"}  => faltó x-api-key
      // - HTML "Just a moment..."      => challenge de Cloudflare
      throw new Error(`HTTP ${resp.status} - ${text.substring(0, 300)}`);
    }
    if (!ctype.includes('application/json')) {
      // Probablemente challenge de Cloudflare (HTML)
      const text = await resp.text();
      throw new Error(`Respuesta no-JSON (posible challenge): ${text.substring(0, 300)}`);
    }

    const data = await resp.json();
    // La forma típica de respuesta de ReqRes: { data: [...] }
    return Array.isArray(data?.data) ? data.data : [];
  }
}