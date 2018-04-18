//from backend.Transaction import * ;
//from backend.Exchanges.Exchange import Exchange;


import {Transaction} from "../Transaction.js";


// 0 --> id = 8a9bf807 - f899 - 4c07 - 95b8 - 9d312ef1e192
// 1 --> exchange = BTC - ADA
// 2 --> type = LIMIT_SELL
// 3 --> quantity = 331
// 4 --> limit = 0.00006166
// 5 --> commision 0.00005109
// 6 --> price (første currency) = 0.02043925
// 7 --> opened = 01 / 08 / 2018 08:35
// 8 --> closed = 01 / 08 / 2018 08:35
export function saveBittrexTransaction(data)
{
    let transactions = [];
    data = data.split("\n");
    data = data.slice(1);
    for (let index in data)
    {
        let line = data[index].split(",");
        let type = line[2];
        let currencies = line[1].split("-");
        let date = createDate(line[8]); // TODO: Denne  å vi fikse

        let buyTransaction;
        let sellTransaction;
        if(type == "LIMIT_SELL")
        {
            buyTransaction = new Transaction(currencies[0], line[6], date, false, "Bittrex");
            sellTransaction = new Transaction(currencies[1], line[3], date, true, "Bittrex");
        }
        else {
            sellTransaction = new Transaction(currencies[0], line[6], date, true, "Bittrex");
            buyTransaction = new Transaction(currencies[1], line[3], date, false, "Bittrex");
        }
        transactions.push(sellTransaction);
        transactions.push(buyTransaction);
    }

    return transactions;
}


// TODO: se på denne
function createDate(dateString)
{
    // console.log(dateString);
    return new Date(dateString);
}


