"use client";

import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";

const DesignationMultiSelect = ({ master }) => {
  const { control } = useFormContext();

  const options =
    master?.designations?.map((item) => ({
      value: item._id,
      label:
        item.designationName ||
        item.name ||
        item.title ||
        item.designation ||
        "No Label",
    })) || [];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 45,
      borderRadius: 10,
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(37,99,235,.15)"
        : "none",
    }),

    option: (base, state) => ({
      ...base,
      color: "#111827",
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#eff6ff"
        : "#fff",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">
        Designations
      </label>

      <Controller
        name="designations"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Select
            isMulti
            options={options}
            styles={customStyles}
            placeholder="Select Designations"
            value={options.filter((option) =>
              field.value?.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              field.onChange(
                selectedOptions
                  ? selectedOptions.map((item) => item.value)
                  : []
              )
            }
          />
        )}
      />
    </div>
  );
};

export default DesignationMultiSelect;



















