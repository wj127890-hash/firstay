"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// ⚠️ 여기에 에어비앤비에서 복사한 주소를 따옴표 사이에 넣어주세요!
const AIRBNB_ICAL_URL = "https://www.airbnb.co.kr/calendar/ical/1449092803394676993.ics?t=ae54c99940fb41e998f0b0b30f34e0ea";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkoutDates, setCheckoutDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [memo, setMemo] = useState('');

  // 🔄 에어비앤비 달력을 실시간으로 읽어오는 마법의 기능
  useEffect(() => {
    async function fetchCalendar() {
      try {
        // CORS 문제를 피하기 위해 프록시를 사용합니다
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(AIRBNB_ICAL_URL)}`);
        const data = await response.json();
        const icsText = data.contents;

        // ics 파일에서 체크아웃 날짜(DTEND)만 쏙쏙 뽑아내기
        const dates: string[] = [];
        const lines = icsText.split('\n');
        lines.forEach((line: string) => {
          if (line.startsWith('DTEND')) {
            const datePart = line.split(':')[1]; // 예: 20260412
            const formattedDate = `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)}`;
            dates.push(formattedDate);
          }
        });
        setCheckoutDates(dates);
      } catch (e) {
        console.error("달력 연동 실패ㅠ", e);
      }
    }
    fetchCalendar();
  }, []);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const isCheckoutDay = (day: number) => {
    const d = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return checkoutDates.includes(d);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-sans">
      {/* 상단 헤더 */}
      <div className="bg-orange-600 text-white p-8 rounded-b-[40px] shadow-lg text-center">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth}><ChevronLeft size={30} /></button>
          <h2 className="text-3xl font-bold">
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </h2>
          <button onClick={nextMonth}><ChevronRight size={30} /></button>
        </div>
        <p className="text-orange-200 tracking-widest text-sm font-bold">FIRSTAY 1000 MOBILE</p>
      </div>

      {/* 달력 본체 */}
      <div className="p-6">
        <div className="grid grid-cols-7 mb-4 text-center text-xs font-bold">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {Array(firstDayOfMonth(currentMonth)).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1).map(day => (
            <div 
              key={day} 
              onClick={() => isCheckoutDay(day) && setSelectedDate(`${currentMonth.getFullYear()}-${currentMonth.getMonth()+1}-${day}`)}
              className="relative h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm text-lg font-bold"
            >
              <span className={isCheckoutDay(day) ? 'opacity-20' : ''}>{day}</span>
              {isCheckoutDay(day) && (
                <div className="absolute inset-0 bg-orange-500 rounded-2xl flex flex-col items-center justify-center text-white border-2 border-orange-600 shadow-inner scale-105 z-10">
                  <span className="text-lg leading-none">{day}</span>
                  <span className="text-[8px] font-black mt-0.5">CHECKOUT</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 메모 팝업 */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-t-[30px] p-8 pb-12 shadow-2xl transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일 메모</h3>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400"><X size={28}/></button>
            </div>
            <textarea 
              className="w-full h-40 p-4 border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none text-lg"
              placeholder="혜빈님께 공유드립니다. 😊"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <button className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl mt-4 text-xl shadow-lg active:scale-95 transition-transform">
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}