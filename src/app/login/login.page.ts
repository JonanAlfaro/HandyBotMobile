import { Component, OnInit } from '@angular/core';
import { AuthenticationModels } from '../models/authentication.models';
import { Validators,FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
   credentials = new FormGroup ({
    email: new FormControl(),
    password: new FormControl(),
  });
  constructor(	private fb: FormBuilder,
		// private authModels: AuthenticationModels,
		private alertController: AlertController,
		private router: Router,
		private loadingController: LoadingController) { }

  

  async login(){
    const loading = await this.loadingController.create();
		await loading.present();

    // this.authModels.login(this.credentials?.value).subscribe(
    //   async(res) =>{
    //     await loading.dismiss();
    //     this.router.navigateByUrl('/admin', {replaceUrl: true} )
    //   },
    //   async(res) =>{
    //     await loading.dismiss();
    //     const alert = await this.alertController.create({
    //       header: 'Error al Iniciar Session',
    //       message: res.error.error,
    //       buttons: ['OK']
    //     });
    //     await alert.present();
    //   }
    // )

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
