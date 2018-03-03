import { Component, OnInit } from '@angular/core';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'app-chiffrage',
	templateUrl: './chiffrage.component.html',
	styleUrls: ['./chiffrage.component.css']
})
export class ChiffrageComponent implements OnInit {

	lines;
	hourlyRate;
	jsonStr;
	json;
	price;

	constructor(private http: Http) {
		let this_ = this;
		this.http.get("assets/default-chiffrage.json").subscribe(data => {
			this_.json = JSON.parse((<any>data)._body);
			this_.jsonStr = JSON.stringify(this_.json, null, 4);
			this_.hourlyRate = this_.json['hourly-rate'];
			this_.lines = this_.json.lines;
		});
	}

	ngOnInit() {
	}
	
	updateJsonStr() {
		this.jsonStr = JSON.stringify(this.json, null, 4);
	}

	updatePrice() {
		let price = 0;
		for(let k in this.lines) {
			let line = this.lines[k];
			price += line.price;
		}
		this.price = price;
	}
	
	childPriceUpdated(event) {
		this.lines[event.id].price = event.price;
		this.json.lines = this.lines;
		this.updatePrice();
		this.updateJsonStr();
	}
	
	jsonChanged(event) {
		try {
			this.json = JSON.parse(event.target.value);
			this.jsonStr = JSON.stringify(this.json, null, 4);
			this.hourlyRate = this.json['hourly-rate'];
			this.lines = this.json.lines;
		} catch(e) {
			console.error("invalide json")
		}
	}

}
