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
        alert('Fallo el registro, intentelo de nuevo')
      }
    )
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',Validators.required],
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required],
    })
  }

}
