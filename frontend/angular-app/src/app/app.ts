import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  template: `
    <div class="app-container">
      <mat-toolbar class="app-header">
        <mat-toolbar-row>
          <span>Employee Management Portal</span>
          <span class="flex-spacer"></span>
          <nav>
            <a mat-button routerLink="/employees">Employees</a>
            <a mat-button routerLink="/departments">Departments</a>
          </nav>
        </mat-toolbar-row>
      </mat-toolbar>
      <main>
        <div class="main-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .app-header {
      background-color: var(--header-bg);
      color: white;
    }
    .flex-spacer {
      flex: 1 1 auto;
    }
    nav a {
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      font-weight: 500;
    }
    .main-container {
      max-width: 80rem; /* 1280px */
      margin: 0 auto;
      padding: 2rem;
    }
  `,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
