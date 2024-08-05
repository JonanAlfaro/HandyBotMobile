import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  constructor() { }


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
