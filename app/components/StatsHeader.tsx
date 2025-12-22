'use client';

interface StatsHeaderProps {
  year: number;
  population: number;
  land: number;
  grain: number;
  landPrice: number;
}

export default function StatsHeader({
  year,
  population,
  land,
  grain,
  landPrice,
}: StatsHeaderProps) {
  return (
    <div className="border-b border-white p-4 font-mono">
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
        <div>
          <div className="text-white/70">Year</div>
          <div className="text-white text-lg font-bold">{year}/10</div>
        </div>
        <div>
          <div className="text-white/70">Population</div>
          <div className="text-white text-lg font-bold">{population}</div>
        </div>
        <div>
          <div className="text-white/70">Land (acres)</div>
          <div className="text-white text-lg font-bold">{land}</div>
        </div>
        <div>
          <div className="text-white/70">Grain (bushels)</div>
          <div className="text-white text-lg font-bold">{grain}</div>
        </div>
        <div>
          <div className="text-white/70">Land Price</div>
          <div className="text-white text-lg font-bold">{landPrice} bushels/acre</div>
        </div>
      </div>
    </div>
  );
}

