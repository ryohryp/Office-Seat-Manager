import React from 'react';
import { Seat as SeatType, SeatStatus } from '../../types';
import { User, Check, Clock, Lock } from 'lucide-react';

interface SeatProps {
  seat: SeatType;
  onClick: (seat: SeatType) => void;
  isSelected: boolean;
}

const THEME_STYLES: Record<string, { desk: string, text: string, chair: string }> = {
  lime: { desk: 'bg-[#C5E1A5] border-[#AED581]', text: 'text-emerald-900', chair: 'bg-[#DCEDC8]' },
  purple: { desk: 'bg-[#E1BEE7] border-[#CE93D8]', text: 'text-purple-900', chair: 'bg-[#F3E5F5]' },
  pink: { desk: 'bg-[#F8BBD0] border-[#F48FB1]', text: 'text-rose-900', chair: 'bg-[#FCE4EC]' },
  blue: { desk: 'bg-sky-200 border-sky-300', text: 'text-sky-900', chair: 'bg-sky-100' },
  orange: { desk: 'bg-orange-200 border-orange-300', text: 'text-orange-900', chair: 'bg-orange-100' },
  gray: { desk: 'bg-white border-zinc-200', text: 'text-zinc-600', chair: 'bg-zinc-100' },
};

const Seat: React.FC<SeatProps> = ({ seat, onClick, isSelected }) => {
  const isUnavailable = seat.status === SeatStatus.UNAVAILABLE;
  // Determine if this seat is reserved by 'me' (hardcoded id check for prototype)
  const isMySeat = seat.bookedBy?.id === 'me' && (seat.status === SeatStatus.RESERVED || seat.status === SeatStatus.OCCUPIED);
  const isFixed = seat.type === 'fixed';

  const getTheme = () => {
    if (isUnavailable) return {
        desk: 'bg-zinc-900 border-zinc-950',
        text: 'text-zinc-600',
        chair: 'bg-zinc-800'
    };
    
    if (isSelected) return {
        desk: 'bg-indigo-600 border-indigo-700 ring-2 ring-indigo-400 ring-offset-1',
        text: 'text-white',
        chair: 'bg-indigo-500'
    };

    if (isMySeat) return {
        desk: 'bg-amber-400 border-amber-500 ring-2 ring-amber-200 ring-offset-1',
        text: 'text-amber-950',
        chair: 'bg-amber-300'
    };

    if (seat.status === SeatStatus.OCCUPIED) return {
        desk: 'bg-zinc-400 border-zinc-500',
        text: 'text-white',
        chair: 'bg-zinc-300'
    };

    // Fixed Seat Logic (not occupied)
    if (isFixed) return {
        desk: 'bg-zinc-800 border-zinc-900',
        text: 'text-zinc-200',
        chair: 'bg-zinc-700'
    };
    
    // Legacy reserved check (should be covered by isMySeat or OCCUPIED generally)
    if (seat.status === SeatStatus.RESERVED) return {
        desk: 'bg-amber-100 border-amber-300 striped-bg',
        text: 'text-amber-900',
        chair: 'bg-amber-200'
    };

    // Custom Color Theme
    const themeKey = seat.colorTheme || 'gray';
    return THEME_STYLES[themeKey] || THEME_STYLES.gray;
  };

  const theme = getTheme();
  
  const handleClick = () => {
    // Allow clicking available seats OR my seats (to edit) OR fixed seats (to inspect/admin)
    onClick(seat);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative group flex flex-col items-center justify-center p-0.5
        transition-all duration-200 
        ${(seat.status === SeatStatus.AVAILABLE || isMySeat || isFixed) ? 'cursor-pointer hover:z-10' : ''}
      `}
      style={{
        gridRowStart: seat.gridRowStart,
        gridRowEnd: seat.gridRowEnd,
        gridColumnStart: seat.gridColStart,
        gridColumnEnd: seat.gridColEnd,
      }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 z-20 bg-indigo-600 text-white rounded-full p-0.5 shadow-md animate-in zoom-in duration-200">
            <Check className="w-3 h-3" />
        </div>
      )}

      {/* Desk Surface */}
      <div className={`
        w-full h-full rounded-sm shadow-sm border
        flex items-center justify-center
        transition-transform duration-200
        ${theme.desk}
        ${(seat.status === SeatStatus.AVAILABLE || isMySeat) ? 'group-hover:-translate-y-0.5 group-hover:shadow-md' : ''}
      `}>
          <div className="flex flex-col items-center justify-center w-full overflow-hidden">
             {/* Label */}
             <span className={`text-[8px] font-bold tracking-tight leading-none ${theme.text}`}>
                {seat.label}
             </span>

             {/* Status Icons */}
             {seat.status === SeatStatus.OCCUPIED && !isMySeat && (
                <div className="flex items-center gap-0.5 mt-0.5 opacity-90">
                   <User size={10} className="text-white" />
                </div>
             )}
             
             {/* Fixed Icon */}
             {isFixed && seat.status !== SeatStatus.OCCUPIED && (
                 <div className="flex items-center mt-0.5">
                     <Lock size={8} className="text-zinc-500" />
                 </div>
             )}

             {/* My Seat Indicator */}
             {isMySeat && (
                <div className="flex items-center gap-0.5 mt-0.5">
                    <Clock size={10} className="text-amber-900" />
                    <span className="text-[6px] text-amber-900 font-bold">MY</span>
                </div>
             )}
          </div>
      </div>

      {/* Chair Visual (Subtle curved element below the desk to imply direction) */}
      {!isUnavailable && (
          <div className={`
            absolute -bottom-1 w-2/3 h-1.5 rounded-b-lg
            shadow-sm border-b border-x border-black/5
            ${theme.chair}
            ${isSelected ? 'bg-indigo-500' : ''}
          `}></div>
      )}
    </div>
  );
};

export default Seat;