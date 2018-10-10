import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-activation-success',
  templateUrl: './activation-success.component.html',
  styleUrls: ['./activation-success.component.scss']
})
export class ActivationSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      let cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i];
          let eqPos = cookie.indexOf("=");
          let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  }

}
