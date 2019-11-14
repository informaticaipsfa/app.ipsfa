import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, IToken } from '../servicios/security/login.service';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

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
          'Error al acceder a los datos de conexion',
          `Ipsfa en línea`,
          { position, status }
        );
      }
    );
  }

}
