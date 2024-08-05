import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators,FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [ IonicModule, RouterLink,FormsModule,ReactiveFormsModule],
})
export class RegistrationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
