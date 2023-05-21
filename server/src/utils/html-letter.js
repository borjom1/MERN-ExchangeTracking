const header = `
<html lang="">
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      font-family: Calibri, serif;
      color: aliceblue;
    }

    .colored {
      margin-top: 15px;
      font-size: 30px;
      font-weight: 600;
      color: #53d9d2;
    }

    .desc {
      margin-top: 5px;
      margin-bottom: 10px;
      font-size: 20px;
    }

    .bg {
      background-color: #191919;
      border-radius: 10px;
      margin: 6px 8px;
      padding: 8px 30px;
    }

    .container {
      margin-top: 20px;
      padding: 6px 16px;
      background-color: #1f1f1f;
      border-radius: 5px;
    }

    table {
      margin: 10px auto 20px;
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #363636;
    }

    .table-header {
      background-color: #2a2a2a;
    }

    .table-header > td {
      color: #53d9d2;
    }

    td {
      padding: 4px 6px;
    }
    
    .table-row:hover {
      background-color: #333d3b;
    }
    
    .date {
      background-color: #2a4d47;
      border-radius: 20px;
      padding: 3px 12px;
    }
    
    .ml-15 {
      margin-left: 15px;
    }
  </style>
  <title></title>
</head>
<body>
<div class="bg">
  <p class="colored">Hello!</p>
`;

const footer = `
<p style="font-size: 20px; margin-top: 40px; color: #dadada">Best regards,</p>
  <p style="font-size: 20px; margin-bottom: 20px; color: #e3e3e3">Reflect Service</p>
</div>
</body>
</html>
`;

function wrap(subscription, before, now, stocks = [], currencies = []) {

  const sub = `
    <p class="desc">
      Your 
      <b>${subscription.toLowerCase()}</b> 
      subscription service is glad to inform you data in period:
    </p>
  `;

  const periodContent = `
    <div style="display: flex; margin-bottom: 35px">
      <p class="date">${before.toUTCString()}</p>
      <p class="date ml-15">${now.toUTCString()}</p>
    </div>
  `;

  let stockContent = '';
  let currencyContent = '';

  // wrap stocks to html
  for (const stock of stocks) {
    const {symbol, fullName, startRate, rate, change} = stock;
    stockContent += `
      <tr class="table-row">
        <td>${fullName} (${symbol})</td>
        <td>${startRate} $</td>
        <td>${rate} $</td>
        <td>${change}%</td>
      </tr>
    `;
  }

  if (stocks.length) {
    stockContent = `
      <div class="container">
        <p>Stocks</p>
        <table>
          <tr class="table-header">
            <td>Stock</td>
            <td>Start rate (USD)</td>
            <td>Rate (USD)</td>
            <td>Change (24h)</td>
          </tr>
          ${stockContent}
        </table>
      </div>
    `;
  }

  // wrap currencies to html
  for (const currency of currencies) {
    const {base, native, rate, change} = currency;
    currencyContent += `
      <tr class="table-row">
        <td>${base.fullName}</td>
        <td>${native.fullName}</td>
        <td>${rate}</td>
        <td>${change}%</td>
      </tr>
    `;
  }

  if (currencies.length) {
    currencyContent = `
      <div class="container">
        <p>Currencies</p>
        <table>
          <tr class="table-header">
            <td>Base currency</td>
            <td>Native currency</td>
            <td>Rate</td>
            <td>Change</td>
          </tr>
          ${currencyContent}
        </table>
      </div>
    `;
  }

  return header.concat(sub, periodContent, stockContent, currencyContent, footer);
}

module.exports = {wrap};