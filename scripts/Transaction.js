var globalCounter = 0;

export class Transaction {
    constructor(name, quantity, date, isSale, site) {
        globalCounter++;
        this.name = fixName(name);
        this.quantity = quantity;
        this.isSale = isSale;
        this.date = date;
        this.unitPrice = calculateUnitPrice(this);
        this.totalPrice = this.quantity * this.unitPrice;
        this.site = site;
        this.representation = this.toString();

        if(globalCounter >= 280)
        {
            sleepFor(350); // Må senke raten betraktelig for å ikke gå over "300 uthentinger pr min"-grensen til apiet
        }
        else
        {
            sleepFor(70);
        }
    }

    toString() {
        let sale = (this.isSale ? "Salg" : "Kjøp");
        return this.name + "," + this.prettyDate() + "," + sale + "," + this.prettyValue(this.quantity) + "," + this.prettyValue(this.unitPrice) + "," + this.prettyValue(this.totalPrice) + "," + this.site;
    }

    prettyDate() {
        let d = this.addZero(this.date.getDate());
        let m = this.addZero(this.date.getMonth()+1);
        let h = this.addZero(this.date.getHours());
        let min = this.addZero(this.date.getMinutes());
        return  d + "/" + m + "/" + this.date.getFullYear() + " " + h + ":" + min;
    }

    addZero(number)
    {
        return number < 10 ? "0" + number : number;
    }

    prettyValue(value) {
        if (value < 10) {
            return parseFloat(value).toFixed(5);
        }
        else if (value < 100) {
            return parseFloat(value).toFixed(4);
        }
        return parseFloat(value).toFixed(2);
    }

}

function calculateUnitPrice(tx)
{
    let timestamp = new Date(tx.date).getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/histohour?fsym="
    + tx.name + "&tsym=" + "NOK" + "&toTs=" + timestamp;
    let res = $.ajax({
        type: "GET",
        url: url,
        cache: false,
        async: false
    }).responseText;
    let json = JSON.parse(res);
    return json["Data"][168]["open"]; //168 er den siste dataen man får

}

function fixName(name) {
    let fixes = {"ANS": "NEO", "BCC": "BCH", "IOTA": "IOT", "XBT": "BTC"};
    if (name in fixes)
    {
        return fixes[name]
    }
    return name
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

