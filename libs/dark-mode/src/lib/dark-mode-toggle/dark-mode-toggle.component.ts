import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { LocalStorageService } from '@jdrks/shared';
import { WINDOW } from '@jdrks/shared';

@Component({
  selector: 'jdrks-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
})
export class DarkModeToggleComponent implements OnInit {
  @Input()
  darkModeEnabled = false;

  @Output()
  darkModeEnabledChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private readonly localStorageService: LocalStorageService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    if (this.window.matchMedia('(prefers-color-scheme: dark)')) {
      this.toggleDarkMode(true);
      return;
    }

    if (this.window.matchMedia('(prefers-color-scheme: light)')) {
      this.toggleDarkMode(false);
      return;
    }

    const themeFromLocalStorage = this.localStorageService.getItem('theme');
    if (themeFromLocalStorage) {
      this.toggleDarkMode(themeFromLocalStorage === 'dark');
      return;
    }
  }

  toggleDarkMode(darkModeEnabled: boolean) {
    this.darkModeEnabled = darkModeEnabled;
    this.darkModeEnabledChange.emit(darkModeEnabled);

    const theme = darkModeEnabled ? 'dark' : 'light';
    this.localStorageService.setItem('theme', theme);
  }
}
