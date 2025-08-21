import { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard({ apiBase }) {
  const [stats, setStats] = useState({ byCourse: [], distribution: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${apiBase}/feedback/stats`).then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [apiBase])

  const pieData = {
    labels: stats.distribution.map(d => `Rating ${d._id}`),
    datasets: [
      {
        label: 'Count',
        data: stats.distribution.map(d => d.count),
        backgroundColor: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
      },
    ],
  }

  const barData = {
    labels: stats.byCourse.map(d => d._id),
    datasets: [
      {
        label: 'Average Rating',
        data: stats.byCourse.map(d => Number(d.avgRating.toFixed(2))),
        backgroundColor: '#60a5fa',
      },
    ],
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="p-6 border rounded-md">
        <h2 className="text-xl font-semibold mb-4">Ratings Distribution</h2>
        {loading ? <p>Loading...</p> : <Pie data={pieData} />}
      </section>
      <section className="p-6 border rounded-md">
        <h2 className="text-xl font-semibold mb-4">Average Rating per Course</h2>
        {loading ? <p>Loading...</p> : <Bar data={barData} options={{ scales: { y: { min: 0, max: 5 } } }} />}
      </section>
    </div>
  )
}

