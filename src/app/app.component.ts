import { Component, OnInit } from '@angular/core';

import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-testing-services';

  ngOnInit(): void {
    const calculator = new Calculator();

    const rta = calculator.multiply(3, 3);
    const rta2 = calculator.multiply(2, 0);
  }
}
