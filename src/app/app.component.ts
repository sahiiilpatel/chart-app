import { Component, ViewChild } from '@angular/core';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { AddDataComponent } from './add-data/add-data.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabsModule,
    AddDataComponent,
    ViewDataComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chart-app';

  // Reference to the ViewDataComponent to trigger chart creation
  @ViewChild(ViewDataComponent) viewDataComponent!: ViewDataComponent;

  // Detect tab change and trigger chart creation if the second tab is active
  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.viewDataComponent.createChart(); // Call the chart creation when 2nd tab is selected
    }
  }
}
