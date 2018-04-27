import {Transaction} from "../Transaction.js";


export function saveBitfinexTransaction(data)
{
    console.log(data);


    let transactions = [];
    data = data.split("\n");
    data = data.slice(1);

    while (data[data.length-1].length == 0)
    {
        data.splice(-1,1);
    }

    for (let index in data)
    {
        let line;
        if(data[index].match(";"))
        {
            line = data[index].split(";");
        }
        else
        {
            line = data[index].split(",")
        }


        if (line[0].length == 0)
        {
            continue;
        }

        let currencies = line[1].split("/");

        let date = createDate(line[6]);
        let amount = line[2];



        let tx;

        if(amount < 0)
        {
            tx = new Transaction(currencies[0], -amount, date, true, "Bitfinex");
        }
        else
        {
            tx = new Transaction(currencies[0], amount, date, false, "Bitfinex");
        }
        console.log(tx);
        transactions.push(tx);
    }

    return transactions;
}

function createDate(dateString)
{
    dateString = dateString.substring(5,7) + "/" + dateString.substring(8,10) + "/" + dateString.substring(0,4) + " " + dateString.substring(11,16);
    console.log(dateString);
    return new Date(dateString);
}