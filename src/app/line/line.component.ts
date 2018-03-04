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

	constructor() {
		console.log();
	}
	
	ngOnInit() {
		setTimeout(() => this.updateprice())
	}
	
	ngOnChanges() {
		setTimeout(() => this.updateprice())
	}

	timeChanged(event) {
		console.log(event.target.value)
		this.line.time = event.target.value;
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
	}
	downSelf() {
		this.downedSelf.next(this.id);
	}
	leftSelf() {
		this.leftedSelf.next(this.id);
	}
	rightSelf() {
		this.rightedSelf.next(this.id);
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
	}
	downChild(id) {
		if(id < this.line.lines.length-1) {
			let tmp = Object.assign({}, this.line.lines[id+1]);
			this.line.lines[id+1] = this.line.lines[id];
			this.line.lines[id] = tmp;
		}
	}
	leftChild(id) {
		if(this.parentLines) {
			console.log(this.parentLines, this.id);
			let line = this.line.lines.splice(id, 1)[0];
			console.log(line);
			this.parentLines.splice(this.id+1, 0, line);
		}
		//console.log('leftChild', id, this.parentLines);
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
	}
	childPriceUpdated(event) {
		//console.log(event)
		this.line.lines[event.id].price = event.price;
		this.updateprice();
	}

}
