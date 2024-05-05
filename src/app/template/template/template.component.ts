import { Component } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [ContainerComponent,ToolbarComponent,SidebarComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

}
