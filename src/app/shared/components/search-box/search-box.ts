import { Component, effect, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-search-box',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  readonly placeholder = input('Search...');
  readonly searchChange = output<string>();

  protected readonly control = new FormControl('', { nonNullable: true });

  private readonly value = toSignal(
    this.control.valueChanges.pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged()),
    { initialValue: '' },
  );

  constructor() {
    effect(() => this.searchChange.emit(this.value()));
  }

  clear(): void {
    this.control.setValue('');
  }
}
