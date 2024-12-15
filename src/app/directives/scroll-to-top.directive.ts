import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective {
  @HostListener('window:load')
  @HostListener('window:resize')
  onEvent() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}