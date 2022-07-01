import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup; 
  constructor(
    public fb: FormBuilder,
              public _router: Router,
              private _service: ServiceService
  ) { 
    this.registerForm = this.buildForm();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this._service.registerUser(this.registerForm.value).subscribe(
      data => {
        this._router.navigateByUrl('');
      },
      err => {
        alert('Falló el registro, intentelo de nuevo')
      }
    )
  }
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',Validators.required],
      email: ['', Validators.compose([Validators.required,Validators.email,Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(6)])]
    })
  }

}
