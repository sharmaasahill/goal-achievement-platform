import { useState, useEffect } from "react";

const Calendar = ({ goal, onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, day

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const getCheckinDates = () => {
        if (!goal?.checkinFrequency) return [];
        
        const frequency = goal.checkinFrequency;
        const startDate = new Date(goal.createdAt);
        const dates = [];
        
        let current = new Date(startDate);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // Show next 3 months
        
        while (current <= endDate) {
            dates.push(new Date(current));
            
            if (frequency === "daily") {
                current.setDate(current.getDate() + 1);
            } else if (frequency === "weekly") {
                current.setDate(current.getDate() + 7);
            } else if (frequency === "biweekly") {
                current.setDate(current.getDate() + 14);
            }
        }
        
        return dates;
    };

    const checkinDates = getCheckinDates();
    const days = getDaysInMonth(currentDate);

    const isCheckinDate = (date) => {
        if (!date) return false;
        return checkinDates.some(checkinDate => 
            checkinDate.toDateString() === date.toDateString()
        );
    };

    const isToday = (date) => {
        if (!date) return false;
        return date.toDateString() === new Date().toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-card/70 backdrop-blur border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Check-in Calendar</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-white/70">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <p className="text-xs text-white/50">
                    {goal?.checkinFrequency} check-ins scheduled
                </p>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-xs text-white/50 text-center p-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => day && onDateSelect(day)}
                        className={`
                            p-2 text-sm rounded-lg transition-all
                            ${!day ? 'invisible' : ''}
                            ${isToday(day) ? 'bg-accent/20 text-accent font-semibold' : ''}
                            ${isSelected(day) ? 'bg-accent text-white' : ''}
                            ${isCheckinDate(day) ? 'bg-green-500/20 text-green-300' : ''}
                            ${!isToday(day) && !isSelected(day) && !isCheckinDate(day) ? 'hover:bg-white/10' : ''}
                        `}
                    >
                        {day?.getDate()}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500/20 rounded"></div>
                    <span className="text-white/60">Check-in day</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent/20 rounded"></div>
                    <span className="text-white/60">Today</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
