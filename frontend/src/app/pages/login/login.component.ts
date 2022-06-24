import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  
  constructor(public fb: FormBuilder,
              public _router: Router,
              private _service: ServiceService) {
    this.loginForm = this.buildForm();
  }

  ngOnInit(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
  }

  onSubmit() {
    this._service.login(this.loginForm.value).subscribe((data: any) => {
      this._router.navigateByUrl('/board');
      localStorage.setItem('userId', data.id);
      localStorage.setItem('name', data.name);
    }, err => {
      alert('Falló autenticación, credenciales inválidas');
    });
  }

  buildForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required],
    })
  }

}
