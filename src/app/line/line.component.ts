import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Line } from './line';
import { LineService } from '../line.service';

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

	@Output() priceUpdated = new EventEmitter<any>();
	@Output() removedSelf = new EventEmitter<any>();

	constructor() {
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
	
	removeSelf() {
		this.removedSelf.next(this.id);
	}
	
	removeChild(id) {
		this.line.lines.splice(id, 1);
		this.line.time = '';
		this.line.difficulty = 1;
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
		this.priceUpdated.next({id:this.id, price:this.line.price});
	}
	
	childPriceUpdated(event) {
		console.log(event)
		this.line.lines[event.id].price = event.price;
		this.updateprice();
	}

}
