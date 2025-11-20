import { OfficeData, SeatStatus } from './types';

// Grid System: 25 Columns x 20 Rows
// Each cell represents approx 50-60cm squared or appropriate ratio

export const INITIAL_DATA: OfficeData = {
  zones: [
    // --- Left Column Infrastructure (Elevator & Shafts) ---
    {
      id: 'shaft_top',
      label: '',
      type: 'utility',
      colorClass: 'bg-zinc-200',
      gridRowStart: 1,
      gridRowEnd: 6,
      gridColStart: 1,
      gridColEnd: 5,
      borderClass: 'border-r-2 border-b-2 border-zinc-800 diagonal-hatch'
    },
    {
      id: 'elevator',
      label: 'エレベータ',
      type: 'utility',
      colorClass: 'bg-sky-200',
      gridRowStart: 6,
      gridRowEnd: 9,
      gridColStart: 1,
      gridColEnd: 5,
      borderClass: 'border-r-2 border-y-2 border-zinc-800 shadow-inner'
    },
    {
      id: 'shaft_bottom',
      label: '',
      type: 'utility',
      colorClass: 'bg-zinc-300',
      gridRowStart: 9,
      gridRowEnd: 21,
      gridColStart: 1,
      gridColEnd: 5,
      borderClass: 'border-r-2 border-t-2 border-zinc-800 diagonal-hatch'
    },
    
    // --- Top Area (Network, Storage, Locker) ---
    {
      id: 'network_room',
      label: 'ネットワーク機器',
      type: 'utility',
      colorClass: 'bg-orange-100',
      gridRowStart: 1,
      gridRowEnd: 3,
      gridColStart: 6,
      gridColEnd: 15,
      borderClass: 'border-b-2 border-x-2 border-zinc-800'
    },
    {
      id: 'shaft_small_top',
      label: '',
      type: 'utility',
      colorClass: 'bg-zinc-300',
      gridRowStart: 1,
      gridRowEnd: 3,
      gridColStart: 15,
      gridColEnd: 17,
      borderClass: 'border-b-2 border-r-2 border-zinc-800 diagonal-hatch'
    },
    {
      id: 'storage',
      label: '冷蔵庫',
      type: 'utility',
      colorClass: 'bg-orange-50',
      gridRowStart: 1,
      gridRowEnd: 2,
      gridColStart: 17,
      gridColEnd: 19,
      borderClass: 'border-b border-zinc-400'
    },
    {
      id: 'locker',
      label: 'ロッカー',
      type: 'utility',
      colorClass: 'bg-white',
      gridRowStart: 1,
      gridRowEnd: 4,
      gridColStart: 19,
      gridColEnd: 20,
      borderClass: 'border-2 border-zinc-800'
    },

    // --- Entrance Area ---
    {
      id: 'exit_sign',
      label: '出口',
      type: 'corridor',
      colorClass: 'bg-green-200 text-green-900',
      gridRowStart: 6,
      gridRowEnd: 8,
      gridColStart: 5,
      gridColEnd: 6,
      borderClass: 'border-2 border-green-600 rounded-sm'
    },
    {
      id: 'storage_small',
      label: '物置',
      type: 'utility',
      colorClass: 'bg-orange-100',
      gridRowStart: 8,
      gridRowEnd: 9,
      gridColStart: 5,
      gridColEnd: 6,
      borderClass: 'border-2 border-zinc-800'
    },

    // --- Meeting Rooms (Right) ---
    {
      id: 'meeting_a',
      label: 'A室 (正面)\n大会議室',
      type: 'room',
      colorClass: 'bg-blue-50/50',
      gridRowStart: 2,
      gridRowEnd: 8,
      gridColStart: 21,
      gridColEnd: 25,
      borderClass: 'border-2 border-blue-900'
    },
    {
      id: 'meeting_b',
      label: 'A室\n中会議室',
      type: 'room',
      colorClass: 'bg-blue-50/50',
      gridRowStart: 10,
      gridRowEnd: 14,
      gridColStart: 21,
      gridColEnd: 25,
      borderClass: 'border-2 border-blue-900'
    },
    {
        id: 'meeting_b_entrance',
        label: '',
        type: 'corridor',
        colorClass: 'bg-white',
        gridRowStart: 10,
        gridRowEnd: 12,
        gridColStart: 20,
        gridColEnd: 21,
        borderClass: 'border-t-2 border-b-2 border-l-2 border-transparent' // Angled wall simulated
    },

    // --- Pillars & Misc ---
    {
      id: 'printer_area',
      label: 'プリンタ',
      type: 'utility',
      colorClass: 'bg-orange-100',
      gridRowStart: 8,
      gridRowEnd: 10,
      gridColStart: 14,
      gridColEnd: 15,
      borderClass: 'border border-zinc-500 shadow-sm'
    },
    {
      id: 'pillar_center',
      label: '',
      type: 'utility',
      colorClass: 'bg-black',
      gridRowStart: 10,
      gridRowEnd: 12,
      gridColStart: 14,
      gridColEnd: 15,
    },
    {
      id: 'pillar_bottom_center',
      label: '',
      type: 'utility',
      colorClass: 'bg-black',
      gridRowStart: 16,
      gridRowEnd: 18,
      gridColStart: 14,
      gridColEnd: 15,
    },
    {
      id: 'pillar_bottom_right',
      label: '',
      type: 'utility',
      colorClass: 'bg-black',
      gridRowStart: 16,
      gridRowEnd: 21,
      gridColStart: 24,
      gridColEnd: 25,
    },
    {
        id: 'display_a',
        label: 'ディスプレイ',
        type: 'utility',
        colorClass: 'bg-white',
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColStart: 21,
        gridColEnd: 25,
        borderClass: 'border border-zinc-300 text-[8px]'
    },
    {
        id: 'display_b',
        label: 'ディスプレイ',
        type: 'utility',
        colorClass: 'bg-white',
        gridRowStart: 10,
        gridRowEnd: 14,
        gridColStart: 25,
        gridColEnd: 26, // stick out slightly
        borderClass: 'border border-zinc-300 text-[8px] [writing-mode:vertical-rl]'
    }
  ],
  seats: [
    // --- PJ503 Cluster (Green) - Left Middle ---
    // Row 1
    { id: 'PJ503-1', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 9, gridRowEnd: 10, gridColStart: 6, gridColEnd: 8 },
    { id: 'PJ503-2', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 9, gridRowEnd: 10, gridColStart: 8, gridColEnd: 10 },
    { id: 'PJ503-3', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 9, gridRowEnd: 10, gridColStart: 10, gridColEnd: 12 },
    { id: 'PJ503-4', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 9, gridRowEnd: 10, gridColStart: 12, gridColEnd: 14 },
    // Row 2
    { id: 'PJ503-5', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 10, gridRowEnd: 11, gridColStart: 6, gridColEnd: 8 },
    { id: 'PJ503-6', label: 'PJ503', groupId: 'PJ503', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'lime', gridRowStart: 10, gridRowEnd: 11, gridColStart: 8, gridColEnd: 10 },
    { id: 'PJ503-X1', label: '', groupId: 'PJ503', status: SeatStatus.UNAVAILABLE, type: 'fixed', colorTheme: 'lime', gridRowStart: 10, gridRowEnd: 11, gridColStart: 10, gridColEnd: 12 }, // Black
    { id: 'PJ503-X2', label: '', groupId: 'PJ503', status: SeatStatus.UNAVAILABLE, type: 'fixed', colorTheme: 'lime', gridRowStart: 10, gridRowEnd: 11, gridColStart: 12, gridColEnd: 14 }, // Black

    // --- Spare Cluster (Pink/Purple) - Right Middle ---
    // 2x2 Grid
    { id: 'SPARE-1', label: '空席', groupId: 'SPARE', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'gray', gridRowStart: 9, gridRowEnd: 10, gridColStart: 16, gridColEnd: 18 },
    { id: 'SPARE-2', label: '空席', groupId: 'SPARE', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'gray', gridRowStart: 9, gridRowEnd: 10, gridColStart: 18, gridColEnd: 20 },
    { id: 'SPARE-3', label: '空席', groupId: 'SPARE', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'gray', gridRowStart: 10, gridRowEnd: 11, gridColStart: 16, gridColEnd: 18 },
    { id: 'SPARE-4', label: '空席', groupId: 'SPARE', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'gray', gridRowStart: 10, gridRowEnd: 11, gridColStart: 18, gridColEnd: 20 },

    // --- PJ413 Cluster (Purple) - Bottom Left ---
    // Row 1
    { id: 'PJ413-1', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 15, gridRowEnd: 16, gridColStart: 6, gridColEnd: 8 },
    { id: 'PJ413-2', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.OCCUPIED, type: 'free', colorTheme: 'purple', bookedBy: { id: 'u1', name: '田中', department: 'Dev' }, gridRowStart: 15, gridRowEnd: 16, gridColStart: 8, gridColEnd: 10 },
    { id: 'PJ413-3', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 15, gridRowEnd: 16, gridColStart: 10, gridColEnd: 12 },
    { id: 'PJ413-4', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 15, gridRowEnd: 16, gridColStart: 12, gridColEnd: 14 },
    // Row 2
    { id: 'PJ413-5', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 16, gridRowEnd: 17, gridColStart: 6, gridColEnd: 8 },
    { id: 'PJ413-6', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 16, gridRowEnd: 17, gridColStart: 8, gridColEnd: 10 },
    { id: 'PJ413-7', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 16, gridRowEnd: 17, gridColStart: 10, gridColEnd: 12 },
    { id: 'PJ413-8', label: 'PJ413', groupId: 'PJ413', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'purple', gridRowStart: 16, gridRowEnd: 17, gridColStart: 12, gridColEnd: 14 },

    // --- PJ400 Cluster (Pink) - Bottom Right ---
    // Row 1
    { id: 'PJ400-1', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 15, gridRowEnd: 16, gridColStart: 16, gridColEnd: 18 },
    { id: 'PJ400-2', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 15, gridRowEnd: 16, gridColStart: 18, gridColEnd: 20 },
    { id: 'PJ400-3', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 15, gridRowEnd: 16, gridColStart: 20, gridColEnd: 22 },
    { id: 'PJ400-4', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 15, gridRowEnd: 16, gridColStart: 22, gridColEnd: 24 },
    // Row 2
    { id: 'PJ400-5', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 16, gridRowEnd: 17, gridColStart: 16, gridColEnd: 18 },
    { id: 'PJ400-6', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 16, gridRowEnd: 17, gridColStart: 18, gridColEnd: 20 },
    { id: 'PJ400-7', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.AVAILABLE, type: 'free', colorTheme: 'pink', gridRowStart: 16, gridRowEnd: 17, gridColStart: 20, gridColEnd: 22 },
    { id: 'PJ400-8', label: 'PJ400', groupId: 'PJ400', status: SeatStatus.OCCUPIED, type: 'free', colorTheme: 'pink', bookedBy: { id: 'u2', name: '鈴木', department: 'Sales' }, gridRowStart: 16, gridRowEnd: 17, gridColStart: 22, gridColEnd: 24 },
  ]
};