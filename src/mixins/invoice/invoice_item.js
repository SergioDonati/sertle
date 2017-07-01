
function roundDecimals(num){
	return Math.round(num * 100) / 100;
}

module.exports.methods = {
	updateTot(item){
		window.console.log('try to update tot');
		try{
			const price = item.price;
			const qty = item.quantity;
			const iva = item.iva;
			const imponibile = roundDecimals(price * qty);
			const imposta = roundDecimals(imponibile * iva / 100);
			const tot = roundDecimals(imponibile + imposta);
			item.totPrice = tot;
		}catch(e){
			window.console.error(e);
		}
	},
	updatePrice(item){
		window.console.log('try to update price');
		try{
			const priceTot = roundDecimals(item.totPrice);
			const qty = item.quantity;
			const iva = item.iva;
			const imponibile = roundDecimals(priceTot / (1 + (iva/100)));
			const imposta = roundDecimals(imponibile * iva / 100);
			if (roundDecimals(imponibile + imposta) != priceTot){
				return new Error('L\'importo inserito non può generare un prezzo corretto, prova ad aumentare o diminuice di un decimale.');
				return;
			}
			const price = roundDecimals(imponibile / qty);
			item.price = price;
		}catch(e){
			window.console.error(e);
		}
	}
}
