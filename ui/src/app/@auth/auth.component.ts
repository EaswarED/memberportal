/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'mw-auth',
  styleUrls: ['./auth.scss'],
  template: `	<div class="mw-content">
  <div toastContainer></div>
			<router-outlet></router-outlet>
      </div>
`
})
export class AuthComponent implements OnDestroy {
  alive: boolean = true;
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;
  constructor(private toastrService: ToastrService) {
    this.initMenu();
  }

  private initMenu() { }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
