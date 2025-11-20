import React, { useState, useCallback, useMemo } from 'react';
import OfficeMap from './components/Map/OfficeMap';
import Sidebar from './components/Sidebar';
import { INITIAL_DATA } from './constants';
import { Seat, SeatStatus, Reservation, User } from './types';

// Mock Current User
const CURRENT_USER: User = {
  id: 'me',
  name: '自分',
  department: 'Dev',
};

// Initial Mock Reservations
const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    seatId: 'PJ413-2',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '09:00',
    endTime: '18:00',
    user: { id: 'u1', name: '田中', department: 'Dev' }
  },
  {
    id: 'res-2',
    seatId: 'PJ400-8',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '13:00',
    endTime: '15:00',
    user: { id: 'u2', name: '鈴木', department: 'Sales' }
  }
];

function App() {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  
  // Lift seat state to App to allow edits
  const [seats, setSeats] = useState<Seat[]>(INITIAL_DATA.seats);

  // Compute the state of seats based on the selected date and reservations
  const officeData = useMemo(() => {
    const currentReservations = reservations.filter(r => r.date === currentDate);
    
    const computedSeats = seats.map(seat => {
      // Check if this seat has a reservation for the current date
      const reservation = currentReservations.find(r => r.seatId === seat.id);

      if (reservation) {
        return {
          ...seat,
          status: reservation.user.id === CURRENT_USER.id ? SeatStatus.RESERVED : SeatStatus.OCCUPIED,
          bookedBy: reservation.user,
          reservationStart: reservation.startTime,
          reservationEnd: reservation.endTime,
          reservationDate: reservation.date,
        };
      }
      
      if (seat.status === SeatStatus.UNAVAILABLE) return seat;

      return {
        ...seat,
        status: SeatStatus.AVAILABLE,
        bookedBy: undefined,
        reservationStart: undefined,
        reservationEnd: undefined
      };
    });

    return {
      ...INITIAL_DATA,
      seats: computedSeats
    };
  }, [currentDate, reservations, seats]);

  const handleSeatClick = useCallback((seat: Seat) => {
    // In this implementation, we allow clicking even unavailable seats to edit them in admin mode,
    // but the sidebar handles the mode check.
    setSelectedSeatId(prev => prev === seat.id ? null : seat.id);
  }, []);

  const handleConfirmReservation = useCallback((startTime: string, endTime: string) => {
    if (!selectedSeatId) return;

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      seatId: selectedSeatId,
      date: currentDate,
      startTime,
      endTime,
      user: CURRENT_USER
    };

    setReservations(prev => [...prev, newReservation]);
    setSelectedSeatId(null); // Deselect after booking
  }, [selectedSeatId, currentDate]);

  const handleCancelReservation = useCallback((seatId: string) => {
    setReservations(prev => prev.filter(r => !(r.seatId === seatId && r.date === currentDate)));
    setSelectedSeatId(null);
  }, [currentDate]);

  const handleUpdateReservation = useCallback((seatId: string, newStart: string, newEnd: string) => {
    setReservations(prev => prev.map(r => {
        if (r.seatId === seatId && r.date === currentDate) {
            return { ...r, startTime: newStart, endTime: newEnd };
        }
        return r;
    }));
    setSelectedSeatId(null);
  }, [currentDate]);

  // Admin function to update seat config
  const handleUpdateSeatConfig = useCallback((seatId: string, updates: Partial<Seat>) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, ...updates } : seat
    ));
  }, []);

  // Filter for sidebar list
  const allSeats = seats;
  const selectedSeat = officeData.seats.find(s => s.id === selectedSeatId) || null;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 flex justify-between items-center shadow-sm z-20">
         <span className="font-bold text-slate-700">Yakushi Seat Mgr</span>
         <input 
            type="date" 
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="bg-slate-100 border-none text-xs rounded p-1"
         />
      </div>

      {/* Main Map Area */}
      <main className="flex-1 relative overflow-hidden p-2 lg:p-6 flex items-center justify-center bg-slate-100">
        <div className="absolute inset-0 pointer-events-none opacity-40"
             style={{
                 backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                 backgroundSize: '24px 24px'
             }}
        />
        
        <div className="w-full h-full max-w-[1600px] flex items-center justify-center z-0">
             <OfficeMap 
                data={officeData} 
                onSeatClick={handleSeatClick}
                selectedSeatId={selectedSeatId}
             />
        </div>
      </main>

      {/* Sidebar / Interaction Panel */}
      <aside className="h-[50vh] lg:h-full lg:w-[400px] shrink-0 z-30 shadow-2xl transition-all duration-300 ease-in-out bg-white">
        <Sidebar 
            selectedSeat={selectedSeat}
            allSeats={allSeats}
            currentDate={currentDate}
            currentUserId={CURRENT_USER.id}
            onDateChange={setCurrentDate}
            onConfirm={handleConfirmReservation}
            onCancel={handleCancelReservation}
            onUpdate={handleUpdateReservation}
            onUpdateSeatConfig={handleUpdateSeatConfig}
            onSelectSeat={setSelectedSeatId}
        />
      </aside>
    </div>
  );
}

export default App;