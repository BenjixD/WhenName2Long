
module.exports = {

expected_loan_completion: function(start_date, interest_rate, payment, balance, period, type)
{
	console.log(start_date + " " + interest_rate + " " + payment + " " + balance + " " + period + " " + type);
	var interest = 1 + interest_rate; 
	var result;
	var est_end_date;


	if(type == 'Annuity')
	{
		var a = Math.log(1 - (interest_rate * balance)/(payment));
		var b = Math.log(interest);

		result = -1 * a/b;
	}

	else if(type == "Annuity Due")
	{
		var a = Math.log(1 - (interest_rate * balance)/(payment * interest));
		var b = Math.log(interest);


		result = -1 * a/b;
	}

	result = Math.ceil(result);

	if(period == 'Daily')
	{
		start_date.setDate(start_date.getDate() + result);
		est_end_date = start_date;
	}

	else if (period == "Weekly")
	{
		start_date.setDate(start_date.getDate() + 7 * result) ;
		est_end_date = start_date;
	}

	else if (period == "Monthly")
	{
		var day = start_date.getDate();
		var start_month = start_date;
		//start_month.setDate(1);

		start_month.setMonth(start_month.getMonth() + result);

		est_end_date = start_month;
	}

	else if (period == "Yearly")
	{
		console.log(result + ", " + start_date.getFullYear());
		start_date.setYear(start_date.getFullYear() + result);
		est_end_date = start_date;
	}
	console.log(est_end_date + " " + typeof est_end_date);
	return est_end_date.toDateString();
	}	
}