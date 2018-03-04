import { Component, OnInit, Input, Output, EventEmitter, Host, Optional } from '@angular/core';
import { Line } from './line';
import { LineService } from '../line.service';
import { ChiffrageComponent } from '../chiffrage/chiffrage.component';

class OtherService {}

@Component({
	selector: 'app-line',
	templateUrl: './line.component.html',
	styleUrls: ['./line.component.css'],
	providers: [LineService]
})
export class LineComponent implements OnInit {

	@Input() line: Line;
	@Input() id: number;
	@Input() hourlyRate: number;
	@Input() parentLine: Line;
	@Input() parentLines: any;
	@Input() parentId: number;

	@Output() priceUpdated = new EventEmitter<any>();
	@Output() removedSelf = new EventEmitter<any>();
	@Output() uppedSelf = new EventEmitter<any>();
	@Output() downedSelf = new EventEmitter<any>();
	@Output() rightedSelf = new EventEmitter<any>();
	@Output() leftedSelf = new EventEmitter<any>();

	difficulties;
	jehMax;
	unitPrice;

	constructor() {
		console.log();
		this.difficulties = [
			{value:0.5, text:"Très simple"},
			{value:0.75, text:"Simple"},
			{value:1, text:"Standard"},
			{value:1.25, text:"Difficile"},
			{value:1.5, text:"Très difficile"},
		]
		this.jehMax = 400;
	}
	
	ngOnInit() {
		setTimeout(() => this.updateprice())
	}
	
	ngOnChanges() {
		setTimeout(() => this.updateprice())
	}

	titleChanged(event) {
		this.line.title = event.target.value;
		this.updateprice();
	}
	timeChanged(event) {
		this.line.time = event.target.value;
		this.updateprice();
	}
	difficultyChanged(event) {
		this.line.difficulty = event.target.value;
		this.updateprice();
	}

	add() {
		let time;
		let title = 'Nouvelle phase';
		let difficulty = 1;
		if(!this.line.lines) {
			this.line.lines = [];
			difficulty = this.line.difficulty;
			time = (<any>this.line.time);
		}
		this.line.lines.push({
			title: title,
			time: time,
			difficulty: difficulty
		});
	}

	// Self
	removeSelf() {
		this.removedSelf.next(this.id);
	}
	upSelf() {
		this.uppedSelf.next(this.id);
		this.updateprice();
	}
	downSelf() {
		this.downedSelf.next(this.id);
		this.updateprice();
	}
	leftSelf() {
		this.leftedSelf.next(this.id);
		this.updateprice();
	}
	rightSelf() {
		this.rightedSelf.next(this.id);
		this.updateprice();
	}
	updateprice() {
		if(!this.line.lines) {
			this.line.price = this.line.time * this.line.difficulty * this.hourlyRate;
		} else {
			let price = 0;
			for(let k in this.line.lines) {
				let line = this.line.lines[k];
				price += line.price;
			}
			this.line.price = price;
		}
		if(!this.line.price) {
			this.line.price = 0.0;
		}
		if(!this.line.unitPrice) {
			this.line.unitPrice = this.jehMax;
		}
		this.line.jehCount = Math.round(this.line.price / this.line.unitPrice);
		this.priceUpdated.next({id:this.id, price:this.line.price});
	}

	// Child
	removeChild(id) {
		this.line.lines.splice(id, 1);
		this.line.time = '';
		this.line.difficulty = 1;
		this.updateprice();
	}
	upChild(id) {
		if(id > 0) {
			let tmp = Object.assign({}, this.line.lines[id-1]);
			this.line.lines[id-1] = this.line.lines[id];
			this.line.lines[id] = tmp;
		}
		this.updateprice();
	}
	downChild(id) {
		if(id < this.line.lines.length-1) {
			let tmp = Object.assign({}, this.line.lines[id+1]);
			this.line.lines[id+1] = this.line.lines[id];
			this.line.lines[id] = tmp;
		}
		this.updateprice();
	}
	leftChild(id) {
		if(this.parentLines) {
			let line = this.line.lines.splice(id, 1)[0];
			this.parentLines.splice(this.id+1, 0, line);
			if(!this.line.lines.length) {
				delete this.line.lines;
			}
		}
		this.updateprice();
	}
	rightChild(id) {
		if(id > 0) {
			let tmp = this.line.lines[id];
			if(!this.line.lines[id-1].lines) {
				this.line.lines[id-1].lines = [];
			}
			this.line.lines[id-1].lines.push(tmp);
			this.line.lines.splice(id, 1);
		}
		this.updateprice();
	}
	childPriceUpdated(event) {
		if(this.line.lines[event.id]) {
			this.line.lines[event.id].price = event.price;
		}
		this.updateprice();
	}

}
