import React, { useState } from 'react';
import { OfficeData, Seat as SeatType } from '../../types';
import Seat from './Seat';
import { Printer, Wifi, LogOut, Refrigerator, Monitor, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface OfficeMapProps {
  data: OfficeData;
  onSeatClick: (seat: SeatType) => void;
  selectedSeatId: string | null;
}

const OfficeMap: React.FC<OfficeMapProps> = ({ data, onSeatClick, selectedSeatId }) => {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 relative overflow-hidden rounded-xl shadow-2xl border border-zinc-200">
       
       {/* Architectural Floor Grid Background */}
       <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
            }}
       />

       {/* Header Overlay (Hidden on Mobile to save space) */}
       <div className="absolute top-0 left-0 z-20 p-6 pointer-events-none hidden md:block">
            <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-sm border border-zinc-200 inline-block pointer-events-auto">
                <h2 className="text-xl font-bold text-zinc-800 tracking-tight">
                    ヤクシビル4F A室
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-zinc-500 font-medium">Live Status</p>
                </div>
            </div>
       </div>

       {/* Legend Overlay (Collapsible on Mobile) */}
       <div className="absolute bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-20 pointer-events-auto flex flex-col items-start gap-2">
           
           {/* Mobile Toggle Button */}
           <button 
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="md:hidden bg-white shadow-md border border-zinc-200 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-zinc-700 transition-transform active:scale-95"
           >
               <Info size={14} className="text-indigo-600" />
               {isLegendOpen ? '凡例を閉じる' : '凡例を表示'}
               {isLegendOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
           </button>

           <div className={`
                bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-zinc-200 flex flex-col gap-3
                transition-all duration-300 origin-bottom-left
                ${isLegendOpen ? 'flex opacity-100 scale-100' : 'hidden opacity-0 scale-95'} 
                md:flex md:opacity-100 md:scale-100
           `}>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:block">Map Legend</div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white border border-zinc-300 rounded-sm shadow-sm"></div>
                        <span className="text-xs text-zinc-600">空席</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-zinc-400 border border-zinc-500 rounded-sm"></div>
                        <span className="text-xs text-zinc-600">利用中</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-300 border border-amber-400 striped-bg rounded-sm"></div>
                        <span className="text-xs text-zinc-600">予約済</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-zinc-900 rounded-sm"></div>
                        <span className="text-xs text-zinc-600">不可/柱</span>
                    </div>
                </div>
                
                <div className="h-px bg-zinc-100 w-full"></div>
                
                <div className="flex gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#AED581] rounded-full"></div>
                        <span className="text-[10px] font-medium text-zinc-500">PJ503</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#CE93D8] rounded-full"></div>
                        <span className="text-[10px] font-medium text-zinc-500">PJ413</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#F48FB1] rounded-full"></div>
                        <span className="text-[10px] font-medium text-zinc-500">PJ400</span>
                    </div>
                </div>
           </div>
       </div>

       <style>{`
        .diagonal-hatch {
            background-image: linear-gradient(45deg, #00000010 25%, transparent 25%, transparent 50%, #00000010 50%, #00000010 75%, transparent 75%, transparent);
            background-size: 8px 8px;
        }
        .striped-bg {
             background-image: linear-gradient(45deg,rgba(255,255,255,.3) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.3) 75%,transparent 75%,transparent);
            background-size: 4px 4px;
        }
       `}</style>

      {/* Map Container with Proper Scrolling Logic */}
      {/* Using min-w/min-h on inner container to prevent top/left clipping when centered with flex/overflow */}
      <div className="flex-1 overflow-auto bg-slate-100/50 relative cursor-grab active:cursor-grabbing">
          <div className="min-w-[1150px] min-h-[900px] flex items-center justify-center p-8">
            <div 
                className="relative grid bg-white shadow-2xl ring-1 ring-zinc-900/5"
                style={{
                    // 25 Columns, 20 Rows. Fixed Aspect Ratio logic.
                    gridTemplateColumns: 'repeat(25, 40px)',
                    gridTemplateRows: 'repeat(20, 40px)',
                    padding: '2px',
                }}
            >
                {/* Render Zones (Architecture) */}
                {data.zones.map((zone) => (
                    <div
                        key={zone.id}
                        className={`
                            relative
                            flex flex-col items-center justify-center text-center
                            ${zone.colorClass} 
                            ${zone.borderClass || ''}
                            text-[10px] font-bold text-zinc-700 select-none
                            transition-opacity hover:opacity-90
                        `}
                        style={{
                            gridRowStart: zone.gridRowStart,
                            gridRowEnd: zone.gridRowEnd,
                            gridColumnStart: zone.gridColStart,
                            gridColumnEnd: zone.gridColEnd,
                        }}
                    >
                        {/* Zone Icons */}
                        {zone.id === 'network_room' && <Wifi className="mb-1 opacity-30" size={20} />}
                        {zone.id === 'printer_area' && <Printer className="mb-1 opacity-60" size={20} />}
                        {zone.id.includes('meeting') && <Monitor className="mb-1 text-blue-800 opacity-20 absolute" size={40} />}
                        {zone.id === 'exit_sign' && <LogOut className="mb-1 text-green-800" size={16} />}
                        {zone.id === 'storage' && <Refrigerator className="mb-1 opacity-40" size={16} />}
                        
                        <span className="whitespace-pre-wrap z-10 px-1 leading-tight">{zone.label}</span>
                    </div>
                ))}

                {/* Render Seats */}
                {data.seats.map((seat) => (
                    <Seat
                        key={seat.id}
                        seat={seat}
                        onClick={onSeatClick}
                        isSelected={selectedSeatId === seat.id}
                    />
                ))}
                
            </div>
          </div>
      </div>
    </div>
  );
};

export default OfficeMap;