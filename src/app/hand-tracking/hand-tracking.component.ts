import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Hands} from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import io from 'socket.io-client';

@Component({
  selector: 'app-hand-tracking',
  templateUrl: './hand-tracking.component.html',
  styleUrls: ['./hand-tracking.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})
export class HandTrackingComponent implements OnInit {
  @ViewChild('videoElement')
  videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  hands: Hands | undefined;
  camera: Camera | undefined;
  socket: any;
  ESP32_IP: string = '192.168.100.251';
  ESP32_PORT: number = 12345;

  prevPinkyTipY: number = 0;
  prevRingTipY: number = 0;

  ngOnInit() {
    this.socket = io(`http://${this.ESP32_IP}:${this.ESP32_PORT}`);
    this.initializeHands();
  }

  initializeHands() {
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(this.videoElement.nativeElement, {
      onFrame: async () => {
        await this.hands?.send({ image: this.videoElement.nativeElement });
      },
      width: 640,
      height: 480,
    });
    this.camera.start();
  }

  onResults(results: { image: any; multiHandLandmarks: any; }) {
    const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
    canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);

    if (results.multiHandLandmarks) {
      for (const handLandmarks of results.multiHandLandmarks) {
        this.processHandLandmarks(handLandmarks);
      }
    }
    canvasCtx.restore();
  }
  processHandLandmarks(handLandmarks: { landmark: { [key: number]: { x: number; y: number; z?: number } } }) {
    // Acceso a los puntos clave usando índices
    const thumbTip = handLandmarks.landmark[4];  // THUMB_TIP
    const indexTip = handLandmarks.landmark[8];  // INDEX_FINGER_TIP
    const middleTip = handLandmarks.landmark[12]; // MIDDLE_FINGER_TIP
    const ringTip = handLandmarks.landmark[16];  // RING_FINGER_TIP
    const pinkyTip = handLandmarks.landmark[20];  // PINKY_TIP
    const pinkyMcp = handLandmarks.landmark[19];  // PINKY_MCP
    const ringMcp = handLandmarks.landmark[15];  // RING_FINGER_MCP

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

    this.socket.emit('servo_control', data);
  }
}