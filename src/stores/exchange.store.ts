import { makeAutoObservable, runInAction, action } from "mobx";
import type { Coin, Conversion } from "../shared/schema";

class ExchangeStore {
  coins: Coin[] = [];
  fromCurrency: Coin | null = null;
  toCurrency: Coin | null = null;
  amount: string = "";
  conversionResult: number | undefined = 0;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  init = () => {
    this.fetchCoins();
  };

  fetchCoins = async () => {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });

      const response = await fetch("https://namig.pro/api/coins");
      const coins = await response.json();

      runInAction(() => {
        this.coins = coins;
        this.loading = false;
      });
    } catch {
      runInAction(() => {
        this.error = "Failed to fetch coins";
        this.loading = false;
      });
    }
  };

  fetchConversion = async () => {
    if (!this.fromCurrency || !this.toCurrency || !this.amount) {
      runInAction(() => {
        this.conversionResult = undefined;
      });
      return;
    }

    if (Number(this.amount) <= 0) {
      runInAction(() => {
        this.error = "Amount must be greater than 0";
        this.conversionResult = undefined;
      });
      return;
    }

    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });

      const params = new URLSearchParams({
        from: this.fromCurrency.id.toString(),
        to: this.toCurrency.id.toString(),
        amount: this.amount.toString(),
      });

      console.log(
        "Conversion response:",
        this.fromCurrency.id,
        this.toCurrency.id,
        "params",
        params,
      );

      const response = await fetch(
        `https://namig.pro/api/conversion?` + params,
      );

      const conversion: Conversion = await response.json();

      runInAction(() => {
        if (conversion && typeof conversion.rate === "number") {
          this.conversionResult = conversion.rate;
          this.error = null;
        } else {
          this.error = "Invalid conversion response";
          this.conversionResult = undefined;
        }
        this.loading = false;
      });
    } catch (error) {
      console.error("Conversion error:", error);
      runInAction(() => {
        this.error = "Failed to fetch conversion rate";
        this.loading = false;
        this.conversionResult = undefined;
      });
    }
  };

  debounce(fn: () => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn();
      }, delay);
    };
  }

  fetchConversionDebounce = this.debounce(this.fetchConversion, 1000);

  setFromCurrency = action((currency: Coin) => {
    console.log("setFromCurrency", currency);
    this.fromCurrency = currency;
    if (Number(this.amount) > 0) {
      this.fetchConversionDebounce();
    }
  });

  setToCurrency = action((currency: Coin) => {
    console.log("setToCurrency", currency, "this.amount", this.amount);
    this.toCurrency = currency;
    if (Number(this.amount) > 0) {
      this.fetchConversionDebounce();
    }
  });

  setAmount = action((amount: string) => {
    this.amount = amount;
    if (Number(amount) > 0) {
      this.fetchConversionDebounce();
    }
  });

  swapCurrencies = action(() => {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    if (Number(this.amount) > 0) {
      this.fetchConversionDebounce();
    }
  });
}

export const exchangeStore = new ExchangeStore();
