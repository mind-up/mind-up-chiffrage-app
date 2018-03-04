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
	targetPrice;
	targetManagement;
	targetFee;
	managementCount;
	tva;
	ht;
	ttc;
	jeh;
	tvaRate;
	fee;

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
		let targetPrice = 0;
		let jeh = 0;
		let ht = 0;
		for(let k in this.lines) {
			let line = this.lines[k];
			targetPrice += line.price;
			jeh += line.jehCount;
			ht += line.unitPrice * line.jehCount;
		}
		this.targetPrice = targetPrice;
		this.targetManagement = this.json['management-max'] * this.targetPrice;
		this.targetManagement = (parseInt(this.targetManagement / 5))*5.0;
		this.targetFee = this.json['application-fee-max'] * (this.targetPrice + this.targetManagement);
		this.targetFee = (parseInt(this.targetFee / 5 )) * 5.0;
		this.targetHT = this.targetPrice + this.targetManagement + this.targetFee;
		this.targetTVA = this.targetHT * this.json.tva;
		this.targetTTC = this.targetHT + this.targetTVA;

		this.managementUnitPrice = this.json['jeh-max'];
		this.managementCount = Math.max(Math.round(this.targetManagement / this.managementUnitPrice), 1.0);
		jeh += this.managementCount;
		ht += this.managementCount * this.managementUnitPrice;
		this.fee = ht * this.json['application-fee-max'];
		ht += this.fee;
		this.jeh = jeh;
		this.ht = ht;
		this.tva = this.ht * this.json.tva;
		this.ttc = this.ht + this.tva;
		this.tvaRate = this.json.tva;
	}
	
	upChild(id) {
		if(id > 0) {
			let tmp = Object.assign({}, this.lines[id-1]);
			this.lines[id-1] = this.lines[id];
			this.lines[id] = tmp;
		}
	}
	downChild(id) {
		if(id < this.lines.length) {
			let tmp = Object.assign({}, this.lines[id+1]);
			this.lines[id+1] = this.lines[id];
			this.lines[id] = tmp;
		}
	}
	rightChild(id) {
		if(id > 0) {
			let tmp = this.lines[id];
			if(!this.lines[id-1].lines) {
				this.lines[id-1].lines = [];
			}
			this.lines[id-1].lines.push(tmp);
			this.lines.splice(id, 1);
		}
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
			console.error("invalid json")
		}
	}

}
