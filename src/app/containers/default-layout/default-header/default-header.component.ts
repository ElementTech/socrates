import { Component, Input ,NgZone} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['default-header.component.scss'],
  providers: [AuthenticationService]
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService,public auth: AuthenticationService,
    private router: Router,
    private ngZone: NgZone,) {
    super();
  }

  logout()
  {
    this.auth.logout()
    this.ngZone.run(() => this.router.navigateByUrl('/login'))
  }
  ngAfterViewInit()
  {
    // Designed by: Hoang Nguyen
    // Original image: https://dribbble.com/shots/5919154-Tab-Bar-Label-Micro-Interaction

    const buttons = document.querySelectorAll(".menu__item");
    let activeButton = document.querySelector(".menu__item.active");

    buttons.forEach(item => {

        const text = item.querySelector(".menu__text");
        setLineWidth(text, item);

        window.addEventListener("resize", () => {
            setLineWidth(text, item);
        })
        item.addEventListener("click", function() {
            if (this.classList.contains("active")) return;
            
            this.classList.add("active");
            
            if (activeButton) {
                activeButton.classList.remove("active");
                activeButton.querySelector(".menu__text").classList.remove("active");
            }
            
            handleTransition(this, text);
            activeButton = this;

        });

        
        });


        function setLineWidth(text, item) {
            const lineWidth = text.offsetWidth + "px";
            item.style.setProperty("--lineWidth", lineWidth);
        }

        function handleTransition(item, text) {

            item.addEventListener("transitionend", (e) => {

                if (e.propertyName != "flex-grow" || 
                !item.classList.contains("active")) return;

                text.classList.add("active");
                
            });

        }
      }
}
