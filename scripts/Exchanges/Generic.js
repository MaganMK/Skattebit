import {Transaction} from "../Transaction.js";

//Må inneholde Tidspunkt (dd/mm/yyyy evt hh:mm:ss)	Valuta	Mengde	Type	Marked
export function saveGenericTransaction(data)
{
    let transactions = [];
    data = data.split("\n");
    let firstLine = data[0].split(",").concat("hei");
    data = data.slice(1);

    let pointers = {};
    for (let i in firstLine) {
        let val = firstLine[i].toLowerCase();
        pointers[val] = i;

    }
    while (data[data.length-1].length == 0)
    {
        data.splice(-1,1);
    }

    while (data[data.length-1].split(",")[0].length == 0)
    {
        data.splice(-1,1);
    }

    for (let index in data)
    {
        let lines = data[index].split(",");

        let name = lines[pointers["valuta"]];
        let qty = lines[pointers["mengde"]];
        let type = lines[pointers["type"]].toLowerCase();
        //let market = lines[pointers["marked"]];
        //market = (market.length == 0 ? "generisk" : market);
        let market = "Egendefinert";
        let date = createDate(lines[pointers["tidspunkt"]]);
        let tx;
        if (type == "kjop" || type == "kjopt" || type == "buy" || type == "bought")
        {
            tx = new Transaction(name, parseFloat(qty), date, false, market);
        }
        else if (type == "salg" || type == "solgt" || type == "sale" || type == "sold")
        {
            tx = new Transaction(name, parseFloat(qty), date, true, market);
        }
        transactions.push(tx);
    }
    return transactions;
}

function createDate(dateString)
{
    dateString = dateString.substring(3,5) + "/" + dateString.substring(0,2) + "/" + dateString.substring(6,dateString.length);
    return new Date(dateString);
}