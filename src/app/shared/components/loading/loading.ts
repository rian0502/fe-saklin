import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  readonly message = input<string>('Loading...');
  readonly diameter = input<number>(40);
}
