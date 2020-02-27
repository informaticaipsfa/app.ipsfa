import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, Usuario, IToken } from '../servicios/security/login.service';
import { FormsModule } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {


  protected options: {};
  
  nombre: string;
  clase: string;
  selectedItem: string;
  estatus: string;

  redirectDelay: number;
  showMessages: any;
  strategy: string;
  errors: string[];
  messages: string[];
  usuario : string;
  clave: string;

  submitted: boolean;
  rememberMe: boolean;

  loading = false;
  isHidden: boolean = true;

  public iToken: IToken = {
    token: '',
  };

  public itk: IToken;
  private index: number = 0;
  constructor(private router: Router, private loginService: LoginService,private toastrService: NbToastrService) { 

  }

  ngOnInit() {
  }




  async login(position, status){
    this.loading = true;
    await this.loginService.getLogin(this.usuario, this.clave).subscribe(
      (data) => { // Success
        console.error(data);
        this.itk = data;
        sessionStorage.setItem("token", this.itk.token );
        this.loading = false;
        this.isHidden = false;
        this.router.navigate(['pages/dashboard']);
        
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.isHidden = false;

        this.toastrService.show(
          status || 'Success',
          `Error al acceder a los datos de conexion`,
          { position, status }
        );
      }
    );
  }

  PresionarEnter(e) {
    if (e.keyCode === 13) {
      this.login('top-right', 'danger');
    }
  }

}
