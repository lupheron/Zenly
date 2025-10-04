import React, { useMemo } from 'react';
import AnimatedSelect from '../FormElements/Select/AnimatedSelect';

interface DateFilterValue {
  startDate: string;
  endDate: string;
}

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
  minYear?: number;
  maxYear?: number;
}

const getYears = (min: number, max: number) => {
  const years = [];
  for (let y = max; y >= min; y--) years.push(y);
  return years;
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DateFilter({ value, onChange, minYear = 2020, maxYear }: DateFilterProps) {
  const today = useMemo(() => new Date(), []);
  maxYear = maxYear || today.getFullYear();
  const years = useMemo(() => getYears(minYear, maxYear), [minYear, maxYear]);

  // Parse current values
  const start = value.startDate ? new Date(value.startDate) : null;
  const end = value.endDate ? new Date(value.endDate) : null;

  // Handlers
  const handleYearChange = (which: 'start' | 'end', year: number) => {
    const date = which === 'start' ? start || today : end || today;
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onChange({
      startDate: which === 'start' ? newDate.toISOString().slice(0, 10) : value.startDate,
      endDate: which === 'end' ? newDate.toISOString().slice(0, 10) : value.endDate,
    });
  };
  const handleMonthChange = (which: 'start' | 'end', month: number) => {
    const date = which === 'start' ? start || today : end || today;
    const newDate = new Date(date);
    newDate.setMonth(month);
    onChange({
      startDate: which === 'start' ? newDate.toISOString().slice(0, 10) : value.startDate,
      endDate: which === 'end' ? newDate.toISOString().slice(0, 10) : value.endDate,
    });
  };
  const handleDateChange = (which: 'start' | 'end', dateStr: string) => {
    onChange({
      startDate: which === 'start' ? dateStr : value.startDate,
      endDate: which === 'end' ? dateStr : value.endDate,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-5xl bg-white rounded-lg shadow p-4">
      <div className="flex flex-col xl:flex-row lg:flex-row gap-4 w-full justify-center items-center">
        {/* Start Date */}
        <div className="flex-1 flex flex-col items-stretch">
          <span className="font-semibold mb-1 text-center sm:text-left">From</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <AnimatedSelect
              variant="filter"
              name="startYear"
              value={start ? start.getFullYear().toString() : today.getFullYear().toString()}
              onChange={e => handleYearChange('start', Number(e.target.value))}
              options={years.map(y => ({ label: y.toString(), value: y.toString() }))}
            />
            <AnimatedSelect
              variant="filter"
              name="startMonth"
              value={start ? start.getMonth().toString() : today.getMonth().toString()}
              onChange={e => handleMonthChange('start', Number(e.target.value))}
              options={months.map((m, i) => ({ label: m, value: i.toString() }))}
            />
            <input
              type="date"
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer w-full sm:w-auto"
              value={value.startDate}
              onChange={e => handleDateChange('start', e.target.value)}
              max={value.endDate || ''}
            />
          </div>
        </div>
        {/* End Date */}
        <div className="flex-1 flex flex-col items-stretch">
          <span className="font-semibold mb-1 text-center sm:text-left">To</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <AnimatedSelect
              variant="filter"
              name="endYear"
              value={end ? end.getFullYear().toString() : today.getFullYear().toString()}
              onChange={e => handleYearChange('end', Number(e.target.value))}
              options={years.map(y => ({ label: y.toString(), value: y.toString() }))}
            />
            <AnimatedSelect
              variant="filter"
              name="endMonth"
              value={end ? end.getMonth().toString() : today.getMonth().toString()}
              onChange={e => handleMonthChange('end', Number(e.target.value))}
              options={months.map((m, i) => ({ label: m, value: i.toString() }))}
            />
            <input
              type="date"
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer w-full sm:w-auto"
              value={value.endDate}
              onChange={e => handleDateChange('end', e.target.value)}
              min={value.startDate || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}