import { observer } from "mobx-react-lite";
// import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useRef, useState } from "react";
import type { Coin } from "../shared/schema";
import styled from "styled-components";
import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronDown } from "lucide-react";

interface CurrencySelectProps {
  coins: Coin[];
  value: Coin | null;
  onChange: (value: Coin) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Button = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  height: 45px;
  border-radius: 10px;
  text-align: start;
  cursor: pointer;
  background-color: white;
  color: #3b3a3a;
  font-size: 16px;
  outline: none;
  padding: 0px 10px;
  width: 100%;
  margin-bottom: 20px;

  &:hover {
    background-color: #fef0fc;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 15px;
  border-bottom: 1px solid #ebeaea;
`;

const Input = styled.input`
  outline: none;
  border: none;
  height: 45px;
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
`;

const DropDown = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeaea;
  border-radius: 12px;
  background-color: white;
  margin: 10px;
  position: absolute;
  right: 0;
  top: 40px;
  z-index: 10000;
`;

const ListItem = styled.button`
  border: none;
  text-align: start;
  height: 40px;
  background-color: white;
  color: #242424;
  outline: none;
  padding: 10px 10px;
  width: 100%;

  &:hover {
    background-color: #ebeaea;
  }
`;

const ListCoins = styled.div`
  height: 250px;
  overflow-y: scroll;
  border-radius: 12px;
`;

const NoCurrencyCoin = styled.div`
  text-align: center;
  padding: 30px 0px;
`;

export const CurrencySelect = observer(
  ({
    coins,
    value,
    onChange,
    placeholder = "Select currency",
    disabled,
  }: CurrencySelectProps) => {
    const [open, setOpen] = useState(false);
    const [currentCoins, setCurrentCoins] = useState(coins);
    const [searchValue, setSearchValue] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

    const selectedCoin = coins.find((coin) => coin.name === value?.name);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      if (newValue) {
        const coinsFilter: Coin[] = coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(newValue.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(newValue.toLowerCase()),
        );

        if (coinsFilter.length > 0) {
          setCurrentCoins?.(coinsFilter);
        } else {
          setCurrentCoins?.([]);
        }
      } else {
        setCurrentCoins(coins);
      }
    };

    const onOpenChange = () => {
      setSearchValue("");
      setCurrentCoins(coins);
      setOpen(!open);
    };

    return (
      <div ref={dropdownRef}>
        <Button
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onClick={onOpenChange}
        >
          {selectedCoin ? `${selectedCoin.name}` : placeholder}
          <ChevronDown />

          {open && (
            <DropDown>
              <InputContainer>
                <DynamicIcon
                  name="search"
                  color="black"
                  className="icon-search"
                  size={18}
                />
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleChangeValue}
                  placeholder="Search currencies..."
                />
              </InputContainer>
              {currentCoins.length > 0 ? (
                <ListCoins>
                  {currentCoins.map((coin) => (
                    <ListItem
                      key={coin.id}
                      onClick={() => {
                        onChange(coin);
                        setOpen(false);
                      }}
                    >
                      {coin.name + ` (${coin.symbol})`}
                    </ListItem>
                  ))}
                </ListCoins>
              ) : (
                <NoCurrencyCoin>No currency found.</NoCurrencyCoin>
              )}
            </DropDown>
          )}
        </Button>
      </div>
    );
  },
);

{
  /* <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search currencies..." />
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
             
            </CommandGroup>
          </Command>
        </PopoverContent> */
}

//   <Dropdown>
//   <Dropdown.Toggle variant="success" id="dropdown-basic">

//   </Dropdown.Toggle>

//   <Dropdown.Menu>

//   </Dropdown.Menu>
// </Dropdown>
