import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { ConstanciaService } from '../../../servicios/util/constancia.service';
import { UtilidadesService } from '../../../servicios/util/utilidades.service';
import { LoginService } from '../../../servicios/security/login.service';
import { NbThemeService, NbDialogService, NbToastrService } from '@nebular/theme';
import {NgxPrintModule} from 'ngx-print';
import * as $ from 'jquery';
import { format } from 'path';
import { formatCurrency } from '@angular/common';


@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html',
})


export class StatusCardComponent implements OnDestroy  {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;
  currentTheme: string;
  themeSubscription: any;
  
  users: any = {};
  loading = false;
  loadingaut = false;
  loadingc = false;
  loadingru = false;
  loadingsol = false;
  loadingpen = false;
  loadingmed = false;
  loadingnet = false;
  loadingrepor = false;
  loadingarc = false;
  

  isHmed = true;
  isHidden: boolean = true;
  isHc: boolean = true;
  isHpen: boolean = true;
  isHpens: boolean = true;
  isHpensob: boolean = true; // Pension de sobreviviente

  isHfide: boolean = true;
  isHru: boolean = true;
  isHsol: boolean = true;
  isHinet: boolean = true;
  
  isHRerpote = true;
  isHRerpoteSob = true;
  netos : any;
  isafi = false;
  ispen = false;
  isafipen = false;
  isHHR = 'none';
  wLtsConceptos = [];
  lstNetos = [];
  lstNetosFamiliar = [];
  pos = 0;

  //FORMATO AR-C
  ArcPorcentaje = 0
  ArcAguinaldo = 0
  CabeceraFamiliar = ''
  Militar: any = {}
  ArcFamiliar = "";
  Meses = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

  constructor(
      private themeService: NbThemeService, 
      protected constanciaService: ConstanciaService, 
      protected utlidad: UtilidadesService,
      private loginService: LoginService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService, ) { 
    
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
    var usr = this.loginService.getUserDecrypt();
    //console.log(usr.WUsuario);
    
    if ( usr.WUsuario.titular != undefined  ){
      this.isafi = true;
      this.isafipen = true;
    }else if(usr.WUsuario.sobreviviente != undefined ){
      this.ispen = true;
      this.isafipen = false;
      
    }
    if ( usr.WUsuario.situacion != "ACT"  ){
      this.isafi = false;
      this.isafipen = true;
      this.ispen = true;
    }

    if(usr.WUsuario.sobreviviente != undefined ){
      this.isafipen = false;      
    }
    
  }

  GenerarAutorizacion(){
    // this.loadingaut = true;
    this.loadingaut = false;
    this.isHmed = false; 
  }

  ngOnInit() {
    this.constanciaService.getConstanciaAfiliacion('11953710')
    .subscribe(
      (data) => { // Success
        this.users = data;
        switch (this.users) {
          case "ACT":
            
            break;
        
          default:

            break;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  open(dialog : TemplateRef<any>) {
    this.dialogService.open(dialog, { context: {
        title: 'Registro Ipsfa en linea',
      }, });
  }

  putId(id: string, val):any{
    document.getElementById(id).innerText = val;
  }
  
  putIdHtml(id: string, shtml : string):any{
    document.getElementById(id).innerHTML = shtml;
  }

  obtenerDescripcionConceptos(id){
    var concepto = "";    
    for (let i = 0; i < this.wLtsConceptos.length; i++) {
        var e = this.wLtsConceptos[i];
        if( e.codigo == id ){
            concepto = e.descripcion;
            return concepto;
        }
    }
    return concepto;
  }

  GenerarConstanciaAfiliacion(){
    var usr = this.loginService.getUserDecrypt();
    this.loadingc = true;
    this.constanciaService.getConstanciaAfiliacion(usr.WUsuario.cedula).subscribe(
      (data) => {        
        var gradoPI = 'GENERAL DE DIVISIÓN';
        var nombrePI = 'RENIER ENRIQUE URBÁEZ FERMÍN';
        var clascat = this.utlidad.GenerarCategoria(data.categoria) + " / " + this.utlidad.GenerarClasificacion(data.clase);
        var DB = data.Persona.DatoBasico;
        
        this.putId("lblgradoPI", gradoPI);
        this.putId("lblgradoMil", data.Grado.descripcion);
        this.putId("lblnombreMil", DB.apellidoprimero + " " + DB.nombreprimero);
        this.putId("lblcedulaMil", data.id);
        this.putId("lbledoCivilM", this.utlidad.GenerarEstadoCivil(DB.estadocivil, DB.sexo));
        this.putId("lblfchNacMil", this.utlidad.ConvertirFechaHumana(DB.fechanacimiento));
        //this.putId("lbldireccionMil", DB.data.Persona.DatoBasico.direccion);
        this.putId("lblfchUltAscenso", this.utlidad.ConvertirFechaHumana(data.fascenso));
        this.putId("lblfchIngresoFANB", this.utlidad.ConvertirFechaHumana(data.fingreso));
        this.putId("lblsituacionMil", this.utlidad.GenerarSituacionMilitar(data.situacion));
        this.putId("lblclascat", clascat);
        this.putId("lblaServicio", data.tiemposervicio);
        this.putId("lblcomponente", this.utlidad.GenerarComponente(data.Componente.abreviatura));
        var cab = `<table class="table-fondo " cellspacing="0" width="100%" id="tblConstFamiliares" style="border: 1px solid #CCC; 
        line-height: 14px; 
        font-size: 12px;" >
        <thead>
          <tr class="titulo_tabla table-borderedtd" >
            <th>APELLIDOS Y NOMBRES</th>
            <th class="alinear_tddatos">CÉDULA</th>
            <th class="alinear_tddatos">PARENTESCO</th>
            <th class="alinear_tddatos">FECHA NAC.</th>
            <th class="alinear_tddatos">ESTATUS</th>
          </tr>
        </thead ><tbody id="_contenidoFamiliares">`;
        var cuerpo = '' ;
        data.Familiar.forEach(prs => {          
          var DF = prs.Persona.DatoBasico;
          var situacion = "ACTIVO";
          if (prs.beneficio != true ) {
              situacion = "INACTIVO"
          }
          var anof = parseInt(DF.fechadefuncion.substring(0,4));

          if (anof > 1){
              situacion = "FALLECIDO"
          }
          cuerpo += `<tr>
              <td>${DF.apellidoprimero + " " + DF.nombreprimero}</td>
              <td>${DF.cedula}</td>
              <td>${this.utlidad.GenerarParentesco(prs.parentesco,DF.sexo,DF.estadocivil)}</td>
              <td>${this.utlidad.ConvertirFechaHumana(DF.fechanacimiento)}</td>
              <td>${situacion}</td>
              </tr>`;
        });

        var tabla = cab + cuerpo + `</tbody></table>`;
        this.putIdHtml("_tblConstFamiliares", tabla);        
        this.putId("lblfchActual", this.utlidad.ConvertirFechaActual());
        this.putId("lblgradoPI", gradoPI);
        //this.putId("lblnombrePI", nombrePI);
       // this.putId("lblgradoPIF", gradoPI);

        this.loadingc = false;
        this.isHc = false; 
      },
        (error) => {
          console.error(error)
        }
      );
  }

  GenerarHojaRuta(){
    var usr = this.loginService.getUserDecrypt();
    console.log(usr.WUsuario.cedula);
    this.loadingru = true;
    this.constanciaService.getConstanciaAfiliacion(usr.WUsuario.cedula).subscribe(
      (data) => {
        console.log(data);
        var DB = data.Persona.DatoBasico;
        this.putId("hrgrado",data.Grado.descripcion);
        this.putId("hrcedula",DB.cedula);
        this.putId("hrnombre",DB.apellidoprimero + " " + DB.nombreprimero);
        this.putId("hrcomponente",this.utlidad.GenerarComponente(data.Componente.abreviatura));
        this.putId("hrtiempoServicio", data.tiemposervicio);
        this.loadingru = false;
        this.isHru = false; 
      },
        (error) => {
          console.error(error)
        }
      );
  }

  GenerarSolvencia(){
    var usr = this.loginService.getUserDecrypt();
    console.log(usr.WUsuario.cedula);
    this.loadingsol = true;
    this.constanciaService.getConstanciaAfiliacion(usr.WUsuario.cedula).subscribe(
      (data) => {
        console.log(data);
        var DB = data.Persona.DatoBasico;
        this.putId("solvGrado",data.Grado.descripcion);
        this.putId("solvCedula",DB.cedula);
        this.putId("hsapelidosNombre",DB.apellidoprimero + " " + DB.nombreprimero);
        this.putId("solvComponente",this.utlidad.GenerarComponente(data.Componente.abreviatura));
        this.putId("solvtiempoServicio", data.tiemposervicio);

        this.loadingsol = false;
        this.isHsol = false; 
      },
        (error) => {
          console.error(error)
        }
      );
  }

  obtenerFideicomiso(){
    this.constanciaService.getFideicomiso('11953710')
    .subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error)
      }
    );
  }
  
  GenerarConstanciaPension(position, status){
    this.loadingpen = true;
    var usr = this.loginService.getUserDecrypt();

    if( usr.WUsuario.sobreviviente != undefined ) { //si exiten sobrevivientes
      if (sessionStorage.getItem("id") == undefined ) { 
        this.toastrService.show(
          'Debe seleccionar un sobreviviente',
          `Ipsfa en línea`,
          { position, status }
        );
        this.loadingpen = false;
      }else{ //En el caso de que los sobrevivientes existen
        this.constanciaService.getConstanciaAfiliacion( sessionStorage.getItem("id") ).subscribe(
          (data) => {
            this.cargarCPensionSobreviviente(usr, data);
          }, 
          (error) => {
            console.error(error)
          }
        );
      }
    }else{
      
      this.constanciaService.getConstanciaAfiliacion(usr.WUsuario.cedula).subscribe(
        (data) => {
          this.cargarCPension(usr, data);
          
        }, 
        (error) => {
          console.error(error)
        }
      );
    }
  }

  GenerarNetos(dialog){
    this.loadingnet = true;
    var usr = this.loginService.getUserDecrypt();
    if( usr.WUsuario.sobreviviente != undefined ) {
      var cedulafam = usr.WUsuario.cedula;
      var titular = sessionStorage.getItem("id");
      this.constanciaService.getNetosSobreviviente(titular, cedulafam)
      .subscribe(
        (data) => {
          this.lstNetos = data;
          console.log( this.lstNetos );

          this.constanciaService.getConceptos().subscribe(
            (data) => {
              this.wLtsConceptos = data;
              this.loadingnet = false;
              this.isHinet = false;
              
              this.open(dialog);

            },(error) => {
              console.error(error);
              this.loadingnet = false;
              this.isHinet = false;
            }
          );

        },(error) => {
          console.error(error);
          this.loadingnet = false;
          this.isHinet = false;
        }
      );
    }else{
      this.constanciaService.getNetos(usr.WUsuario.cedula)
      .subscribe(
        (data) => {
          this.lstNetos = data;
          this.constanciaService.getConceptos()
          .subscribe(
            (data) => {
              this.wLtsConceptos = data;
              this.loadingnet = false;
              this.isHinet = false;              
              this.open(dialog);
            },(error) => {
              console.error(error);
              this.loadingnet = false;
              this.isHinet = false;
            }
          );

        
        },
        (error) => {
          console.error(error);
          this.loadingnet = false;
          this.isHinet = false;
        }
      );
    } //fin de lo contrario sobreviviente
    
    
  }

  generarReporte(event, position, status){
    var usr = this.loginService.getUserDecrypt();
    this.loadingc = true;
   


    if( usr.WUsuario.sobreviviente != undefined ) { //si exiten sobrevivientes
      if (sessionStorage.getItem("id") == undefined ) {         
        this.toastrService.show(
          'Debe seleccionar un sobreviviente',
          `Ipsfa en línea`,
          { position, status }
        );
        this.loadingc = false;

      }else{ //En el caso de que los sobrevivientes existen
        this.cargarNetoSobreviviente(event, usr);
      }
    }else{
      this.cargarNeto(event, usr);
    }


  }

  cargarNeto(event, usr){
    this.constanciaService.getConstanciaAfiliacion(usr.WUsuario.cedula).subscribe(
      (data) => {
        //console.log(data);
        var DB = data.Persona.DatoBasico;
        var grado = data.Grado.abreviatura;
        var nombre = DB.apellidoprimero + " " + DB.nombreprimero;
        var cedula = data.id;
        var porcentaje = data.Pension.pprestaciones;
        var pos = event.target.value;
        var pension = 0.00;
        var titulo = this.lstNetos[pos];
        console.log(titulo);
        var obj = JSON.parse(this.lstNetos[pos].calculos).conceptos;
			  
        var nomina =  titulo.nomina + " - " + titulo.mes;
        this.putIdHtml("titulopension", nomina);
        var fchpension = "DESDE " + titulo.desde + " HASTA " + titulo.hasta; 
        this.putIdHtml("fechapension", fchpension);
        var fila = '';
        var asignacion = 0.00;
        var deduccion = 0.00;
        var total = 0;
        var objNeto = [];
        var totalAsignacion = 0;

        for(var i=0; i< obj.length; i++){
          var monto = obj[i].mont;
              var tipo = obj[i].tipo;
              var des = obj[i].desc.replace("_", " ").toUpperCase();
              var lbl =  obj[i].desc;        
              var montostr = monto;
              objNeto[lbl] = parseFloat(monto);
              //var grado = $("#cmbgrado option:selected").text();
              var amcuenta = this.utlidad.AMCuentaBancaria(data.Persona.DatoFinanciero[0].cuenta);
          if(tipo == 97){      
                 
                  totalAsignacion += monto;
                  fila += `
                      <tr>
                          <td align="left">&nbsp;&nbsp;${des}</td>
                          <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
                          <td align="right"></td>
                          <td align="right" style="width:200px"></td>
                      </tr>`;
                  
          }else{
                  if( des == "SUELDO MENSUAL" ){
                      var tasig = totalAsignacion;
                      fila += `
                      <tr>
                          <td align="left">&nbsp;&nbsp;SUBTOTAL</td>
                          <td align="right" style="width:200px"><b>${tasig}</b>&nbsp;&nbsp;</td>
                          <td align="right"></td>
                          <td align="right" style="width:200px"></td>
                      </tr>
                      <tr>
                          <td align="left">&nbsp;&nbsp;</td>
                          <td align="right" style="width:200px"></td>
                          <td align="right"></td>
                          <td align="right" style="width:200px"></td>
                      </tr>`;
                      
                  }
                  if(tipo == 1){ //Asignacion   
                      var sueldomensual = this.obtenerDescripcionConceptos(des)==""?des:this.obtenerDescripcionConceptos(des); 
                      if( des == "SUELDO MENSUAL" ){
                          sueldomensual = `SUELDO MENSUAL ( ${porcentaje} % )`;                    
                      } 
                      fila += `
                          <tr>
                              <td align="left">&nbsp;&nbsp;${sueldomensual}</td>
                              <td align="right"></td>
                              <td align="right" style="width:200px">${ montostr }&nbsp;&nbsp;</td>
                              <td align="right" style="width:200px"></td>
                          </tr>`;
                      asignacion += monto;
                  }else if(tipo == 33){ //Asignacion
                      var retroactivos = this.obtenerDescripcionConceptos(des)==""?des:this.obtenerDescripcionConceptos(des); 
                      fila += `
                          <tr>
                              <td align="left">&nbsp;&nbsp;${retroactivos}</td>
                              <td align="right"></td>
                              <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
                              <td align="right" style="width:200px"></td>
                          </tr>`;
                      asignacion += monto;
                  }else{ //Deduccion
                      //console.log("0000 DE " + des);
                      var strconceptos = this.obtenerDescripcionConceptos(des)==""?des:this.obtenerDescripcionConceptos(des);
                      fila += `
                          <tr>
                              <td align="left">&nbsp;&nbsp;${strconceptos}</td>
                              <td align="right"></td>
                              <td align="right"></td>
                              <td align="right" style="width:200px">${ montostr }&nbsp;&nbsp;</td>
                          </tr>`;
                      deduccion += monto;
                  }
              }
              
        }
        fila += `<tr>
                    <td align="right" colspan='2'>TOTAL&nbsp;&nbsp;</td>
                    <td align="right" style="width:200px">${ this.utlidad.FormatoMoneda( asignacion ) }&nbsp;&nbsp;</td>
                    <td align="right" style="width:200px">${ this.utlidad.FormatoMoneda( deduccion )}&nbsp;&nbsp;</td>
                </tr>`;
        var neto = asignacion - deduccion;
        //console.log(fila);
        var contHTML = `<table style="width:800px" class="tablaneto">
              <tr>
                    <td align="center"><b>GRADO</b><BR>${grado}</td>
                    <td colspan="2" align="center"><b>APELLIDOS Y NOMBRES</b><BR><label id="nombre">${nombre}</label></td>
                    <td align="center"><b>N° DE CEDULA</b><BR><label id="cedula">${cedula}</cedula></td>
                </tr>
                <tr>
                    <td align="center"><b>CUENTA BANCARIA</b><BR>${amcuenta}</td>
                    <td align="left" colspan="4"></td>
                </tr>
            </table>
            <BR><BR>
            <table style="width:800px" class="tablaneto">
                <thead>
                    <tr>
                        <th align="center" style="width:440px">CONCEPTO</th>
                        <th align="center" style="width:120px">CALCULOS</th>
                        <th align="center" style="width:120px">ASIGNACIONES</th>
                        <th align="center" style="width:120px">DEDUCCIONES</th>
                    </tr>
                </thead>
                <tbody id="ltsConceptos">
                ${fila}
                </tbody>
                <tfoot>
                    <tr>
                        <th align="center" colspan="4" 
                        style="font-size:19px">
                        <br>NETO A COBRAR <br><b> &nbsp;&nbsp; ${neto}&nbsp;&nbsp;</b></th>
                    </tr>
                </tfoot>
            </table>
            <br>
            <h3> IPSFA EN CONTACTO
            <table style="width:800px" class="tablaneto">
                <tr>
                    <td align="center" style="width:800px;height: 80px"></td>                        
                </tr>
            </table>`;
          this.putIdHtml("contenidoNeto", contHTML);
         
          this.loadingrepor = false;
          this.isHRerpote = false;

      },
      (error) => {
        console.error(error);
        this.loadingnet = false;
        this.isHinet = false;
      }
    );
  }


  cargarNetoSobreviviente(event, usr){
    this.constanciaService.getConstanciaAfiliacion(sessionStorage.getItem("id")).subscribe(
      (data) => {
        var fam = this.seleccionarFamiliar(data.Familiar, usr.WUsuario.cedula);
        var DB = data.Persona.DatoBasico;
        var DBF = fam.Persona.DatoBasico;
        var nombre = DB.apellidoprimero + " " + DB.nombreprimero;
        var cedula = DB.cedula;
        var porcentaje = data.Pension.pprestaciones;
        var grado = data.Grado.abreviatura;
        var pension = 0.00;
        var fila = '';
        var asignacion = 0.00;
        var deduccion = 0.00;
        var total = 0;
        var objNeto = [];
        var totalAsignacion = 0;
        var pos = event.target.value;
        var pension = 0.00;
        var titulo = this.lstNetos[pos];

        //console.log(data);
        var oConcepto = JSON.parse(this.lstNetos[pos].calculos).conceptos;
			  
        var nomina =  titulo.nomina + " - " + titulo.mes;
        this.putIdHtml("titulopensionsob", nomina);
        
        var obj = JSON.parse(this.lstNetos[pos].calculos).primas;
        
        for(var i=0; i< obj.length; i++){
          var monto = obj[i].mont;
          var tipo = obj[i].tipo;
          var des = obj[i].desc.replace("_", " ").toUpperCase();
          var lbl =  obj[i].desc;        
          var montostr = monto;
          objNeto[lbl] = parseFloat(monto);
          if(tipo == 97){           
            totalAsignacion += monto;
            fila += `
                <tr>
                    <td align="left">&nbsp;&nbsp;${des}</td>
                    <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
                    <td align="right"></td>
                    <td align="right" style="width:200px"></td>
                </tr>`;            
          }else{
                  if( des == "SUELDO MENSUAL" ){
                
                  }
                  if(tipo == 1){ //Asignacion   
                 
            }else{ //Deduccion
                
            }
          }
              
        } // fin del repetir de las primas
        
        
        var sueldotitular = ( totalAsignacion * porcentaje) / 100;
        if (sueldotitular > 0 ){
          var sueldomensual = `SUELDO MENSUAL A DISTRIBUIR ( ${porcentaje} % )`; 
          var stracount = sueldotitular;
          fila += `
                  <tr>
                      <td align="left">&nbsp;&nbsp;${sueldomensual}</td>
                      <td align="right" style="width:200px"><b>${stracount}</b>&nbsp;&nbsp;</td>
                      <td align="right"></td>
                      <td align="right" style="width:200px"></td>
                  </tr>
                  <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                  </tr>`;
        }

        // ----------------------------------------------------
        obj = JSON.parse(this.lstNetos[pos].calculos).conceptos;
        var imprimir = false;
        var contador = 0;
        for(var i=0; i< obj.length; i++){
          var monto = obj[i].mont;
          var tipo = obj[i].tipo;
          var des = obj[i].desc.replace("_", " ").toUpperCase();
          var lbl =  obj[i].desc;        
          var montostr = monto;
          objNeto[lbl] = parseFloat(monto);          

          if(JSON.parse(this.lstNetos[pos].calculos).asignaciones == monto){
              imprimir = true;
          }
          if( contador < 2 &&  imprimir == true ) {       
            if(tipo == 1 || tipo == 97 ){ //Asignacion   
                var sueldomensuals = this.obtenerDescripcionConceptos(des) == "" ? des: this.obtenerDescripcionConceptos(des); 
                if( des == "PENSION SOBREVIVIENTE" ){
                    sueldomensuals = `PENSION SOBREVIVIENTE ( ${ this.lstNetos[pos].porcentaje } % )`;                    
                } 
                contador++;
                fila += `
                    <tr>
                        <td align="left">&nbsp;&nbsp;${sueldomensuals}</td>
                        <td align="right"></td>
                        <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
                        <td align="right" style="width:200px"></td>
                    </tr>`;
                asignacion += monto;
                //console.error(sueldomensuals);

            }else if(tipo == 2 || tipo == 33) { //Asignacion Retroactivos                  
                fila += `
                    <tr>
                        <td align="left">&nbsp;&nbsp;${this.obtenerDescripcionConceptos(des)}</td>
                        <td align="right"></td>
                        <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
                        <td align="right" style="width:200px"></td>
                    </tr>`;
                asignacion += monto;
            }else{ //Deduccion
              //console.log("Deducciones");
              var strconc = this.obtenerDescripcionConceptos(des)==""?des:this.obtenerDescripcionConceptos(des); 
              fila += `
              <tr>
                  <td align="left">&nbsp;&nbsp;${strconc}</td>
                  <td align="right"></td>
                  <td align="right"></td>
                  <td align="right" style="width:200px">${montostr}&nbsp;&nbsp;</td>
              </tr>`;
              deduccion += monto;
            }
          }
            
        }


        fila += `<tr>
                    <td align="right" colspan='2'>TOTAL&nbsp;&nbsp;</td>
                    <td align="right" style="width:200px">${asignacion}&nbsp;&nbsp;</td>
                    <td align="right" style="width:200px">${   deduccion}&nbsp;&nbsp;</td>
                </tr>`;
        var neto = asignacion - deduccion;
        var strneto = neto;
        var htmlS = `<table style="width:800px" class="tablaneto">
              <tr>
                  <td align="center"><b>PARENTESCO</b><BR>${this.utlidad.ConvertirParentesco(fam.parentesco, DBF.sexo)}</td>
                  <td colspan="2" align="center"><b>APELLIDOS Y NOMBRES</b><BR><label id="nombre">${DBF.apellidoprimero + " " + DBF.nombreprimero }</label></td>
                  <td align="center"><b>N° DE CEDULA</b><BR><label id="cedula">${DBF.cedula}</cedula></td>
              </tr>
              <tr>
                  <td align="center" colspan="4" style="font-size:16px; padding:5px">CAUSANTE DE LA PENSION</td>
              </tr>
              <tr>
                  <td align="center"><b>GRADO</b><BR>${grado}</td>
                  <td colspan="2" align="center"><b>APELLIDOS Y NOMBRES</b><BR><label id="nombre">${nombre}</label></td>
                  <td align="center"><b>N° DE CEDULA</b><BR><label id="cedula">${cedula}</cedula></td>
              </tr>
          
          </table>
          <BR><BR>
          <table style="width:800px" class="tablaneto">
              <thead>
                  <tr>
                      <th align="center" style="width:440px">CONCEPTO</th>
                      <th align="center" style="width:120px">CALCULOS</th>
                      <th align="left" style="width:120px">ASIGNACIONES</th>
                      <th align="center" style="width:120px">DEDUCCIONES</th>
                  </tr>
              </thead>
              <tbody id="ltsConceptos">
              ${fila}
              </tbody>
              <tfoot>
                  <tr>
                      <th align="center" colspan="4" style="font-size:18px;padding:5px">
                      NETO A COBRAR <br><b>${strneto}<br></th>
                  </tr>
              </tfoot>
          </table>`;
        this.putIdHtml("contenidoNetoSob", htmlS);
        this.loadingrepor = false;
        this.isHRerpoteSob = false;

      },
      (error) => {
        console.error(error);
        this.loadingnet = false;
        this.isHinet = false;
      });
    

  }

  cargarCPension(usr, data){
    var tp = data.tiemposervicio.split(" ");
    this.putId("fingcp", this.utlidad.ConvertirFechaHumana(data.fingreso));
    this.putId("fretcp", this.utlidad.ConvertirFechaHumana(data.fresuelto) );
    var ano = tp[0].split("A");
    this.putId("facp", ano[0]);
    var mes = tp[1].split("M");
    this.putId("fmcp", mes[0]);
    var dia = tp[2].split("D");
    this.putId("fdcp", dia[0]);
    
    var DB = data.Persona.DatoBasico;
    this.putId("cedulacp", data.id);
    this.putId("nombrecp", data.Grado.descripcion + ". " + DB.apellidoprimero + " " + DB.nombreprimero);
    
    this.constanciaService.getPension(usr.WUsuario.cedula)
      .subscribe(
        (data) => {          
          this.loadingpen = false;
          this.isHpen = false;
          this.isHpens = false;         
          var n = parseFloat(data.sueldo_mensual.mt); 

       this.putId("montocp", n);
          var fechaActual = this.utlidad.ConvertirFechaActual();
          this.putId("lblfchActuals",fechaActual);          
        },
        (error) => {
          console.error(error)
        }
      );
  }

  cargarCPensionSobreviviente(usr, data){    
    this.constanciaService.getPension(sessionStorage.getItem("id"))
    .subscribe(
      (familiar) => {
          var fam = this.seleccionarFamiliar(data.Familiar, usr.WUsuario.cedula);
          var DB = data.Persona.DatoBasico;
          this.loadingpen = false;
          this.isHpen = false;
          this.isHpens = true;
          this.isHpensob = false;

          this.putId("cedulafm", usr.WUsuario.cedula  );
          this.putId("nombrefm", usr.WUsuario.apellido + " " + usr.WUsuario.nombre  );
          this.putId("relacionfm", this.utlidad.ConvertirParentesco(usr.WUsuario.parentesco, usr.WUsuario.sexo)  );

          this.putId("cedulartps", data.id );
          this.putId("gradotps", data.Grado.abreviatura + ". " + DB.apellidoprimero + " " + DB.nombreprimero );
          var n = (parseFloat(familiar.sueldo_mensual.mt) * parseFloat(fam.pprestaciones)) / 100;
          this.putId("montocps", n);
          var fechaActual = this.utlidad.ConvertirFechaActual();
          this.putId("lblfchActualsob",fechaActual);

        },
        (error) => {
          console.error(error)
        }
      );
  }


  seleccionarFamiliar(objFam, id : string) : any{
    var familiar : any;
    objFam.forEach(e => {
      var Prs = e.Persona;    
      if( Prs.DatoBasico.cedula == id ){      
        familiar = e;
      }
    });
    return familiar;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }


  GenerarARC( dialog ){
    var sobreviviente = false
    var usr = this.loginService.getUserDecrypt();
    this.loadingru = true;
    console.log(usr);
    var cedula = ''
    cedula = usr.WUsuario.cedula
    if ( sessionStorage.getItem("id") != undefined ){
      cedula = sessionStorage.getItem("id")
      sobreviviente = true
    }
 

    this.constanciaService.getConstanciaAfiliacion( cedula ).subscribe(
      (data) => {
        console.log(data)
        this.Militar = data
        var ti = parseInt(  data.tiemposervicio.split("A")[0] );
        var antiguedad = this.utlidad.AntiguedadGrado(data.fascenso, data.fretiro); 
        var Calc = {
          inicio : "2020-01-01",
          fin : "2020-12-31",
          fingreso : this.utlidad.ConvertirFechaCalculos(data.fingreso),
          fascenso : this.utlidad.ConvertirFechaCalculos(data.fascenso),    
          fretiro : this.utlidad.ConvertirFechaCalculos(data.fretiro),
          grado :  data.Grado.descripcion,
          codigo :  data.Grado.abreviatura,
          componente : data.Componente.abreviatura,
          antiguedad : "" + antiguedad['n'] + "",
          tiempo : "" + ti + "",
          situacion : data.situacion,          
          hijos : "0",
          porcentaje : "" + data.Pension.pprestaciones + "",
        };
        var CalcARC = {
          cedula : cedula,
          cedulafamiliar : "",
          anio: "2020"
        }
        this.ArcPorcentaje =  0

        this.constanciaService.getConstaciaARC(CalcARC).subscribe(
          (req) => {
            console.log(req);
            
            if ( sobreviviente == true ){
              this.CabeceraFamiliar = this.cabeceraFamiliar(data.Familiar, cedula) 
            }
           
            var max = req.Retroactivo.length; 
            var retroactivo = req.Retroactivo[ max - 1 ]
            this.ArcAguinaldo = retroactivo.AGUI0004.mt            

            var lista = req.rs;
            var fila = '';
            var tneto = 0.00;
            var obj : any
            for(var i = 0; i <= 11; i++){
                var mesAux = i+1;

                if( lista[i] != undefined ) {
                    var mes = parseInt(lista[i].mes);
                    
                    tneto += parseFloat( lista[i].mont );
                    obj[this.Meses[mes - 1]] = {
                        "mes": mes,
                        "des": this.Meses[mes - 1],
                        "mon": lista[i].mont
                    }           
                }
                    
                

            }
            
            for(var i= 0; i <= 11; i++){
                fila += this.seleccionarMesArc(this.Meses[i], i+1, obj);
            }
            

            
            this.HTMLArc(fila, tneto, this.ArcFamiliar);
            

          }, //Fin del caso 
          (error) => {
            console.error(error)
          }

        ); //FIN CALCULADORAAAA


      }, //Fin del caso 
        (error) => {
          console.error(error)
        }
      );
   
 
  }

  cabeceraFamiliar(familiar, id){
    var pos = 0
    var i = 0
    familiar.forEach(e => {
      i++
      if ( e.Persona.DatoBasico.cedula == id ){
        pos = i
      }
    });
    var v = familiar[pos];
    var DBF = v.Persona.DatoBasico;
    this.ArcPorcentaje = v.pprestaciones!=undefined?v.pprestaciones:0;
    var nombre = DBF.apellidoprimero + ' ' + DBF.apellidosegundo + ' ' + DBF.nombreprimero + ' ' + DBF.nombresegundo;
    return `<table style="width:800px" >
      <tr>
          <td align="center"><b>PARENTESCO</b><BR>${v.parentesco}</td>
          <td colspan="2" align="center"><b>APELLIDOS Y NOMBRES</b><BR><label id="nombre">${nombre}</label></td>
          <td align="center"><b>N° DE CÉDULA</b><BR><label id="cedula">${DBF.cedula}</cedula></td>
          <td align="center"><b>PORCENTAJE PENSION</b><BR><label>${this.ArcPorcentaje} %</cedula></td>
      </tr>
     
    </table>`;
   
  }

  seleccionarMesArc(mes, pos, obj){

    var sel : any
    if( obj[mes] == undefined){
       
       obj[mes] = {
            "mes": pos,
            "des": mes,
            "mon": 0
        }     
        sel =  obj[mes];
    }else{
        sel = obj[mes];
    }

    return this.lineaMes(sel.des, sel.mes, sel.mon);
}
  
  lineaMes(mes, pos, monto) {

    var n = formatCurrency(monto, 'en-US',  'Bs ')
    
    var r1 = n.replace('.', '#');
    var r2 = r1.replace(/,/g, '.');
    var r3 = r2.replace('#', ',');

    return `<tr>
        <td >${pos}</td>
        <td >${mes}</td>
        <td align="right">${ r3 }</td>
        <td align="right">${ r3 }</td>
        </tr>`
  }

  HTMLArc(fila, neto, familiar){
    var DBS = this.Militar.Persona.DatoBasico
    var grado = this.Militar.Grado.descripcion //$("#cmbgrado option:selected").text();
    var nombre = DBS.apellidoprimero + " " + DBS.nombreprimero   // $("#txtnombre").val() + " " + $("#txtapellido").val() ;
    var cedula = DBS.cedula // $("#txtcedula").val();
    var porpocentaje = "";
    
    var n = formatCurrency(neto, 'en-US',  'Bs ')
    
    var r1 = n.replace('.', '#');
    var r2 = r1.replace(/,/g, '.');
    var r3 = r2.replace('#', ',');

    

    if(this.ArcPorcentaje > 0){
        var calculo = (neto * this.ArcPorcentaje)/100
        var rn = formatCurrency(calculo, 'en-US',  'Bs ')
    
        var rr1 = rn.replace('.', '#');
        var rr2 = rr1.replace(/,/g, '.');
        var rr3 = rr2.replace('#', ',');
        porpocentaje = `<br>PENSION DEL MILITAR : <b> &nbsp;&nbsp; ${ r3 }&nbsp;&nbsp;<br>
        </b> DEVENGADO POR EL SOBREVIVIENTE :<b> &nbsp;&nbsp; ${ rr3 }`;
    } else{
        porpocentaje = `<br>TOTAL DEVENGADO :<b> &nbsp;&nbsp; ${ r3  }&nbsp;&nbsp;<br>`;
    }

    var ventana = window.open("", "_blank");
    var localtime = new Date().toLocaleString();
    ventana.document.write(`<center>
    
    <table style="width:800px" class="membrete">
    <tr>
        <td width="200px" valign="top"><center><img  style="width: 100px;height: 100px; margin-left: 0px" 
        class="img-responsive file-path-wrapper-pre-view" 
        src="https://app.ipsfa.gob.ve/assets/images/logo_ipsfa.png" id="_imgescudo"/></center>
        </td>
        <td width="400px">
            <center>
            REPÚBLICA BOLIVARIANA DE VENEZUELA <BR>
            MINISTERIO DEL PODER POPULAR PARA LA DEFENSA<BR>
            VICEMINISTERIO DE SERVICIOS, PERSONAL Y LOGÍSTICA<BR>
            DIRECCIÓN GENERAL DE EMPRESAS Y SERVICIOS<BR>
            INSTITUTO DE PREVISIÓN SOCIAL DE LA <BR>FUERZA ARMADA NACIONAL BOLIVARIANA<BR>
            RIF: G20003692-3
            </center>
        </td>
        <td width="200px" valign="top"></td>
        </tr>
    </table >
        <h3>CONSTANCIA AR-C DE PENSIÓN<br>
            AÑO <b>2019</b>
        </h3>
        <br>
    <table style="width:800px" >
        <tr>
            <td align="center"><b>GRADO</b><BR>${grado}</td>
            <td colspan="2" align="center"><b>APELLIDOS Y NOMBRES</b><BR><label id="nombre">${nombre}</label></td>
            <td align="center"><b>N° DE CÉDULA</b><BR><label id="cedula">${cedula}</cedula></td>
        </tr>
       
    </table>
    ${familiar}
    <BR><BR>
    <div class="cuerpo">
    <table style="width:800px">
        <thead>
            <tr>
                <th style="width: 20px">#</th>
                <th align="left"> DESCRIPCION DEL MES</th>
                <th style="width: 150px" align="right">ASIGNACIONES</th>
                <th style="width: 150px" align="right">TOTAL</th>
            </tr>
        </thead>
        <tbody >
        ${fila}
        </tbody>
        <tfoot>
            <tr>
                <th align="center" colspan="4" 
                    style="font-size:16px">
                    ${porpocentaje}
                </th>
            </tr>
        </tfoot>
    </table>
    <br>
    <table border="0">
        <tr>
            <td width="15%" valign="top">
                <img src="https://app.ipsfa.gob.ve/assets/images/selloafiliacion.png" valing="left" width="240px" style="margin-left: -50px;margin-right: -100px">
            </td>
            <td width="70%" valign="top">
                <center><h3>
                <img style="width: 250px;height: 120px;" src="https://app.ipsfa.gob.ve/assets/images/firmatesorero.png" /><br>
                <label id="lblnombrePI"> TERRY MITCHELL </label><BR>
                <label id="lblgradoPIF"> MAYOR </label><br>
                TESORERO I.P.S.F.A.
                </h3><i>               
            </td>
            <td width="15%" valign="top"></td>
          </tr>
    </table>
    <br><br>
    </div>
   </div>
   <div class="footer">
            <hr>
        Av. Los Proceres, Edf. Sede del IPSFA, P.B., Gerencia de Bienestar y Seguridad Social. Santa Monica, Municipio
        Libertador del Distrito Capital, Caracas. Correo Electrónico: bienestaripsfaccs@gmail.com. telefonos +58 414-3270828, +58 412-6392184
    </div>
    </center>
    
    
    
    `);

    ventana.document.head.innerHTML = ` <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SSSIFANB</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <style type="text/css">
            body {
                margin: 0px;
                font-family: Calibri;
                
            }
            .baner {
                text-align: center;
                line-height: 22px; 
                font-size: 15px; 
            }
            p {
                text-align: justify;
                line-height: 22px; 
                font-size: 14px;
            }
            .wrapper {
                min-height: 100%;
                height: auto !important;
                height: 100%;
                margin: 0 auto -5em;
            }
            .footer, .push {
                height: 5em;
                font-size: 12px;
            }
        table{
            border-collapse: collapse;
            font-family: Arial, Calibre;
            font-size: 12px;
        }
        .tablaneto {
            border-collapse: collapse;
        } 
        .tablaneto tr{
            border: 1px solid #CCCCCC;
        } 
        .tablaneto td {
            border: 1px solid #CCCCCC;
        } 
        .tablaneto th {
            border: 1px solid #CCCCCC;
        } 
        @media print {
            
            .footer, .push {
                height: 5em;
                font-size: 12px;
            }
        }
    </style>
     `;
  }

}

