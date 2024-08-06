import { Component, OnInit,inject } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Validators,FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink,FormsModule,ReactiveFormsModule],
})
export class LoginPage implements OnInit {
   credentials = new FormGroup ({
    email: new FormControl(),
    password: new FormControl(),
  });
  constructor(	private fb: FormBuilder,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController,) { }

    authService = inject(AuthenticationService);
   

  async login(){
    const loading = await this.loadingController.create();
		await loading.present();



    this.authService.login({
      email: this.credentials.value.email,
      password: this.credentials.value.password,
    }).subscribe(
      async(res) =>{
        
        await loading.dismiss();

        let isAdmin : boolean = false;
        if(res.idAdmin !== null)
          isAdmin = res.idAdmin === 'ATH123';

        if(isAdmin)
        this.router.navigateByUrl('/admin', {replaceUrl: true} )
        else
        this.router.navigateByUrl('/user', {replaceUrl: true} )
      },
      async(res) =>{
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error al Iniciar Session',
          message: res.error.text,
          buttons: ['OK']
        });
        await alert.present();
      }
    )

  }
  get email(){
    return this.credentials?.get('email')
  }
  get password(){
    return this.credentials?.get('password')
  }

  ngOnInit() {
    this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});
  }

}
