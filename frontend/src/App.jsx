jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState({ name: '', company: '', title: '', linkedin: '' })
  const [icp, setIcp] = useState('SaaS companies with 50-500 employees, VP/Director level in Sales/Marketing')
  const [selectedLead, setSelectedLead] = useState(null)
  const [outreach, setOutreach] = useState('')
  const [model, setModel] = useState('grok-4')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const res = await axios.get(`${API_URL}/leads`)
    setLeads(res.data)
  }

  const createLead = async (e) => {
    e.preventDefault()
    await axios.post(`${API_URL}/leads`, form)
    setForm({ name: '', company: '', title: '', linkedin: '' })
    fetchLeads()
  }

  const qualify = async (leadId) => {
    const res = await axios.post(`${API_URL}/qualify`, { lead_id: leadId, icp, model })
    fetchLeads()
    setSelectedLead(res.data.lead)
  }

  const generateOutreach = async (leadId) => {
    const res = await axios.post(`${API_URL}/outreach`, { lead_id: leadId, model })
    setOutreach(res.data.email)
  }

  const updateStatus = async (leadId, status) => {
    await axios.patch(`${API_URL}/leads/${leadId}`, { status })
    fetchLeads()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-indigo-900">Grok-Powered SDR Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Lead Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Add New Lead</h2>
            <form onSubmit={createLead} className="space-y-4">
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
              <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full p-3 border rounded-lg" required />
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-lg" required />
              <input placeholder="LinkedIn URL (optional)" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className="w-full p-3 border rounded-lg" />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">Add Lead</button>
            </form>

            <div className="mt-8">
              <label className="block text-sm font-medium mb-2">ICP Description</label>
              <textarea value={icp} onChange={e => setIcp(e.target.value)} className="w-full p-3 border rounded-lg" rows="3" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Grok Model</label>
              <select value={model} onChange={e => setModel(e.target.value)} className="w-full p-3 border rounded-lg">
                <option value="grok-4">grok-4 (Best)</option>
                <option value="grok-4-fast">grok-4-fast</option>
                <option value="grok-beta">grok-beta</option>
              </select>
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Pipeline</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {leads.map(lead => (
                <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.title} @ {lead.company}</p>
                      {lead.qualification_score && <p className="text-sm mt-1">Score: {lead.qualification_score}/10</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Meeting Booked' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button onClick={() => qualify(lead.id)} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Qualify</button>
                    <button onClick={() => generateOutreach(lead.id)} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Generate Email</button>
                    <select onChange={e => updateStatus(lead.id, e.target.value)} value={lead.status} className="text-sm border rounded px-2 py-1">
                      <option>New</option>
                      <option>Qualified</option>
                      <option>Contacted</option>
                      <option>Meeting Booked</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {outreach && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Outreach</h2>
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-medium">{outreach}</div>
            <button onClick={() => setOutreach('')} className="mt-4 text-red-600 hover:underline">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
