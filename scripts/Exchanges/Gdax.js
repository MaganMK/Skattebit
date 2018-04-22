import {Transaction} from "../Transaction.js";


// trade id,product,side,created at,size,size unit,price,fee,total,price/fee/total unit
// 836483,ETH-EUR,SELL,2017-11-20T11:50:57.531Z,1.00000000,ETH,307.31,0.768275,306.541725,EUR
export function saveGdaxTransaction(data)
{
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
        try{
                let type = lines[2];
                let date = createDate(lines[3]);
                let currencies = lines[1].split("-");

                let buyTransaction;
                let sellTransaction;

            if(type == "SELL")
                {

                    sellTransaction = new Transaction(currencies[0], lines[4], date, true, "Gdax");

                    if(currencies[1] == "EUR" || currencies[1] == "USD" || currencies[1] == "GBP")
                    {

                    }
                    else
                    {
                        buyTransaction = new Transaction(currencies[1], lines[7], date, false, "Gdax");
                    }

                }
                else
                {
                    buyTransaction = new Transaction(currencies[0], lines[4], date, false, "Gdax");

                    if(currencies[1] == "EUR" || currencies[1] == "USD" || currencies[1] == "GBP")
                    {

                    }
                    else
                    {
                        sellTransaction = new Transaction(currencies[1], lines[7], date, false, "Gdax");

                    }
                }

                if(sellTransaction !=  null)
                {
                    transactions.push(sellTransaction);
                }

                if(buyTransaction != null)
                {
                    transactions.push(buyTransaction);
                }



        }
        catch (e) {

        }

    }
    return transactions;
}


function createDate(dateString)
{
    dateString = dateString.substring(5,7) + "/" + dateString.substring(8,10) + "/" + dateString.substring(0,4) + " " + dateString.substring(11,19);
    return new Date(dateString);
}