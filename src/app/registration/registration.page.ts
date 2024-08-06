import { Component, OnInit,inject } from '@angular/core';
import { Router } from '@angular/router';
import { Validators,FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../service/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [ IonicModule, RouterLink,FormsModule,ReactiveFormsModule],
})
export class RegistrationPage implements OnInit {
  usuario = new FormGroup({
    nombre: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    idAdmin: new FormControl(),
  });
  constructor(private router: Router,private alertController: AlertController) { }

  usuarioService = inject(UsuarioService);

  async registrar() {
    const user = <Usuario>{
      nombre: this.usuario.value.nombre,
      email: this.usuario.value.email,
      password: this.usuario.value.password,
      idAdmin: this.usuario.value.idAdmin
    }
    try {
      const data = await this.usuarioService.registrar(user);
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (res:any) {
      console.log(res.error);
      const alert = await this.alertController.create({
        header: 'Error al Iniciar Sesión',
        message: res.error.text,
        buttons: ['OK']
      });
      await alert.present();
    }

  }

  ngOnInit() {
  }

}
