import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { MovimientoService, Movimiento  } from '../service/movimientoservice';
import { HandTrakingService } from '../service/hand-traking.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserPage implements OnInit {

  
  constructor(private loadingController: LoadingController,) {}

  handTrakingService = inject(HandTrakingService);
  movimientoService = inject(MovimientoService);
  movimientos: Movimiento[] = [];

  async ngOnInit() {

    const response = await this.movimientoService.getAll();
    this.movimientos = response;
  }

  async playRecording(comandos: []){
    const loading = await this.loadingController.create();
		await loading.present();
    this.handTrakingService.playRecording(comandos).subscribe(
      async (res) => {
        setTimeout(() => {
          console.log(res)
          loading.dismiss();
        }, 500);
      },
      async (res) => {
        setTimeout(() => {
          console.log(res)
          loading.dismiss();
        }, 500);
      }
    )

  }

}
