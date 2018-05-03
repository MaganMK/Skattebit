import {Transaction} from "../Transaction.js";

export function saveBitfinexTransaction(data)
{
    let transactions = [];
    data = data.slice(1);

    for (let index in data)
    {
        let line = data[index];

        let currencies = line[1].split("/");

        let date = createDate(line[6]);
        let amount = line[2];

        let tx;

        if(amount < 0)
        {
            tx = new Transaction(currencies[0], Math.abs(amount), date, true, "Bitfinex");
        }
        else
        {
            tx = new Transaction(currencies[0], amount, date, false, "Bitfinex");
        }
        transactions.push(tx);
    }
    return transactions;
}

function createDate(dateString)
{
    dateString = dateString.substring(5,7) + "/" + dateString.substring(8,10) + "/" + dateString.substring(0,4) + " " + dateString.substring(11,16);
    return new Date(dateString);
}