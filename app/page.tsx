"use client";
import React, { useEffect, useState } from 'react';

export default function MobileCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const [mounted, setMounted] = useState(false);

  // 임시 예약 데이터 (나중에 DB 연결하면 자동으로 불러올 거예요)
  const reservations = [9, 10, 12, 19, 24, 26, 28, 30];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => { setMounted(true); }, []);

  const handleSaveMemo = () => {
    if (selectedDate) {
      localStorage.setItem(`memo-${year}-${month + 1}-${selectedDate}`, memo);
      setSelectedDate(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans max-w-md mx-auto border-x border-gray-200 shadow-lg">
      {/* 상단바: 모바일 앱 느낌 */}
      <header className="bg-orange-500 pt-10 pb-6 px-6 text-white rounded-b-[40px] shadow-md">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-2xl font-bold p-2">〈</button>
          <h1 className="text-2xl font-black">{year}년 {month + 1}월</h1>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-2xl font-bold p-2">〉</button>
        </div>
        <p className="text-center text-[10px] tracking-widest opacity-80 font-bold">FIRSTAY 1000 MOBILE</p>
      </header>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 gap-0 px-4 mt-6 text-center text-[11px] font-bold text-gray-400">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div key={d} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''}>{d}</div>
        ))}
      </div>

      {/* 달력 본문: 터치하기 좋게 큼직하게 */}
      <div className="grid grid-cols-7 gap-2 p-4 flex-1 overflow-y-auto content-start">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const isReserved = reservations.includes(date);
          const hasMemo = localStorage.getItem(`memo-${year}-${month + 1}-${date}`);

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setMemo(localStorage.getItem(`memo-${year}-${month + 1}-${date}`) || '');
              }}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative border-2 transition-all active:scale-95 ${
                isReserved ? 'bg-orange-500 border-orange-500 text-white shadow-orange-200 shadow-lg' : 'bg-white border-transparent text-gray-700'
              }`}
            >
              <span className={`text-base font-black ${isReserved ? 'text-white' : 'text-gray-800'}`}>{date}</span>
              {isReserved && <span className="text-[8px] font-bold mt-0.5 opacity-90 text-white">CHECKOUT</span>}
              {hasMemo && <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full border border-orange-600"></div>}
            </button>
          );
        })}
      </div>

      {/* 모바일 하단 메모 모달 (터치하면 아래에서 슥 올라옴) */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">{month + 1}월 {selectedDate}일 메모</h2>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400 text-2xl font-bold">✕</button>
            </div>
            <textarea
              autoFocus
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full h-40 p-4 bg-gray-50 rounded-3xl border-2 border-gray-100 text-lg focus:border-orange-500 outline-none transition-all text-black"
              placeholder="이모님께 남길 지시사항..."
            />
            <button 
              onClick={handleSaveMemo}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl mt-6 text-lg font-black shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}