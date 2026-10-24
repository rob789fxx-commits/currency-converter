import React from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("EUR");
  const [toCurrency, setToCurrency] = React.useState("USD");
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);

  const ratesRef = React.useRef({});

  // Загружаем курсы валют
  React.useEffect(() => {
    fetch("https://api.frankfurter.dev/v1/latest?base=USD")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не удалось загрузить курсы валют");
        }

        return res.json();
      })
      .then((json) => {
        ratesRef.current = { ...json.rates, USD: 1 };

        const result = ratesRef.current.EUR / ratesRef.current.USD;

        setFromPrice(result.toFixed(3));
        setToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить информацию");
      });
  }, []);

  // Изменение суммы слева
  const onChangeFromPrice = (value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];

    setFromPrice(value);
    setToPrice(result.toFixed(3));
  };

  // Изменение суммы справа
  const onChangeToPrice = (value) => {
    const result =
      (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;

    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  // Изменение валюты слева
  const onChangeFromCurrency = (currency) => {
    setFromCurrency(currency);

    if (!ratesRef.current[currency]) return;

    const price = fromPrice / ratesRef.current[currency];
    const result = price * ratesRef.current[toCurrency];

    setToPrice(result.toFixed(3));
  };

  // Изменение валюты справа
  const onChangeToCurrency = (currency) => {
    setToCurrency(currency);

    if (!ratesRef.current[currency]) return;

    const result =
      (ratesRef.current[fromCurrency] / ratesRef.current[currency]) * toPrice;

    setFromPrice(result.toFixed(3));
  };

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={onChangeFromCurrency}
        onChangeValue={onChangeFromPrice}
      />

      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={onChangeToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
