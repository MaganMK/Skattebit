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


        let currencie = lines[5];


        if(currencie.includes("\""))
        {
            currencie = currencie.substring(3, currencie.length);
            currencie = currencie.replace("\"", '');
            currencie = currencie.replace("\"", '');
        }
        else if(currencie != "BCH"){
            currencie = currencie.substring(1, currencie.length);
        }



        if(currencie == "EUR" || currencie == "USD" || currencie == "GBP")
        {
            continue;
        }

        let amount = lines[6];
        let date = createDate(lines[2]);


        let transaction;

        if(type == "deposit")
        {
            transaction = new Transaction(currencie, amount, date, false, "Kraken");
        }
        else if(type == "trade")
        {
            if(amount > 0)
            {
                transaction = new Transaction(currencie, amount, date, false, "Kraken");
            }
            else {
                transaction = new Transaction(currencie, -amount, date, true, "Kraken");
            }
        }
        else if(type == "withdrawal")
        {
            transaction = new Transaction(currencie, -amount, date, true, "Kraken");
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