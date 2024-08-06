import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CardComponent } from "../components/card/card.component";
import { MovimientoService, Movimiento  } from '../service/movimientoservice';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CardComponent,RouterLink]
})



export class AdminPage implements OnInit {
  constructor() {
    addIcons({ add });
   }

  movimientoService = inject(MovimientoService);
  movimientos: Movimiento[] = [];

  async ngOnInit() {
    const response = await this.movimientoService.getAll();
    this.movimientos = response;
  }

}

