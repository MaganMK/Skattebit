import {Transaction} from "../Transaction.js";

export function savePoloniexTransaction(data)
{

    //Poloniex:
    //0 Date 20/01/2018 18:08
    //1 Market SC/BTC
    //2 Category Exchange
    //3 Type Sell
    //4 Price 0.00000375
    //5 Amount 986.8518663
    //6 Total 0.00370069
    //7 Fee 0.25%
    //8 Order Number 19358155617
    //9 Base Total Less Fee 0.00369144
    //10 Quote Total Less Fee -986.8518663

    let transactions = [];
    data = data.split("\n");
    data = data.slice(1);
    while (data[data.length-1].length == 0)
    {
        data.splice(-1,1);
    }
    for (let index in data)
    {
        let lines = data[index].split(",");
        if (lines[0].length == 0)
        {
            continue;
        }
        if (lines[2] == "Exchange")
        {
            let currencies = lines[1].split("/");
            let date = createDate(lines[0]);
            let type = lines[3]; //SELL/BUY
            let buyTransaction;
            let sellTransaction;
            if (type == "Buy")
            {
                buyTransaction = new Transaction(currencies[0], lines[5], date, false, "Poloniex");
                sellTransaction = new Transaction(currencies[1], lines[6], date, true, "Poloniex");
            }
            else
            {
                buyTransaction = new Transaction(currencies[1], lines[6] , date, false, "Poloniex");
                sellTransaction = new Transaction(currencies[0], lines[5], date,  true, "Poloniex");
            }
        transactions.push(sellTransaction);
        transactions.push(buyTransaction);
        }
    }
    return transactions;
}

function createDate(dateString)
{
    var d;
    let switchDateString = dateString.substring(3,5) + "/" + dateString.substring(0,2) + "/" + dateString.substring(6,dateString.length);
    d = new Date(switchDateString);
    if (isNaN( d.getTime()))
    {
        d = new Date(dateString);
    }
    return d;
}


