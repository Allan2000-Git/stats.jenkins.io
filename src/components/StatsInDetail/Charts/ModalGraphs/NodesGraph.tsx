import React, { useEffect, useRef, useMemo } from 'react'
import * as echarts from 'echarts'
import useCSVData from '../../../../hooks/useCSVData'

interface NodesGraphProps {
    year: string
    month: string
}

const NodesGraph: React.FC<NodesGraphProps> = ({ year, month }) => {
    const chartRef = useRef<HTMLDivElement | null>(null)
    const csvPath = `https://raw.githubusercontent.com/jenkins-infra/infra-statistics/gh-pages/jenkins-stats/svg/${year}${month}-nodes.csv`
    const { data, error } = useCSVData(csvPath)

    const xData = useMemo(() => data.map((row) => row[0]), [data])
    const yData = useMemo(() => data.map((row) => Number(row[1])).filter((value) => !isNaN(value)), [data])

    const totalSum = useMemo(() => yData.reduce((sum, value) => sum + value, 0), [yData])

    const option = useMemo(() => {
        return {
            title: {
                text: `Nodes by Type - ${month}/${year} (Total: ${totalSum})`,
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'bold' },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    show: true,
                    rotate: 45,
                    formatter: (value: string) => {
                        if (value.length > 15) {
                            return value.slice(0, 12) + '...'
                        }
                        return value
                    },
                    tooltip: {
                        show: true,
                    },
                },
                axisLine: { lineStyle: { color: '#777' } },
                axisTick: { show: true },
                name: 'Node Type',
            },
            yAxis: {
                type: 'value',
                axisLabel: { fontSize: 12 },
                axisLine: { lineStyle: { color: '#777' } },
                axisTick: { show: true },
                splitLine: { lineStyle: { type: 'dashed' } },
                name: 'Nodes',
            },
            series: [
                {
                    data: yData,
                    type: 'bar',
                    itemStyle: { color: '#3f51b5' },
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
                {
                    start: 0,
                    end: 100,
                },
            ],
            toolbox: {
                feature: {
                    restore: {},
                    saveAsImage: {},
                },
            },
            grid: { left: '30', right: '76', bottom: '75', top: '60', containLabel: true },
        }
    }, [xData, yData, year, month, totalSum])

    useEffect(() => {
        if (!chartRef.current) return

        const myChart = echarts.init(chartRef.current)
        myChart.setOption(option)

        const handleResize = () => myChart.resize()
        window.addEventListener('resize', handleResize)

        return () => {
            myChart.dispose()
            window.removeEventListener('resize', handleResize)
        }
    }, [option])

    if (error) {
        return <div>Error loading data: {error.message}</div>
    }

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
}

export default NodesGraph

// import React, { useEffect, useRef, useMemo } from 'react'
// import * as echarts from 'echarts'
// import useCSVData from '../../../../hooks/useCSVData'

// interface NodesGraphProps {
//     year: string
//     month: string
// }

// const NodesGraph: React.FC<NodesGraphProps> = ({ year, month }) => {
//     const chartRef = useRef<HTMLDivElement | null>(null)
//     const csvPath = `https://raw.githubusercontent.com/jenkins-infra/infra-statistics/gh-pages/jenkins-stats/svg/${year}${month}-nodes.csv`
//     const { data, error } = useCSVData(csvPath)

//     const xData = useMemo(() => data.map((row) => row[0]), [data])
//     const yData = useMemo(() => data.map((row) => Number(row[1])).filter((value) => !isNaN(value)), [data])

//     const totalSum = useMemo(() => yData.reduce((sum, value) => sum + value, 0), [yData])

//     const option = useMemo(() => {
//         return {
//             title: {
//                 text: `Nodes by Type - ${month}/${year} (Total: ${totalSum})`,
//                 left: 'center',
//                 textStyle: { fontSize: 16, fontWeight: 'bold' },
//             },
//             tooltip: {
//                 trigger: 'axis',
//                 axisPointer: {
//                     type: 'shadow',
//                 },
//             },
//             xAxis: {
//                 type: 'category',
//                 data: xData,
//                 axisLabel: {
//                     show: false,
//                 },
//                 axisLine: { lineStyle: { color: '#777' } },
//                 axisTick: { show: true },
//                 name: 'Node Type',
//             },
//             yAxis: {
//                 type: 'value',
//                 axisLabel: { fontSize: 12 },
//                 axisLine: { lineStyle: { color: '#777' } },
//                 axisTick: { show: true },
//                 splitLine: { lineStyle: { type: 'dashed' } },
//                 name: 'Nodes',
//             },
//             series: [
//                 {
//                     data: yData,
//                     type: 'bar',
//                     itemStyle: { color: '#3f51b5' },
//                 },
//             ],
//             dataZoom: [
//                 {
//                     type: 'inside',
//                     start: 0,
//                     end: 100,
//                 },
//                 {
//                     start: 0,
//                     end: 100,
//                 },
//             ],
//             toolbox: {
//                 feature: {
//                     restore: {},
//                     saveAsImage: {},
//                 },
//             },
//             grid: { left: '30', right: '76', bottom: '55', top: '60', containLabel: true },
//         }
//     }, [xData, yData, year, month, totalSum])

//     useEffect(() => {
//         if (!chartRef.current) return

//         const myChart = echarts.init(chartRef.current)
//         myChart.setOption(option)

//         const handleResize = () => myChart.resize()
//         window.addEventListener('resize', handleResize)

//         return () => {
//             myChart.dispose()
//             window.removeEventListener('resize', handleResize)
//         }
//     }, [option])

//     if (error) {
//         return <div>Error loading data: {error.message}</div>
//     }

//     return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
// }

// export default NodesGraph
