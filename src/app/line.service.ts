import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class LineService {

	constructor() { }
	
	private priceAnnouncedSource = new Subject();
	priceAnnounced$ = this.priceAnnouncedSource.asObservable();

	announceNewPrice(id: number, price: number) {
		console.log('announceNewPrice', id, price);
		this.priceAnnouncedSource.next({id:id, price:price});
	}


}
