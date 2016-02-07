// Quantify investment index; only working with houses atm

var market = require('../Schemas/market.js');



//alg: create debt. if debt->mortgage, index = 4, elseif debt->car, index = -4, else 0
function initIndex(loan) {
if(loan.product == 'Mortgage') 
	loan.investmentIndex = 4;
else if (loan.product == 'Car')
	loan.investmentIndex = -4;
}

function successUpIndex(loan1, loan2) {
	var successNegMult = 0.7;
	var successPosMult = 1.3;
	if (loan1.investmentIndex < 0)
		loan1.investmentIndex = loan1.investmentIndex * successNegMult;
	else
		loan1.investmentIndex = loan1.investmentIndex * successPosMult;
	loan1.save();
	if (loan2.investmentIndex < 0)
		loan2.investmentIndex = loan2.investmentIndex * successNegMult;
	else
		loan2.investmentIndex = loan2.investmentIndex * successPosMult;
	loan2.save();
}

function depreciateIndex (loan) {
	var depreciateMult = 0.95;
	if (loan.investmentIndex < 0) 
		// iCurr = iPrev - (iPrev * (1 - m))
		loan.investmentIndex = loan.investmentIndex - (loan.investmentIndex * (1-depreciateMult));
	else
		loan.investmentIndex = loan.investmentIndex * depreciateMult;
	loan.save();
}

// requestTrade gives all debt that are not user's

//procedure: click trade to requestTrade
// goes to page to select one of own debts to trade, then confirm
// if successful, then create market db entry + post trade to debt market
// 