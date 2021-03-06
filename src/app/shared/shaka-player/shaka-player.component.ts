import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';

declare let shaka: any;
@Component({
  selector: 'app-shaka-player',
  templateUrl: './shaka-player.component.html',
  styleUrls: ['./shaka-player.component.css'],
})
export class ShakaPlayerComponent implements OnInit {
  @ViewChild('videoPlayer') videoElementRef: ElementRef | undefined;
  @ViewChild('videoContainer') videoContainerRef: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;
  videoContainerElement: HTMLDivElement | undefined;
  player: any;

  constructor(private platform: Platform) {}

  private initPlayer() {
    this.player = new shaka.Player(this.videoElement);

    let videoUrl =
      'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd';
    if (this.platform.SAFARI) {
      videoUrl =
        'http://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.m3u8';
    }

    const ui = new shaka.ui.Overlay(
      this.player,
      this.videoContainerElement,
      this.videoElement
    );

    this.player
      .load(videoUrl)
      .then(() => {
        this.videoElement?.play();
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.videoElement = this.videoElementRef?.nativeElement;
      this.videoContainerElement = this.videoContainerRef?.nativeElement;
      this.initPlayer();
    } else {
      console.error('Browser not supported!');
    }
  }
}
