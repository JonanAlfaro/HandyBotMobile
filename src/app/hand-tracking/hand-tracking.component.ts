import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule,  } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { Hands, HAND_CONNECTIONS, HandsInterface } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { createServer } from 'net'

@Component({
  selector: 'app-hand-tracking',
  templateUrl: './hand-tracking.component.html',
  styleUrls: ['./hand-tracking.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})
export class HandTrackingComponent implements OnInit {
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  socket!: Socket;
  ESP32_IP: string = '192.168.100.251';
  ESP32_PORT: number = 12345;
  prevPinkyTipY: number = 0;
  prevRingTipY: number = 0;
  constructor() {}

  ngOnInit() {

    // this.socket = io(`http://${this.ESP32_IP}:${this.ESP32_PORT}`);
    // this.socket.on('connect', () => {
    //   console.log('Connected to ESP32');
    // });
    // this.socket.on('disconnect', () => {
    //   console.log('Disconnected from ESP32');
    // });
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

    const server = createServer((socket) => {
      console.log('Arduino connected');
    
      // Manejar datos recibidos del Arduino
      socket.on('data', (data) => {
        console.log('Received from Arduino:', data.toString());
      });
    
      // Manejar la desconexión del Arduino
      socket.on('end', () => {
        console.log('Arduino disconnected');
      });
    
      // Manejar errores de socket
      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });
    
      // Enviar mensaje al Arduino cada 5 segundos
      setInterval(() => {
        const message = 'Hello from Node.js server\n';
        console.log('Sending to Arduino:', message);
        socket.write(data);
      }, 5000);
    });

    const PORT = 12345;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    
    // if (this.socket.connected) {
    //   console.log(data)
    //   this.socket.emit('servo_control', data);
    // } else {
    //   console.error('Socket is not connected');
    // }
  }
}