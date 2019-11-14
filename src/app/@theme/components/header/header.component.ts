import { Component, OnDestroy, OnInit } from '@angular/core';
import { NB_WINDOW, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoginService } from '../../../servicios/security/login.service'
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  currentTheme = '';

  userMenu = [  { title: 'Cerrar sesión'} ];
  usuarionick = '';
  issobre = false;

  Causante = [];


  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private loginService: LoginService) {
    
    var usr = this.loginService.getUserDecrypt();
    
    if(usr.WUsuario.sobreviviente != undefined ){
      this.issobre = true;
      this.Causante = usr.WUsuario.causante;
      console.log(this.Causante);
    }
  }

  ngOnInit() {
    

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
      var Usr = this.loginService.getUserDecrypt();
      //console.log(Usr.WUsuario.apellido);
      this.usuarionick = Usr.WUsuario.grado + '. ' + Usr.WUsuario.apellido;


      this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      ).subscribe( (title) => {
          if(title == "Cerrar sesión"){
            this.logout();
          }  
        } 
        
      )
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  seleccionarCausante(valor: string){
    sessionStorage.setItem("id", valor);
  }

  logout(){
    this.loginService.logout();
  }
}
