import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private _http: HttpClient) { }

  registerUser(form: any){
    return this._http.post('http://localhost:3000/users/', form);
  }

  login(form: any){
    return this._http.post('http://localhost:3000/users/login', form);
  }
}
