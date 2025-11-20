import React, { useState, useEffect } from 'react';
import { Seat, SeatStatus } from '../types';
import { UserCircle, Calendar, Clock, Armchair, MapPin, CheckCircle, AlertCircle, Building, Trash2, RefreshCw, Settings, List, Search, Lock, Unlock, Edit3, Palette, X, Ban } from 'lucide-react';

interface SidebarProps {
  selectedSeat: Seat | null;
  allSeats: Seat[]; // For list view
  currentDate: string;
  currentUserId: string;
  onDateChange: (date: string) => void;
  onConfirm: (startTime: string, endTime: string) => void;
  onCancel: (seatId: string) => void;
  onUpdate: (seatId: string, startTime: string, endTime: string) => void;
  onUpdateSeatConfig: (seatId: string, updates: Partial<Seat>) => void;
  onSelectSeat: (seatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    selectedSeat, 
    allSeats,
    currentDate, 
    currentUserId,
    onDateChange, 
    onConfirm,
    onCancel,
    onUpdate,
    onUpdateSeatConfig,
    onSelectSeat
}) => {
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<'selection' | 'list'>('selection');
  
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  
  // Admin form state
  const [editLabel, setEditLabel] = useState('');
  const [editType, setEditType] = useState<'free' | 'fixed'>('free');
  const [editColor, setEditColor] = useState<string>('gray');
  const [editStatus, setEditStatus] = useState<SeatStatus>(SeatStatus.AVAILABLE);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine if the selected seat is booked by the current user
  const isMyReservation = selectedSeat?.bookedBy?.id === currentUserId;
  const isOccupiedByOthers = selectedSeat?.status === SeatStatus.OCCUPIED && !isMyReservation;

  // Auto-switch to selection tab when a seat is selected via map
  useEffect(() => {
    if(selectedSeat) {
        setActiveTab('selection');
        // Reservation logic
        if (isMyReservation && selectedSeat.reservationStart && selectedSeat.reservationEnd) {
            setStartTime(selectedSeat.reservationStart);
            setEndTime(selectedSeat.reservationEnd);
        } else {
            setStartTime('09:00');
            setEndTime('18:00');
        }
        // Admin logic
        setEditLabel(selectedSeat.label);
        setEditType(selectedSeat.type);
        setEditColor(selectedSeat.colorTheme || 'gray');
        
        // Map internal status to simple Available/Unavailable for Admin toggle
        // If occupied/reserved, we consider it "Available" for configuration purposes (it's active)
        const isAdminAvailable = selectedSeat.status !== SeatStatus.UNAVAILABLE;
        setEditStatus(isAdminAvailable ? SeatStatus.AVAILABLE : SeatStatus.UNAVAILABLE);
    }
  }, [selectedSeat, isMyReservation]);

  const handleConfirm = () => {
      if (startTime >= endTime) {
          alert("終了時刻は開始時刻より後である必要があります。");
          return;
      }
      onConfirm(startTime, endTime);
  };

  const handleUpdate = () => {
      if (!selectedSeat) return;
      if (startTime >= endTime) {
          alert("終了時刻は開始時刻より後である必要があります。");
          return;
      }
      onUpdate(selectedSeat.id, startTime, endTime);
  };

  const handleSaveConfig = () => {
    if (!selectedSeat) return;
    
    // Prepare updates
    const updates: Partial<Seat> = {
        label: editLabel,
        type: editType,
        colorTheme: editColor as any,
        status: editStatus
    };
    
    onUpdateSeatConfig(selectedSeat.id, updates);
    alert('座席設定を保存しました');
  };

  const handleTypeChange = (newType: 'free' | 'fixed') => {
      setEditType(newType);
      // UX Improvement: When switching from Fixed (often Unavailable) to Free, 
      // automatically set status to Available so it's immediately usable/colored.
      if (newType === 'free') {
          setEditStatus(SeatStatus.AVAILABLE);
      }
  };

  // Filter seats for list
  const filteredSeats = allSeats.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.bookedBy?.name.includes(searchTerm)
  );

  const COLOR_OPTIONS = [
      { value: 'lime', label: 'Lime', class: 'bg-[#C5E1A5] border-[#AED581]' },
      { value: 'purple', label: 'Purple', class: 'bg-[#E1BEE7] border-[#CE93D8]' },
      { value: 'pink', label: 'Pink', class: 'bg-[#F8BBD0] border-[#F48FB1]' },
      { value: 'blue', label: 'Blue', class: 'bg-sky-200 border-sky-300' },
      { value: 'orange', label: 'Orange', class: 'bg-orange-200 border-orange-300' },
      { value: 'gray', label: 'Gray', class: 'bg-white border-zinc-200' },
  ];

  return (
    <div className="w-full bg-white border-l border-zinc-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 border-b border-zinc-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-10">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                <Building className="text-indigo-600" size={20} />
                Space Reserve
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">Yakushi Office System</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setMode(mode === 'user' ? 'admin' : 'user')}
                    className={`p-2 rounded-full transition-colors ${mode === 'admin' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                    title={mode === 'user' ? "管理者モードへ" : "ユーザーモードへ"}
                >
                    <Settings size={18} />
                </button>
                <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                    <UserCircle size={20} className="text-zinc-400" />
                </div>
            </div>
        </div>

        {/* Mode Switcher Banner */}
        {mode === 'admin' && (
            <div className="bg-zinc-800 text-white text-xs py-1.5 px-3 rounded mb-3 flex items-center justify-between">
               <div className="flex items-center gap-2">
                    <Settings size={12} /> 
                    <span className="font-bold">管理者モード（座席編集）</span>
               </div>
            </div>
        )}

        {/* Global Date Selector (Only in User Mode) */}
        {mode === 'user' && (
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 mb-4">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Date</label>
                </div>
                <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
                    <Calendar size={14} className="text-indigo-500" />
                    <input 
                        type="date" 
                        value={currentDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-transparent text-sm font-bold text-zinc-700 outline-none"
                    />
                </div>
            </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200">
            <button 
                onClick={() => setActiveTab('selection')}
                className={`
                    flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-center border-b-2 transition-colors
                    ${activeTab === 'selection' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}
                `}
            >
                選択中 (Details)
            </button>
            <button 
                onClick={() => setActiveTab('list')}
                className={`
                    flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-center border-b-2 transition-colors
                    ${activeTab === 'list' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}
                `}
            >
                一覧 (List)
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white/50">
        
        {/* --- TAB: SELECTION (DETAILS / EDIT) --- */}
        {activeTab === 'selection' && (
            <div className="h-full">
                {selectedSeat ? (
                    <div className="animate-in slide-in-from-right-2 duration-200 pb-10">
                        {/* --- ADMIN EDIT FORM --- */}
                        {mode === 'admin' ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                                        <Edit3 size={18} /> 座席設定編集
                                    </h3>
                                    <div className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-500">
                                        {selectedSeat.id}
                                    </div>
                                </div>

                                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-5">
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 mb-1.5">座席ラベル</label>
                                        <input 
                                            type="text" 
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="w-full p-2 bg-white text-zinc-900 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-zinc-800/20 outline-none"
                                            placeholder="ラベルを入力"
                                        />
                                        <p className="text-[10px] text-zinc-400 mt-1">座席に表示されるテキストです。</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 mb-1.5">稼働状況 (Status)</label>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setEditStatus(SeatStatus.AVAILABLE)}
                                                className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${editStatus === SeatStatus.AVAILABLE ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                            >
                                                <CheckCircle size={14} /> 利用可能
                                            </button>
                                            <button 
                                                onClick={() => setEditStatus(SeatStatus.UNAVAILABLE)}
                                                className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${editStatus === SeatStatus.UNAVAILABLE ? 'bg-zinc-100 border-zinc-300 text-zinc-500 font-bold shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                            >
                                                <Ban size={14} /> 利用停止
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 mb-1.5">座席タイプ</label>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleTypeChange('free')}
                                                className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${editType === 'free' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                            >
                                                <Unlock size={14} /> フリー
                                            </button>
                                            <button 
                                                onClick={() => handleTypeChange('fixed')}
                                                className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${editType === 'fixed' ? 'bg-zinc-800 border-zinc-900 text-white font-bold shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                            >
                                                <Lock size={14} /> 固定
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 mt-1">※ 固定席はマップ上で黒く表示されます。</p>
                                    </div>

                                    {editType === 'free' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-zinc-600 mb-2 flex items-center gap-2">
                                                <Palette size={12} /> テーマカラー (座席 & ラベル)
                                            </label>
                                            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                                <div className="flex flex-wrap gap-3">
                                                    {COLOR_OPTIONS.map((color) => (
                                                        <button
                                                            key={color.value}
                                                            onClick={() => setEditColor(color.value)}
                                                            className={`
                                                                relative w-10 h-10 rounded-full border-2 shadow-sm transition-all
                                                                ${color.class}
                                                                ${editColor === color.value ? 'ring-2 ring-zinc-800 ring-offset-2 scale-110 z-10' : 'border-white hover:scale-105'}
                                                            `}
                                                            title={`${color.label} Theme`}
                                                        >
                                                            {editColor === color.value && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-zinc-400 mt-2">
                                                    ※ 選択した色は、座席の背景色とラベルの文字色の両方に適用されます。
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleSaveConfig}
                                        className="w-full bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 rounded-lg shadow-md shadow-zinc-200 active:scale-[0.98] transition-all"
                                    >
                                        設定を保存する
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* --- USER RESERVATION FORM --- */
                            <div className="space-y-6">
                                {/* Seat Info Card */}
                                <div className={`
                                    rounded-xl p-5 border relative overflow-hidden transition-all
                                    ${isMyReservation ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'}
                                `}>
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Armchair size={64} className={isMyReservation ? 'text-amber-900' : 'text-indigo-900'} />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`
                                                text-[10px] font-bold px-2 py-1 rounded-md border shadow-sm uppercase
                                                ${isMyReservation 
                                                    ? 'bg-white text-amber-600 border-amber-100' 
                                                    : 'bg-white text-indigo-600 border-indigo-100'}
                                            `}>
                                                {selectedSeat.groupId} Area
                                            </span>
                                            {selectedSeat.type === 'fixed' && (
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-md border shadow-sm uppercase bg-zinc-800 text-white border-zinc-900 flex items-center gap-1">
                                                    <Lock size={10} /> Fixed
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h2 className="text-2xl font-bold text-zinc-800 mb-1">{selectedSeat.label || 'Seat'}</h2>
                                        <div className="flex items-center text-xs text-zinc-500 gap-1 mb-3">
                                            <MapPin size={12} />
                                            <span>4F A室 / {selectedSeat.type === 'fixed' ? '固定席' : 'フリーアドレス'}</span>
                                        </div>

                                        {/* Status Badge */}
                                        {isMyReservation && (
                                            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-[10px] font-bold">
                                                <CheckCircle size={10} /> あなたの予約
                                            </div>
                                        )}
                                        {isOccupiedByOthers && (
                                            <div className="inline-flex items-center gap-1.5 bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full text-[10px] font-bold">
                                                <UserCircle size={10} /> {selectedSeat.bookedBy?.name} さんが利用中
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Area */}
                                {!isOccupiedByOthers && selectedSeat.type !== 'fixed' ? (
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                            {isMyReservation ? 'Manage Reservation' : 'New Reservation'}
                                        </label>
                                        
                                        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                                                        <Clock size={12} /> 開始
                                                    </div>
                                                    <input 
                                                        type="time" 
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                                                        <Clock size={12} /> 終了
                                                    </div>
                                                    <input 
                                                        type="time" 
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {isMyReservation ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => onCancel(selectedSeat.id)}
                                                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    <span>取消</span>
                                                </button>
                                                <button
                                                    onClick={handleUpdate}
                                                    className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={16} />
                                                    <span>時間を変更</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleConfirm}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                                            >
                                                <span>この座席を予約する</span>
                                                <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-center">
                                        {selectedSeat.type === 'fixed' ? (
                                            <p className="text-xs text-zinc-500 flex flex-col items-center gap-1">
                                                <Lock size={20} className="text-zinc-400 mb-1" />
                                                この座席は固定席のため予約できません。
                                            </p>
                                        ) : (
                                            <p className="text-xs text-zinc-500">
                                                この座席は他のユーザーによって予約されています。<br/>
                                                空いている他の座席を選択してください。
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-20">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 border border-zinc-200">
                            <Armchair size={32} className="text-zinc-300" />
                        </div>
                        <h3 className="text-zinc-800 font-bold mb-1">座席を選択してください</h3>
                        <p className="text-xs text-zinc-500 max-w-[200px]">
                            マップ上の座席をクリックすると詳細が表示されます。
                        </p>
                    </div>
                )}
            </div>
        )}

        {/* --- TAB: LIST (SEARCH) --- */}
        {activeTab === 'list' && (
            <div className="space-y-4 animate-in fade-in duration-200 pb-10">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="座席、ユーザー名で検索..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 text-zinc-500 font-medium text-xs border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3 w-[80px]">ID</th>
                                    <th className="px-4 py-3">Label/Status</th>
                                    {mode === 'admin' && <th className="px-4 py-3 text-right">Type</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredSeats.length > 0 ? (
                                    filteredSeats.map(seat => {
                                        const isReserved = seat.status === SeatStatus.OCCUPIED || seat.status === SeatStatus.RESERVED;
                                        return (
                                            <tr 
                                                key={seat.id} 
                                                onClick={() => onSelectSeat(seat.id)}
                                                className={`
                                                    cursor-pointer transition-colors
                                                    ${selectedSeat?.id === seat.id ? 'bg-indigo-50' : 'hover:bg-zinc-50'}
                                                `}
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{seat.id}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-zinc-700 text-xs">{seat.label}</span>
                                                        {isReserved ? (
                                                            <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                                                                {seat.bookedBy?.name || 'Reserved'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                                Available
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {mode === 'admin' && (
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${seat.type === 'fixed' ? 'bg-zinc-100 border-zinc-300 text-zinc-600' : 'bg-white border-zinc-200 text-zinc-400'}`}>
                                                            {seat.type === 'fixed' ? 'Fix' : 'Free'}
                                                        </span>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-zinc-400 text-xs">
                                            該当する座席が見つかりません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-[10px] text-zinc-400 text-center">
                    {mode === 'admin' 
                        ? 'クリックして編集画面へ移動' 
                        : 'クリックして予約画面へ移動'}
                </p>
            </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-100">
         <div className="flex items-start gap-2 text-[10px] text-zinc-400 leading-tight">
            <AlertCircle size={12} className="shrink-0 mt-0.5" />
            <p>
                {mode === 'admin' 
                    ? '管理者モード: 座席の配置や種類を変更できます。' 
                    : '予約時間は厳守してください。退席時はチェックアウト処理を行ってください。'}
            </p>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;