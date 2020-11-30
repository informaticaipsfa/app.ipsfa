import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor() { }

  GenerarEstadoCivil(civil: string, genero: string){
		let estadocivil= "";
		 switch(civil) {
		    case "C":
		     	estadocivil =(genero=="F")?"CASADA":"CASADO";
		        break;
		    case "D":
		    	estadocivil = (genero=="F")?"DIVORCIADA":"DIVORCIADO";
		        break;
		    case "S":
		    	estadocivil = (genero=="F")?"SOLTERA":"SOLTERO";
		        break;
		    case "V":
		    	estadocivil = (genero=="F")?"VIUDA":"VIUDO";
		        break;
		    default:
		        estadocivil = "";
		        break;
		}
		return estadocivil;
  }
  
  GenerarSituacionMilitar(situacion: string){
    let sit = "";
		 switch(situacion) {
		    case "ACT":
		     	  sit = "ACTIVO";
		        break;
		    case "RCP":
            sit = "RETIRADO CON PENSION";
		        break;
		    case "FCP":
            sit = "FALLECIDO CON PENSION";
		        break;
		    case "PG":
		    	sit = "PENSIONADO DE GRACIA";
		      break;
		    default:
		        sit = "ACTIVO";
		        break;
		}
		return sit;
  }

  GenerarParentesco(parent:string, genero: string, estadocivil: string){
		var parentesco= "";
		 switch(parent) {
		    case "PD":
		     	parentesco =(genero=="F")?"MADRE":"PADRE";
		        break;
		    case "HJ":
		    	parentesco = (genero=="F")?"HIJA":"HIJO";
		        break;
		    case "EA":
				parentesco = (genero=="F")?"ESPOSA":"ESPOSO";
				if (estadocivil != undefined){
					if (estadocivil == "M"){
						parentesco = (genero == "F" )? "VIUDA":"VIUDO";
					}
				}
		    break;
			case "HO":
		    	parentesco = (genero=="F")?"HERMANA":"HERMANO";
		        break;
		    default:
		        parentesco = "";
		        break;
		}
		return parentesco;
	}
  
  GenerarClasificacion(clasificacion : string ){
    var clas = "";
		 switch(clasificacion) {
		    case "OFIT":
		     	clas = "OFICIAL TECNICO";
          break;
		    
		    default:
          clas = "";
          break;
		}
		return clas;
  }

  GenerarCategoria(categoria: string){
    var cat = "";
    switch(categoria) {
       case "EFE":
          cat = "EFECTIVO";
         break;
       
       default:
         cat = "";
         break;
    }
    return cat;
  }

  GenerarComponente(abreviatura: string){
    let abrev = "";
    let nombre = "";
    switch(abreviatura) {
      case "EJ":
          abrev ="EJÉRCITO BOLIVARIANO";
          nombre ="EJÉRCITO";
          break;
      case "AV":
        abrev ="AVIACION MILITAR BOLIVARIANA";
        nombre ="AVIACION";
          break;
      case "GN":
        abrev ="GUARDIA NACIONAL BOLIVARIANA";
        nombre ="GUARDIA NACIONAL";
          break;
      case "AR":
        abrev ="ARMADA BOLIVARIANA";
        nombre ="ARMADA";
          break;
      default:
        abrev = "";
        break;
		}
		return abrev;
  }

  //Recibe  Fecha Formato: AAAA-MM-DD 00:00:00
    //Retorna Fecha Formato: DD/MM/AAAA
  ConvertirFechaHumana(f: string) {
      var ISODate = new Date(f).toISOString();
      var fe = ISODate.substr(0, 10);
      var fa = fe.split("-");
      if (fa[0] != "0001") {
          return fa[2] + "/" + fa[1] + "/" + fa[0];
      } else {
          return "";
      }
      //return fa[2] + "/" + fa[1] + "/" + fa[0];
  }

  ConvertirFechaCalculos(f: string) {
    var ISODate = new Date(f).toISOString();
    var fe = ISODate.substr(0, 10);
    return fe;    
  }

  ConvertirFechaActual() {
      var meses = new Array("enero", "febrero", "marzo", "abril", "mayo", "junio",
          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
      var f = new Date();

      return f.getDate() + " del mes de " + meses[f.getMonth()] + " de " + f.getFullYear();
  }

  ConvertirFechaActualConstancia() {
      var meses = new Array("enero", "febrero", "marzo", "abril", "mayo", "junio",
          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
      var f = new Date();

      return " mes de " + meses[f.getMonth()] + " de " + f.getFullYear();
  }

  //Recibe  Fecha Formato: DD/MM/AAAA
  //Retorna Fecha Formato: AAAA-MM-DD
  ConvertirFechaUnix(f : string) {
      if (f == ""){
        return "0001-01-01T00:00:00Z";
      }else{
        var fecha = f.split("/");
        return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
      }
  }

  ConvertirParentesco(cad,sexo){
    var parent = "";
    switch(cad) {
        case "PD":
            parent =(sexo=="F")?"MADRE":"PADRE";
            break;
        case "HJ":
            parent = (sexo=="F")?"HIJA":"HIJO";
            break;
        case "EA":
            parent = (sexo=="F")?"ESPOSA":"ESPOSO";
            break;
        case "VI":
          parent = (sexo=="F")?"VIUDA":"VIUDO";
          break;
        case "HO":
          parent = (sexo=="F")?"HERMANA":"HERMANO";
          break;
        default:
            parent = "";
            break;
    }
    return parent;
}

  AMCuentaBancaria(cadena){
    var max = cadena.length;
    var derecha = cadena.substring(0, 4);
    var izquierda = cadena.substring(16);
    return derecha + '****************' + izquierda;
  }

  AntiguedadGrado(fecha, fecha_retiro){    
    var arr = [];
    
    var fecha_r = fecha_retiro.split("-");
    var ano_r = fecha_r[0];
    var mes_r = fecha_r[1];
    var dia_r = fecha_r[2];

    var list = fecha.split("-");
    var ano = list[0];
    var mes = list[1];
    var dia = list[2];

    var dia_dif, mes_dif, ano_dif = 0

    if (dia_r < dia){
      dia_dif =  (dia_r+30) - dia; //27 -5
      mes_r--;
    }else{
      dia_dif =  dia_r - dia; //27 -5
    }

    if (mes_r < mes){
       mes_dif =  (mes_r + 12) - mes; //27 -5
       ano_r--;
    }else{
      mes_dif =  mes_r - mes;
    }

    ano_dif = ano_r - ano;
    arr['e'] = ano_dif;

    if(mes_dif > 5) {
      arr['n'] = ano_dif + 1;
    }else{
      arr['n'] = ano_dif;
    }

    return arr;

  }

  FormatoMoneda( valor ) : string{
    var n = parseFloat( valor );
    var s = '' //numeral(n).format('0.0,');
    var r1 = s.replace('.', '#');
    console.log(s);
    var r2 = r1.replace(/,/g, '.');
    var r3 = r2.replace('#', ',');

    return ''
  }
  FormatoNumero( valor ) : string{
    var n = valor;
    var s = '' //numeral(n).format('0.0,');
    var r1 = s.replace('.', '#');
    console.log(s);
    var r2 = r1.replace(/,/g, '.');
    var r3 = r2.replace('#', ',');

    return ''
  }

}
