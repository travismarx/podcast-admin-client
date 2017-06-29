import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Car } from '../domain/car';

@Injectable()
export class API {

    constructor(private http: Http) { }


    getCarsSmall() {
        return this.http.get('assets/demo/data/cars-small.json')
            .toPromise()
            .then(res => <Car[]>res.json().data)
            .then(data => { return data; });
    }
}