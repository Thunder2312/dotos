import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]'
})
export class PasswordToggleDirective {
  private _show = false;
  private button: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Create toggle button (eye icon)
    this.button = this.renderer.createElement('button');
    this.renderer.setAttribute(this.button, 'type', 'button');
    this.renderer.setAttribute(this.button, 'aria-label', 'Toggle password visibility');
    this.renderer.addClass(this.button, 'eye-button');

    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'fa');
    this.renderer.addClass(icon, 'fa-eye');

    this.renderer.appendChild(this.button, icon);

    // Insert button after the input field
    const parent = this.renderer.parentNode(this.el.nativeElement);
    this.renderer.appendChild(parent, this.button);

    // Listen to click events
    this.renderer.listen(this.button, 'click', () => {
      this.toggle(icon);
    });
  }

  private toggle(icon: HTMLElement): void {
    this._show = !this._show;

    // Toggle input type
    const type = this._show ? 'text' : 'password';
    this.renderer.setAttribute(this.el.nativeElement, 'type', type);

    // Toggle icon class
    this.renderer.removeClass(icon, this._show ? 'fa-eye' : 'fa-eye-slash');
    this.renderer.addClass(icon, this._show ? 'fa-eye-slash' : 'fa-eye');
  }
}
