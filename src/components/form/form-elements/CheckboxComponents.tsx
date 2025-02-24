"use client";
import React, { useState, ChangeEvent } from "react";
import ComponentCard from "../../common/ComponentCard";
import Checkbox from "../input/Checkbox";

export default function CheckboxComponents() {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo] = useState(true);
  const [isCheckedDisabled] = useState(true);
   const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
    };
  return (
    <ComponentCard title="Checkbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isCheckedTwo}
            onChange={handleCheckboxChange}
            label="Checked"
          />
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isCheckedDisabled}
            onChange={handleCheckboxChange}
            disabled
            label="Disabled"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
