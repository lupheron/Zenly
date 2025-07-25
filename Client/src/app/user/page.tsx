'use client'

import Loader from '../../components/Loader/Loader'
import PieChart from '../../components/charts/PieChart'
import LineChart from '../../components/charts/LineChart'
import UserComments from '@/src/components/Comments/UserComments'
import SelectDefault from '@/src/components/FormElements/Select/SelectDefault'
import { useDashboardWithDateFilter, DateFilterValue } from '@/src/hooks/useDashboard'
import BarChart from '../../components/charts/BarChart'
import DateFilter from '../../components/Filter/DateFilter'
import { useState } from 'react'

export default function Dashboard() {
    const [dateFilter, setDateFilter] = useState<DateFilterValue>({
        startDate: '',
        endDate: '',
    })
    const {
        isLoading,
        pieChartData,
        lineChartData,
        postOptions,
        sortBy,
        setSortBy,
        selectedPostId,
        setSelectedPostId,
        barChartData,
    } = useDashboardWithDateFilter(dateFilter)

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="px-2 sm:px-4">
            <h1 className="text-2xl font-bold mb-8 text-center">Boshqaruv paneli</h1>
            <DateFilter value={dateFilter} onChange={setDateFilter} />
            <hr className='mb-5 mt-5' />

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 xl:grid-rows-2 gap-8 items-start w-full">
                {/* Pie Chart Section */}
                <div className="flex-1 min-w-0">
                    <h1 className='text-2xl font-bold mb-4 text-center'>
                        Manzillar bo&apos;yicha postlar soni
                    </h1>
                    <PieChart labels={pieChartData.labels} data={pieChartData.data} />
                </div>

                {/* Line Chart Section */}
                <div className="flex-1 min-w-0 w-full">
                    <h1 className='text-2xl font-bold mb-4 text-center'>
                        Eng ko&apos;p ko&apos;rilgan va reytingi yuqori postlar
                    </h1>

                    <div className="mb-4 flex items-center justify-center gap-2">
                        <label htmlFor="sortBy" className="font-semibold">Tanlang:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as 'views' | 'rating')}
                            className="border rounded px-2 py-1 cursor-pointer outline-none"
                        >
                            <option value="views">Eng ko&apos;p ko&apos;rilganlar</option>
                            <option value="rating">Eng yuqori reyting</option>
                        </select>
                    </div>

                    <LineChart labels={lineChartData.labels} data={lineChartData.data} />
                </div>

                {/* Comments Section */}
                <div className='w-full flex flex-col gap-4 min-w-0'>
                    <SelectDefault
                        options={postOptions}
                        onChange={e => setSelectedPostId(Number(e.target.value))}
                        value={selectedPostId ? String(selectedPostId) : ''}
                        label={"Postlar bo'yicha ko'rsatish:"}
                        name={'posts_sort'}
                        htmlFor={'posts_sort'}
                        customClassesLabel={'text-lg font-bold'}
                        customClassesSelect={'w-full border rounded px-2 py-1 cursor-pointer outline-none'}
                    />
                    <UserComments postId={selectedPostId} dateFilter={dateFilter} />
                </div>

                {/* Booked Posts Bar Chart Section */}
                <div className="w-full flex flex-col gap-4 min-w-0">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Postlar bo&apos;yicha band qilishlar soni
                    </h1>
                    <BarChart labels={barChartData.labels} data={barChartData.data} />
                </div>
            </div>
        </div>
    )
}