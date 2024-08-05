import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CardComponent } from "../components/card/card.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CardComponent]
})
export class AdminPage implements OnInit {
  constructor() {
    addIcons({ add });
   }


  categories = [
    {
      "_id": "66888c27d41764c7480f136a",
      "id": "5555",
      "descripcion": "Comandos para mano",
      "comandos": [
        "nuevo_comando1",
        "nuevo_comando2"
      ],
      "creadoPor": "Emmanuel Gallegos"
    },
    {
      "_id": "66888c27d41764c7480f136a",
      "id": "5555",
      "descripcion": "Comandos para mano",
      "comandos": [
        "nuevo_comando1",
        "nuevo_comando2"
      ],
      "creadoPor": "Emmanuel Gallegos"
    }
  ]
  ngOnInit() {
  }

}
