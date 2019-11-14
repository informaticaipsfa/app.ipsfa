import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, IUsuario, IToken } from '../servicios/security/login.service'
import { NbToastrService, NbDialogService } from '@nebular/theme';
// import { MensajeComponent } from '../mensaje/mensaje.component';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})


export class RegistrarsePage implements OnInit {

  iUsuario : IUsuario = {
    cedula : '',
    tipo : '',
    componente : '',
    clave : '',
    correo: '',
  };


  redirectDelay: number;
  showMessages: any;
  strategy: string;
  errors: string[];
  messages: string[];
  usuario : string;
  clave: string;
  rclave: string;
  correo: string;
  titular : string;
  componente : string;
  submitted: boolean;
  rememberMe: boolean;
  lblcedula: string = 'Cédula del titular';

  loading = false;
  isHidden: boolean = true;

  constructor(
    private router: Router, 
    private dialogService: NbDialogService,
    private loginService: LoginService, 
    private toastrService: NbToastrService) { 
  }
  ngOnInit() {
  }

  open(dialog : TemplateRef<any>) {
    this.dialogService.open(dialog, { context: {
        title: 'Registro Ipsfa en linea',
      }, });
  }

  add(position, status, dialog : TemplateRef<any>){
    this.loading = true;
    this.iUsuario.cedula = this.usuario;
    this.iUsuario.tipo = this.titular;
    this.iUsuario.componente = this.componente;
    this.iUsuario.clave = this.clave;

    
    this.iUsuario.correo = this.correo;
    if ( this.clave != this.rclave ){
      status = 'danger';
      this.toastrService.show(
        'Error en la clave deben ser identicas',
        `Ipsfa en línea`,
        { position, status }
      );
      this.clave = '';
      this.rclave = '';
      this.loading = false;
      this.isHidden = false;
      return false;
    }
    
    this.loginService.makeUser(this.iUsuario).subscribe(
      (data) => { // Success
        status = 'success';
        //console.log(data);
        
        this.loading = false;
        this.isHidden = false;
        
        if (data.msj != undefined){
          
          this.toastrService.show(
            data.msj,
            `Ipsfa en línea`,
            { position, status }
          );
          
        }else {
          this.toastrService.show(
            'Ok, proceso exitoso',
            `Ipsfa en línea`,
            { position, status }
          );
          this.open(dialog);
        }
        //this.router.navigate(['login']);
      },
      (error) => {
        //console.log(error.error.msj);
        this.loading = false;
        this.isHidden = false;
        var e = error.error.msj!=undefined?error.error.msj:'Error de conexión';
        this.toastrService.show(
          e,
          `Ipsfa en línea`,
          { position, status }
        );
      }
    );
  }
  continuar(){
    this.router.navigate(['login']);

  }

  seleccionarTipo(valor : string){
    switch (valor) {
      case "TIT":
        this.lblcedula = 'Cédula del titular';
        break;
      case "SOB":
        this.lblcedula = 'Cédula del sobreviviente';
        break;
      case "SOB-TIT":
        this.lblcedula = 'Cédula del titular - sobreviviente ';
        break;
      default:
        break;
    }
  }

}

