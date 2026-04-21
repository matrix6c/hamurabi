"use client";

import { useState, useEffect } from "react";
import TerminalLog from "./components/TerminalLog";
import StatsHeader from "./components/StatsHeader";
import ActionInput from "./components/ActionInput";

type GameStep = "buy" | "feed" | "plant" | "processing" | "gameover";

interface GameState {
  year: number;
  population: number;
  land: number;
  grain: number;
  landPrice: number;
  messages: string[];
  step: GameStep;
  buyAcres: number;
  feedBushels: number;
  plantAcres: number;
  startingPopulation: number;
  originalStartingPopulation: number;
  totalDeaths: number;
  previousYearResults: {
    starvationDeaths: number;
    newPeople: number;
    harvestYield: number;
    ratsAte: number;
    plagueDeaths: number;
  } | null;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    year: 0,
    population: 100,
    land: 1000,
    grain: 2800,
    landPrice: 0,
    messages: [],
    step: "buy",
    buyAcres: 0,
    feedBushels: 0,
    plantAcres: 0,
    startingPopulation: 100,
    originalStartingPopulation: 100,
    totalDeaths: 0,
    previousYearResults: null,
  });

  const addMessage = (message: string) => {
    setGameState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  const generateLandPrice = () => {
    return Math.floor(Math.random() * 10) + 17; // 17-26 bushels per acre
  };

  const initializeGame = () => {
    const initialPrice = generateLandPrice();
    const welcomeMessage = `=== HAMURABI ===\n\nWelcome, O great Hamurabi!\nYou are the ruler of a city-state.\nYour goal is to manage your resources wisely over 10 years.\n\nMake your decisions carefully!\n`;
    const firstYearReport = `Hamurabi: I beg to report to you,\nIn year 1, 0 people starved,\n0 came to the city.\nPopulation is now 100.\nThe city now owns 1000 acres.\nHarvest was 0 bushels per acre.\nRats ate 0 bushels.\nLand is trading at ${initialPrice} bushels per acre.`;

    setGameState({
      year: 1,
      population: 100,
      land: 1000,
      grain: 2800,
      landPrice: initialPrice,
      messages: [welcomeMessage, firstYearReport],
      step: "buy",
      buyAcres: 0,
      feedBushels: 0,
      plantAcres: 0,
      startingPopulation: 100,
      originalStartingPopulation: 100,
      totalDeaths: 0,
      previousYearResults: null,
    });
  };

  const startNewYear = () => {
    const newLandPrice = generateLandPrice();
    let stewardReport = "";

    if (gameState.previousYearResults) {
      const results = gameState.previousYearResults;
      stewardReport = `\nHamurabi: I beg to report to you,\nIn year ${gameState.year}, ${results.starvationDeaths} people starved,\n${results.newPeople} came to the city.\nPopulation is now ${gameState.population}.\nThe city now owns ${gameState.land} acres.\nHarvest was ${results.harvestYield} bushels per acre.\nRats ate ${results.ratsAte} bushels.\nLand is trading at ${newLandPrice} bushels per acre.`;
    }

    setGameState((prev) => ({
      ...prev,
      year: prev.year + 1,
      landPrice: newLandPrice,
      step: "buy",
      buyAcres: 0,
      feedBushels: 0,
      plantAcres: 0,
      startingPopulation: prev.population,
      messages: stewardReport
        ? [...prev.messages, stewardReport]
        : prev.messages,
      previousYearResults: null,
    }));
  };

  const handleBuyAcres = (acres: number) => {
    const cost = acres * gameState.landPrice;
    const newGrain = gameState.grain - cost; // If selling (negative acres), cost is negative, so grain increases
    const newLand = gameState.land + acres;

    setGameState((prev) => ({
      ...prev,
      buyAcres: acres,
      grain: newGrain,
      land: newLand,
      step: "feed",
      messages: [
        ...prev.messages,
        `\n/ ******************************************* /\n> You ${acres >= 0 ? "bought" : "sold"} [#blue:${Math.abs(acres)}] acres ${acres >= 0 ? "for" : "and received"} [#blue:${Math.abs(cost)}] bushels.`,
      ],
    }));
  };

  const handleFeedPopulation = (bushels: number) => {
    setGameState((prev) => ({
      ...prev,
      feedBushels: bushels,
      grain: prev.grain - bushels,
      step: "plant",
      messages: [
        ...prev.messages,
        `> You fed the population [#amber:${bushels}] bushels.`,
      ],
    }));
  };

  const handlePlantAcres = (acres: number) => {
    const bushelsNeeded = Math.ceil(acres / 2);
    setGameState((prev) => ({
      ...prev,
      plantAcres: acres,
      grain: prev.grain - bushelsNeeded,
      step: "processing",
      messages: [
        ...prev.messages,
        `> You planted [#emerald:${acres}] acres with [#emerald:${bushelsNeeded}] bushels of seed. \n/ ******************************************* /`,
      ],
    }));
  };

  const processYearEnd = () => {
    setGameState((prev) => {
      let newGrain = prev.grain;
      let newPopulation = prev.population;
      let starvationDeaths = 0;
      let plagueDeaths = 0;
      let harvestYield = 0;
      let ratsAte = 0;
      const messages: string[] = [];

      // Calculate harvest FIRST (before rats)
      // if (prev.plantAcres > 0) {
      //   harvestYield = Math.floor(Math.random() * 5) + 1; // 1-5 bushels per acre
      //   const harvest = prev.plantAcres * harvestYield;
      //   newGrain += harvest;
      //   messages.push(`\nHarvest: ${harvestYield} bushels per acre. Total: ${harvest} bushels.`);
      // }

      // Rats (10-30% chance to eat 10-20% of stored grain)
      const ratChance = Math.random();
      if (ratChance <= 0.3) {
        const percentEaten = Math.random() * 0.1 + 0.1; // 10-20%
        ratsAte = Math.floor(newGrain * percentEaten);
        newGrain -= ratsAte;
        messages.push(
          `Rats ate ${ratsAte} bushels (${(percentEaten * 100).toFixed(1)}% of your grain).`,
        );
      }

      // // Calculate starvation
      // const peopleFed = Math.floor(prev.feedBushels / 20);
      // if (peopleFed < prev.population) {
      //   starvationDeaths = prev.population - peopleFed;
      //   newPopulation = prev.population - starvationDeaths;
      //   const deathPercentage = (starvationDeaths / prev.population) * 100;

      //   messages.push(`${starvationDeaths} people died of starvation.`);

      //   if (deathPercentage > 45) {
      //     messages.push(`\nYou have been impeached and thrown out of office!`);
      //     messages.push(
      //       `You starved ${deathPercentage.toFixed(1)}% of the population in one year.`,
      //     );
      //     return {
      //       ...prev,
      //       population: newPopulation,
      //       messages: [...prev.messages, ...messages],
      //       step: "gameover",
      //       totalDeaths: prev.totalDeaths + starvationDeaths,
      //       previousYearResults: null,
      //     };
      //   }
      // } else {
      //   messages.push(`\n> Everyone was fed.`);
      // }

      // Plague (15% chance) - happens after starvation
      const plagueChance = Math.random();
      if (plagueChance <= 0.15) {
        plagueDeaths = Math.floor(newPopulation / 2);
        newPopulation -= plagueDeaths;
        messages.push(`\nA horrible plague struck! Half the population died.`);
        messages.push(`${plagueDeaths} people died from the plague.`);
      }

      // New people arrive (simplified: 5-15 new people per year)
      const newPeople = Math.floor(Math.random() * 11) + 5;
      newPopulation += newPeople;

      const totalDeathsThisYear = starvationDeaths + plagueDeaths;

      // Check if game is over (10 years completed)
      if (prev.year >= 10) {
        const landPerPerson = prev.land / newPopulation;
        const finalPopulation = newPopulation;
        const survivalRate =
          ((prev.originalStartingPopulation -
            (prev.totalDeaths + totalDeathsThisYear)) /
            prev.originalStartingPopulation) *
          100;

        let rating = "";
        if (landPerPerson >= 10 && survivalRate >= 90) {
          rating = "EXCELLENT";
        } else if (landPerPerson >= 7 && survivalRate >= 75) {
          rating = "GOOD";
        } else if (landPerPerson >= 5 && survivalRate >= 60) {
          rating = "FAIR";
        } else {
          rating = "POOR";
        }

        messages.push(`\n=== GAME OVER ===`);
        messages.push(`Final Statistics:`);
        messages.push(`Land per person: ${landPerPerson.toFixed(2)} acres`);
        messages.push(`Survival rate: ${survivalRate.toFixed(1)}%`);
        messages.push(`Performance rating: ${rating}`);

        return {
          ...prev,
          population: newPopulation,
          grain: newGrain,
          messages: [...prev.messages, ...messages],
          step: "gameover",
          totalDeaths: prev.totalDeaths + totalDeathsThisYear,
          previousYearResults: null,
        };
      }

      // Store results for next year's steward report
      return {
        ...prev,
        population: newPopulation,
        grain: newGrain,
        messages: [...prev.messages, ...messages],
        step: "buy",
        totalDeaths: prev.totalDeaths + totalDeathsThisYear,
        previousYearResults: {
          starvationDeaths,
          newPeople,
          harvestYield,
          ratsAte,
          plagueDeaths,
        },
      };
    });
  };

  useEffect(() => {
    if (gameState.year === 0) {
      initializeGame();
    }
  }, [gameState.year]);

  useEffect(() => {
    if (gameState.step === "processing") {
      const timer = setTimeout(() => {
        processYearEnd();
      }, 500);
      return () => clearTimeout(timer);
    }

    // After processing, if we have previous year results and haven't finished 10 years, show steward report and start new year
    if (
      gameState.step === "buy" &&
      gameState.previousYearResults &&
      gameState.year <= 10
    ) {
      const timer = setTimeout(() => {
        startNewYear();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.step, gameState.previousYearResults, gameState.year]);

  const getMaxBuyAcres = () => {
    if (gameState.landPrice === 0) return 0;
    return Math.floor(gameState.grain / gameState.landPrice);
  };

  const getMaxSellAcres = () => {
    return gameState.land;
  };

  const getMaxFeedBushels = () => {
    return gameState.grain;
  };

  const getMaxPlantAcres = () => {
    const grainLimit = gameState.grain * 2; // 1 bushel per 2 acres
    const peopleLimit = gameState.population * 10; // 1 person per 10 acres
    return Math.min(gameState.land, grainLimit, peopleLimit);
  };

  const renderInput = () => {
    if (gameState.step === "gameover") {
      return (
        <div className="border-t border-white p-4 font-mono text-center">
          <button
            onClick={() => {
              initializeGame();
            }}
            className="bg-white text-black px-6 py-3 hover:bg-white/90 transition-colors"
          >
            Play Again
          </button>
        </div>
      );
    }

    if (gameState.step === "processing") {
      return (
        <div className="border-t border-white p-4 font-mono text-center text-white/70">
          Processing year end...
        </div>
      );
    }

    if (gameState.step === "buy") {
      return (
        <ActionInput
          step="buy"
          maxValue={gameState.grain}
          constraints={{
            maxAcres: getMaxSellAcres(),
            maxBushels: gameState.landPrice,
          }}
          onSubmit={handleBuyAcres}
        />
      );
    }

    if (gameState.step === "feed") {
      return (
        <ActionInput
          step="feed"
          maxValue={getMaxFeedBushels()}
          onSubmit={handleFeedPopulation}
        />
      );
    }

    if (gameState.step === "plant") {
      return (
        <ActionInput
          step="plant"
          maxValue={getMaxPlantAcres()}
          constraints={{
            maxBushels: gameState.grain,
            peopleAvailable: gameState.population,
          }}
          onSubmit={handlePlantAcres}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-screen md:w-full md:max-w-3xl md:h-auto md:max-h-[90vh] bg-black border border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] flex flex-col font-mono">
        <StatsHeader
          year={gameState.year}
          population={gameState.population}
          land={gameState.land}
          grain={gameState.grain}
          landPrice={gameState.landPrice}
        />
        <TerminalLog messages={gameState.messages} />
        {renderInput()}
      </div>
    </div>
  );
}
