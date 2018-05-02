import {Transaction} from "../Transaction.js";


export function saveKrakenTransaction(data)
{
    let transactions = [];
    data = data.split("\n");
    data = data.slice(1);

    while (data[data.length-1].length == 0)
    {
        data.splice(-1,1);
    }


    for (let index in data) {
        let lines = [];

        if (data[index].includes(";"))
        {
            lines = data[index].split(";");
        }
        else
        {
            lines = data[index].split(",");
        }


        if (lines.length == 1)
        {
            continue;
        }

        console.log(lines);
        let type = lines[3];
        if(type.includes("\""))
        {
            type = type.replace("\"", '');
            type = type.replace("\"", '');
            type = type.replace("\"", '');
            type = type.replace("\"", '');
        }


        let currency = lines[5];


        if(currency.includes("\""))
        {
            currency = currency.substring(3, currency.length);
            currency = currency.replace("\"", '');
            currency = currency.replace("\"", '');
        }
        else if(currency != "BCH"){
            currency = currency.substring(1, currency.length);
        }



        if(currency == "EUR" || currency == "USD" || currency == "GBP")
        {
            continue;
        }

        let amount = lines[6];
        let date = createDate(lines[2]);


        let transaction;

        if(type == "deposit")
        {
            transaction = new Transaction(currency, amount, date, false, "Kraken");
        }
        else if(type == "trade")
        {
            if(amount > 0)
            {
                transaction = new Transaction(currency, Math.abs(amount), date, false, "Kraken");
            }
            else {
                transaction = new Transaction(currency, Math.abs(amount), date, true, "Kraken");
            }
        }
        else if(type == "withdrawal")
        {
            transaction = new Transaction(currency, Math.abs(amount), date, true, "Kraken");
        }
        transactions.push(transaction);

    }
    return transactions;
}


function createDate(dateString)
{
    if(dateString.includes("\""))
    {
        dateString = dateString.substring(2,21);

    }
    dateString = dateString.substring(5,7) + "/" + dateString.substring(8,10) + "/" + dateString.substring(0,4) + " " + dateString.substring(11,16);
    return new Date(dateString);
}