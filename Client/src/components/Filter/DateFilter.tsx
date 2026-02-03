import React, { useMemo } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { DatePickerDefault } from '../FormElements/DatePicker/DatePicker';

interface DateFilterValue {
  startDate: string;
  endDate: string;
}

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
  showTimeSelect?: boolean;
}

export default function DateFilter({ value, onChange, showTimeSelect = false }: DateFilterProps) {
  const { t } = useLanguage();

  // Parse current values
  const start = useMemo(() => value.startDate ? new Date(value.startDate) : null, [value.startDate]);
  const end = useMemo(() => value.endDate ? new Date(value.endDate) : null, [value.endDate]);

  const handleStartChange = (date: Date | null) => {
    onChange({
      ...value,
      startDate: date ? (showTimeSelect ? date.toISOString() : date.toISOString().split('T')[0]) : '',
    });
  };

  const handleEndChange = (date: Date | null) => {
    onChange({
      ...value,
      endDate: date ? (showTimeSelect ? date.toISOString() : date.toISOString().split('T')[0]) : '',
    });
  };

  return (
    <div className="w-fit mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-60">
          <DatePickerDefault
            label={t('common.from')}
            value={start}
            onChange={handleStartChange}
            placeholder={t('common.selectDate')}
            showTimeSelect={showTimeSelect}
            maxDate={end}
            className="cursor-pointer"
          />
        </div>

        <div className="w-60">
          <DatePickerDefault
            label={t('common.to')}
            value={end}
            onChange={handleEndChange}
            placeholder={t('common.selectDate')}
            showTimeSelect={showTimeSelect}
            minDate={start}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
