import {Transaction} from "../Transaction.js";


// trade id,product,side,created at,size,size unit,price,fee,total,price/fee/total unit
// 836483,ETH-EUR,SELL,2017-11-20T11:50:57.531Z,1.00000000,ETH,307.31,0.768275,306.541725,EUR
export function saveGdaxTransaction(data)
{
    let transactions = [];
    data = data.split("\n");
    data = data.slice(1);
    console.log(data);

    while (data[data.length-1].length == 0)
    {
        data.splice(-1,1);
    }


    for (let index in data)
    {
        let lines = data[index].split(",");
        try{
                console.log(lines);
                let type = lines[2];
                let date = createDate(lines[3]);
                let currencies = line[1].split("-");

                let buyTransaction;
                let sellTransaction;

                if(type == "SELL")
                {
                    sellTransaction = new Transaction(currencies[0], line[4], date, true, "Gdax");
                    try
                    {
                        buyTransaction = new Transaction(currencies[1], line[8], date, false, "Gdax");
                    }
                    catch (e) {}
                }
                else
                {

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