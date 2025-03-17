import styled from "styled-components";
import { LoaderCircle } from "lucide-react";

interface AmountInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
}

const Label = styled.label`
  color: #242424;
`;

const Input = styled.input`
  border: none;
  height: 45px;
  border-radius: 12px;
  background-color: white;
  color: #242424;
  outline: none;
  padding: 0px 10px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  height: 45px;
  border-radius: 12px;
  background-color: white;
  color: #242424;
  outline: none;
  padding: 0px 10px;
`;

export const AmountInput = ({
  label,
  value,
  onChange,
  readOnly,
  loading,
  error,
  disabled,
}: AmountInputProps) => {
  console.log("value", value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^\d+(\.\d*)?$/;

    if (!inputValue) {
      return onChange?.("");
    }

    if (regex.test(inputValue)) {
      return onChange?.(inputValue);
    }
  };

  return (
    <FormContainer>
      <Label>{label}</Label>
      <InputWrapper>
        <Input
          type="text"
          value={value || ""}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
        />
        {loading && <LoaderCircle className="loadder-spinner" />}
      </InputWrapper>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </FormContainer>
  );
};
