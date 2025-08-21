import { useState } from 'react'
import axios from 'axios'

export default function FeedbackForm({ apiBase }) {
  const [form, setForm] = useState({ name: '', rollNo: '', course: '', rating: 3, feedback: '' })
  const [status, setStatus] = useState(null)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      await axios.post(`${apiBase}/feedback`, form)
      setStatus('Submitted successfully!')
      setForm({ name: '', rollNo: '', course: '', rating: 3, feedback: '' })
    } catch (err) {
      setStatus(err?.response?.data?.error || 'Failed to submit')
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="p-6 border rounded-md">
        <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Roll No</label>
            <input name="rollNo" value={form.rollNo} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Course</label>
            <input name="course" value={form.course} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Rating (1-5)</label>
            <select name="rating" value={form.rating} onChange={onChange}>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Feedback</label>
            <textarea name="feedback" rows={4} value={form.feedback} onChange={onChange} required />
          </div>
          <button type="submit">Submit</button>
          {status && <p className="text-sm mt-2">{status}</p>}
        </form>
      </section>
      <aside className="p-6 border rounded-md bg-white/40 dark:bg-gray-800/40">
        <h3 className="font-semibold mb-2">How it works</h3>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>Fill the form with your details and feedback.</li>
          <li>Submissions are stored securely in MongoDB.</li>
          <li>Admin can review analytics on the dashboard.</li>
        </ul>
      </aside>
    </div>
  )
}

