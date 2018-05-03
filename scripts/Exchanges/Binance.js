import {Transaction} from "../Transaction.js";

export function saveBinanceTransaction(data)
{
    //0 date = 2018-01-07 20:42:29
    //1 market = VENBTC
    //2 type = BUY (SELL)
    //3 price (pris per enhet i btc?) = 0.0002915
    //4 amount (antall enheter av currency 1) = 34
    //5 total (totalpris i btc) = 0.009911
    //6 fee (gebyr i feecoin) = 0.034
    //7 fee coin = VEN
    let transactions = [];
    data = data.slice(1);
    for (let index in data)
    {
        let lines = data[index].split(',').join(',').split(';').join(',').split(',');

        if (lines[0].length == 0)
        {
            continue;
        }

        let type = lines[2];
        let currencies = getTradingPair(lines[1]);
        let date = createDate(lines[0]);
        let buyTransaction;
        let sellTransaction;
        if (type == "SELL")
        {

            sellTransaction = new Transaction(currencies[0], lines[4], date, true, "Binance");
            buyTransaction = new Transaction(currencies[1], lines[5], date, false, "Binance");
        }
        else
        {
            buyTransaction = new Transaction(currencies[0], lines[4], date, false, "Binance");
            sellTransaction = new Transaction(currencies[1], lines[5], date, true, "Binance");
        }
        transactions.push(sellTransaction);
        transactions.push(buyTransaction);
    }

    return transactions;
}

function getTradingPair(line)
{
    let result = [];
    if (line.length == 7)
    {
        result.push(line.substring(0,4));
        result.push(line.substring(4,line.length));
    }
    else
    {
        result.push(line.substring(0,3));
        result.push(line.substring(3,line.length));
    }
    return result
}

function createDate(dateString)
{
    return new Date(dateString);
}

