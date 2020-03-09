import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstanciaService {

  //Dirección Get para servicios en la página WEB
  urlGet = '';

  //Contructor
  constructor(protected http: HttpClient) {
    this.urlGet = environment.Url;  
  }

  //Obtener Constancia para los afiliados Activos
  getConstanciaAfiliacion(id : string): any {
    return this.http.get<any>(this.urlGet + 'militar/' + id);
  }

  //Obtener Netos
  getNetos(id : string): any {
    return this.http.get<any>(this.urlGet + 'pensionado/consultarneto/' + id);
  }

  //Obtener Netos Sobrevientes
  getNetosSobreviviente(id : string, tit: string): any  {
    return this.http.get<any>(this.urlGet + 'pensionado/consultarsobreviviente/' + id + '/' + tit);
  }

  //Obtener Pensionados
  getPension(id: string): any{    
    return this.http.get<any>(this.urlGet + 'pensionado/calculo/' + id);
  }

  //Fideicomiso PACE
  getFideicomiso(id: string ): any{
    return this.http.get(this.urlGet + 'pace/consultarbeneficiario/' + id);
  }
  //Conceptos 
  getConceptos(): any{    
    return this.http.get<any>(this.urlGet + 'nomina/conceptos/listar/');
  }

  //Constancia AR-C
  getConstaciARC(obj): any{    
    return this.http.post<any>(this.urlGet + 'pensionado/calcularretroactivo', obj);
  }
}
