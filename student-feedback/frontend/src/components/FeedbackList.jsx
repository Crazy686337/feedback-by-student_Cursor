import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

export default function FeedbackList({ apiBase }) {
  const [data, setData] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios.get(`${apiBase}/feedback`).then(r => setData(r.data)).catch(() => setData([]))
  }, [apiBase])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(x =>
      x.name.toLowerCase().includes(q) ||
      x.rollNo.toLowerCase().includes(q) ||
      x.course.toLowerCase().includes(q) ||
      String(x.rating).includes(q)
    )
  }, [data, query])

  return (
    <div className="p-6 border rounded-md">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-xl font-semibold">All Feedback</h2>
        <input className="max-w-xs" placeholder="Search by name, roll, course, rating" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Course</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.rollNo}</td>
                <td>{item.course}</td>
                <td>{item.rating}</td>
                <td className="max-w-xl">{item.feedback}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-sm text-gray-500">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

