import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { MovimientoService, Movimiento  } from '../service/movimientoservice';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserPage implements OnInit {

  constructor() { }


  movimientoService = inject(MovimientoService);
  movimientos: Movimiento[] = [];

  async ngOnInit() {

    const response = await this.movimientoService.getAll();
    this.movimientos = response;
  }

}
