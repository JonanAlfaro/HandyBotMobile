import { Component, OnInit,inject} from '@angular/core';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Hands, HAND_CONNECTIONS, HandsInterface } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HandTrakingService } from '../service/hand-traking.service';
import { NgIf } from '@angular/common';
import { LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-hand-tracking',
  templateUrl: './hand-tracking.component.html',
  styleUrls: ['./hand-tracking.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink,NgIf],
})
export class HandTrackingComponent implements OnInit {
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  prevPinkyTipY: number = 0;
  prevRingTipY: number = 0;
  recordingLoading: boolean = false;
  hasMovement: boolean = false;

  constructor(private loadingController: LoadingController,) {}

  handTrakingService = inject(HandTrakingService);

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.videoElement = document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
    this.canvasElement = document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext('2d') as CanvasRenderingContext2D;

    this.initializeHandTracking();

  }

  async initializeHandTracking() {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(this.onResults.bind(this));

    const camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await hands.send({ image: this.videoElement });
      },
      width: 1280,
      height: 720,
    });

    camera.start();
  }

  onResults(results: any) {
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
    this.drawZones(this.canvasCtx);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        
        drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        drawLandmarks(this.canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

        this.processHandLandmarks(landmarks);
      }
    }
    this.canvasCtx.restore();
  }
  drawZones(ctx: CanvasRenderingContext2D) {
    const height = this.canvasElement.height;
    const width = this.canvasElement.width;
    const zoneHeight = height / 3;

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, zoneHeight);
    ctx.lineTo(width, zoneHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 2 * zoneHeight);
    ctx.lineTo(width, 2 * zoneHeight);
    ctx.stroke();

    ctx.fillStyle = 'blue';
    ctx.font = '24px Arial';
    ctx.fillText('Zone 1', 10, zoneHeight / 2);
    ctx.fillText('Zone 2', 10, 1.5 * zoneHeight);
    ctx.fillText('Zone 3', 10, 2.5 * zoneHeight);
  }
  processHandLandmarks(handLandmarks: any) {
   
    const thumbTip = handLandmarks[4];
    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];
    const pinkyMcp = handLandmarks[19];
    const ringMcp = handLandmarks[13];

    const servo1Angle = Math.round((thumbTip.x + indexTip.x) / 2 * 180);
    const servo2Angle = Math.round((middleTip.y + ringTip.y) / 2 * 180);

    const initialServo3Angle = 130;
    const threshold = 0.5;
    let servo3Angle = initialServo3Angle;
    if (indexTip.y < threshold) {
      servo3Angle -= 30;
    }

    let direction = 'S';

    if (pinkyTip.y > pinkyMcp.y && this.prevPinkyTipY <= pinkyMcp.y) {
      direction = 'L';
    } else if (this.prevPinkyTipY > pinkyMcp.y && pinkyTip.y <= pinkyMcp.y) {
      direction = 'S';
    }

    if (ringTip.y > ringMcp.y && this.prevRingTipY <= ringMcp.y) {
      direction = 'R';
    } else if (this.prevRingTipY > ringMcp.y && ringTip.y <= ringMcp.y) {
      direction = 'S';
    }

    this.prevPinkyTipY = pinkyTip.y;
    this.prevRingTipY = ringTip.y;

    const data = `${servo1Angle},${servo2Angle},${servo3Angle},${direction}\n`;
    this.handTrakingService.addMovement(data);
  }

  startRecording() {
    this.hasMovement = false  
    this.handTrakingService.startRecording();
    console.log(this.hasMovement, this.handTrakingService.getMovements())
    this.recordingLoading = true;

    setTimeout(() => {
      this.handTrakingService.stopRecording();
      this.recordingLoading = false;
      if (this.handTrakingService.getMovements().length > 0)
        this.hasMovement = true
      console.log(this.hasMovement, this.handTrakingService.getMovements())
    }, 10000);
  }


  async playRecording(){
    const loading = await this.loadingController.create();
		await loading.present();
    const movimients = this.handTrakingService.getMovements()
    this.handTrakingService.playRecording(movimients).subscribe(
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