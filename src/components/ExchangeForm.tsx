import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { exchangeStore } from "../stores/exchange.store";
import { CurrencySelect } from "./CurrencySelect";
import { AmountInput } from "./AmountInput";
import styled from "styled-components";
import { DynamicIcon } from "lucide-react/dynamic";

const Card = styled.div`
  width: 500px;
  height: max-content;
  color: #3b3a3a;
  border-radius: 20px;
  background-color: rgba(211, 110, 213, 0.46);
  padding: 30px;
  box-shadow: 6px -6px 19px -10px rgba(167, 40, 169, 0.46) inset;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CardTitle = styled.h1`
  text-align: center;
`;

const Button = styled.button`
  border: 1px solid #e7e5e4;
  background-color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 6px -6px 19px -10px rgba(167, 40, 169, 0.46) inset;

  &:hover {
    background-color: #f3f3f3;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: none;
  padding: 10px 0px;
`;

const ExchangeForm = observer(() => {
  useEffect(() => {
    exchangeStore.init();
  }, []);

  return (
    <Card>
      <CardTitle>Crypto Exchange</CardTitle>
      <CardContent className="space-y-6">
        <div className="form-group">
          <CurrencySelect
            coins={exchangeStore.coins}
            value={exchangeStore.fromCurrency}
            onChange={exchangeStore.setFromCurrency}
            placeholder="From Currency"
            disabled={exchangeStore.loading}
          />
          <AmountInput
            label="You Send"
            value={exchangeStore.amount}
            onChange={exchangeStore.setAmount}
            loading={exchangeStore.loading}
          />
        </div>

        <ButtonWrapper>
          <Button
            onClick={exchangeStore.swapCurrencies}
            disabled={exchangeStore.loading}
          >
            <DynamicIcon name="arrow-up-down" color="black" size={18} />
          </Button>
        </ButtonWrapper>

        <div className="form-group">
          <CurrencySelect
            coins={exchangeStore.coins}
            value={exchangeStore.toCurrency}
            onChange={exchangeStore.setToCurrency}
            placeholder="To Currency"
            disabled={exchangeStore.loading}
          />
          <AmountInput
            label="You Receive"
            value={
              exchangeStore.conversionResult
                ? String(exchangeStore.conversionResult)
                : ""
            }
            readOnly
            disabled={exchangeStore.loading}
            loading={exchangeStore.loading}
          />
        </div>

        {exchangeStore.fromCurrency &&
          exchangeStore.toCurrency &&
          Number(exchangeStore.amount) > 0 &&
          !exchangeStore.error && (
            <p className="text-sm text-muted-foreground text-center">
              1 {exchangeStore.fromCurrency.name} ={" "}
              {exchangeStore.conversionResult
                ? (
                    exchangeStore.conversionResult /
                    Number(exchangeStore.amount)
                  ).toFixed(8)
                : "..."}{" "}
              {exchangeStore.toCurrency.name}
            </p>
          )}
      </CardContent>
    </Card>
  );
});

export default ExchangeForm;
