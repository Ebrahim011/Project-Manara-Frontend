import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '@project-manara-frontend/services';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  @Input('hasPermission') permission!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const user = this.userService.currentUser;

    if (!user || !user.permissions?.includes(this.permission)) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}
