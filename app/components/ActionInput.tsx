"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface ActionInputProps {
  step: "buy" | "feed" | "plant";
  maxValue: number;
  constraints?: {
    maxAcres?: number;
    maxBags?: number;
    peopleAvailable?: number;
  };
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export default function ActionInput({
  step,
  maxValue,
  constraints,
  onSubmit,
  disabled,
}: ActionInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const getLabel = () => {
    switch (step) {
      case "buy":
        return "Acres to buy (negative to sell)";
      case "feed":
        return "Bags to feed the population";
      case "plant":
        return "Acres to plant with seed";
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case "buy":
        return `${maxValue} bags available`;
      case "feed":
        return `${maxValue} bags available`;
      case "plant":
        return `${maxValue} acres available`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (step === "buy") {
      if (numValue > 0) {
        // Buying land - need to check if we have enough rice
        const cost = numValue * constraints?.maxBags!;
        if (cost > maxValue) {
          setError(`Not enough rice. Cost: ${cost}, Available: ${maxValue}`);
          return;
        }
      } else if (numValue < 0) {
        // Selling land - check if we have enough land to sell
        if (Math.abs(numValue) > constraints?.maxAcres!) {
          setError(`Cannot sell more land than you have`);
          return;
        }
      }
    } else if (step === "feed") {
      if (numValue < 0) {
        setError("Cannot feed negative bags");
        return;
      }
      if (numValue > maxValue) {
        setError(`Not enough rice. Available: ${maxValue}`);
        return;
      }
    } else if (step === "plant") {
      if (numValue < 0) {
        setError("Cannot plant negative acres");
        return;
      }
      if (numValue > maxValue) {
        setError(`Not enough land. Available: ${maxValue}`);
        return;
      }
      const bagsNeeded = Math.ceil(numValue / 2);
      if (bagsNeeded > constraints?.maxBags!) {
        setError(
          `Not enough rice for seed. Need: ${bagsNeeded}, Available: ${constraints?.maxBags}`,
        );
        return;
      }
      const peopleNeeded = Math.ceil(numValue / 10);
      if (peopleNeeded > constraints?.peopleAvailable!) {
        setError(
          `Not enough people. Need: ${peopleNeeded}, Available: ${constraints?.peopleAvailable}`,
        );
        return;
      }
    }

    onSubmit(numValue);
    setValue("");
  };

  const getLabelColor = () => {
    switch (step) {
      case "buy":
        return "text-blue-400";
      case "feed":
        return "text-amber-400";
      case "plant":
        return "text-emerald-400";
      default:
        return "text-white/70";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white p-4 font-mono"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <label className={`${getLabelColor()} text-sm md:w-48 font-bold animate-pulse`}>
          {getLabel()}
        </label>
        <div className="flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder={getPlaceholder()}
            disabled={disabled}
            className="w-full bg-black border border-white px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
          {error && <div className="mt-1 text-red-400 text-xs">{error}</div>}
        </div>
        <button
          type="submit"
          disabled={disabled || !value}
          className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
