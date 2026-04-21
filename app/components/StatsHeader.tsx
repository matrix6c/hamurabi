"use client";

interface StatsHeaderProps {
  year: number;
  population: number;
  land: number;
  rice: number;
  landPrice: number;
}

export default function StatsHeader({
  year,
  population,
  land,
  rice,
  landPrice,
}: StatsHeaderProps) {
  return (
    <div className="border-b border-white p-4 font-mono">
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
        <div>
          <div className="text-white/70">Year</div>
          <div className="text-white text-md font-bold">{year}/10</div>
        </div>
        <div>
          <div className="text-white/70">Population</div>
          <div className="text-white text-md font-bold">{population}</div>
        </div>
        <div>
          <div className="text-white/70">Land (acres)</div>
          <div className="text-white text-md font-bold">{land}</div>
        </div>
        <div>
          <div className="text-white/70">Rice (bags)</div>
          <div className="text-white text-md font-bold">{rice}</div>
        </div>
        <div>
          <div className="text-white/70">Land Price</div>
          <div className="text-white text-md font-bold">
            {landPrice} bags/acre
          </div>
        </div>
      </div>
    </div>
  );
}
