'use client';

interface Props {
  roomId: string;
  symbol: string;
  name: string;
}

export default function WaitingScreen({ roomId, symbol, name }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h2 className="text-2xl font-bold">⏳ Menunggu pemain lain...</h2>
      <p className="text-gray-400">Halo, <span className="text-white font-semibold">{name}</span>!</p>
      <p className="text-gray-400">
        Room: <span className="text-white font-semibold">{roomId}</span> &nbsp;|&nbsp;
        Simbol: <span className="text-white font-semibold">{symbol}</span>
      </p>
      <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin" />
    </div>
  );
}