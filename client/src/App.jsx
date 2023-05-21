import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import CurrenciesPage from "./pages/CurrenciesPage";
import StocksPage from "./pages/StocksPage";
import GainersPage from "./pages/GainersPage";
import LosersPage from "./pages/LosersPage";
import NotFoundPage from "./pages/NotFoundPage";
import CurrencyChartPage from "./pages/CurrencyChartPage";
import StockChartPage from "./pages/StockChartPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<NotFoundPage/>} />
          <Route path='currencies/'>
            <Route index element={<CurrenciesPage/>} />
            <Route path='chart' element={<CurrencyChartPage/>} />
          </Route>
          <Route path='stocks/'>
            <Route index element={<StocksPage/>}/>
            <Route path='chart' element={<StockChartPage/>}/>
          </Route>
          <Route path='gainers' element={<GainersPage/>} />
          <Route path='losers' element={<LosersPage/>} />
          <Route path='*' element={<NotFoundPage/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;