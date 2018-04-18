

export class Transaction {
  constructor(name, quantity, date, isSale, site) {
    this.name = fixName(name);
    this.quantity = quantity;
    this.isSale = isSale;
    this.date = date;
    this.unitPrice = calculateUnitPrice(this);
    this.totalPrice = this.quantity * this.unitPrice;
    this.site = site;
    this.representation = this.toString();
    sleepFor(70);

  }

  toString() {
    return this.name + "," + this.prettyDate() + "," + this.name + "," + this.prettyValue(this.quantity) + "," + this.prettyValue(this.unitPrice) + "," + this.prettyValue(this.totalPrice) + "," + this.site;
  }

  prettyDate() {
        return this.date.getDate() + "/" + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + " " + this.date.getHours() + ":" + this.date.getMinutes();
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
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + tx.name + "&tsyms=" + "NOK" + "&ts=" + timestamp;
    let res = $.ajax({
            type: "GET",
            url: url,
            cache: false,
            async: false
        }).responseText;
    let json = JSON.parse(res);
    return json[tx.name]["NOK"];
}

function fixName(name) {
    let fixes = {"ANS": "NEO", "BCC": "BCH"}
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
