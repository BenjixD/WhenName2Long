function expected_loan_completion(start_date, interest_rate, payment, balance, period, type)
{
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

	Math.ceil(result);

	if(period == 'Daily')
	{
		est_end_date = start_date + result;
	}

	else if (period == "Weekly")
	{
		est_end_date = start_date + 7 * result;
	}

	else if (period == "Monthly")
	{
		var day = start_date.getDate();
		var start_month = start_date.setDate(1);

		est_end_date = start_month.setMonth(start_month.getMonth + result);
	}

	else if (period == "Yearly")
	{
		est_end_date = start_date + 365*result + Math.floor(result/4);
	}

	return est_end_date;
}