import React from "react";

/**
 * @param {string} value - selected value
 * @param {(string) => {}} onChange - func called whenever the value changes
 * @param {{ value: string, name: string }[]} options - list of options
 */
const generateOptions = (options) => {
  if (options.length < 1) return null;
  return options.map((element) => {
    let key = element.key;
    let value = element.value;

    return (
      <option key={key} value={value} name={value}>
        {value}
      </option>
    );
  });
};

const DropDownSelect = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {generateOptions(options)}
  </select>
);

export default DropDownSelect;
