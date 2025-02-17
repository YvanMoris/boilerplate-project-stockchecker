'use strict';
const axios = require('axios');
module.exports = function (app) {
// 📌 Función para obtener el precio de una acción
  function getStockPrice  (symbol) {
    const url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote';
    return axios.get(url)
    .then(response => response.data.latestPrice)
    .catch( () => null); // Si la acción no existe

  };
  app.route('/api/stock-prices')
    .get(function (req, res){
      let { stock, like } = req.query;
      let stocks = Array.isArray(stock) ? stock : [stock];
      const userIP = anonymizeIP(req.ip);

      //Construimos res.json en función del request:
      //  stock, stock+true, stock+stock, stock+stock+true
      let stockData = [];
      for(let i = 0; i< stocks.length; i++){
        let symbol = stocks[i];
        let price = getStockPrice(symbol);
        stockData.push({
          "stock" : symbol.toUpperCase(),
          "price" : price
        });
      }
      
      if (stocks.length === 1) {
        res.json({ stockData: stockData[0] });
      } else if (stocks.length === 2) {
        res.json({
          stockData: [
            stockData[0],
            stockData[1]
          ]
        });
      }
    });
    
};
