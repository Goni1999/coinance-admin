import React, { ChangeEvent } from 'react';

interface InputProps {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputProps> = ({ type, id, name, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-class" // add your styles here
    />
  );
};

export default InputField;
