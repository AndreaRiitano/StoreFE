import { Component } from '@angular/core';
import {User} from '../../models/user.model'
import {UserService} from '../../services/user.service';
import {KeycloakService} from '../../security/keycloak/keycloak.service'

@Component({
  selector: 'app-personalarea',
  templateUrl: './personalarea.component.html',
  styleUrl: './personalarea.component.css'
})
export class PersonalAreaComponent {

  user : User | null = null;

  constructor(
    private userService: UserService,
    public keycloakService: KeycloakService
  ) {

  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (user) => {
        this.user = user;
      }
    )
  }

}
