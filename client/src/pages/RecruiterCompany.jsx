import React, { useEffect, useState } from "react";
import { recruiterService } from "../services/recruiterService";

export default function RecruiterCompany() {
  const [form, setForm] = useState({ name: "", address: "", size: "", founded: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await recruiterService.getCompanyProfile();
      if (c) setForm({ name: c.name || "", address: c.address || "", size: c.size || "", founded: c.founded || "" });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!form.name) { alert('Company name is required'); return; }
    setSaving(true);
    await recruiterService.saveCompanyProfile(form);
    setSaving(false);
    alert('Saved');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Company Profile</h1>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Company name" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} placeholder="Address" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.size} onChange={(e)=>setForm({...form,size:e.target.value})} placeholder="Company size (e.g., 51-200)" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input value={form.founded} onChange={(e)=>setForm({...form,founded:e.target.value})} placeholder="Founded year" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <div className="flex justify-end">
              <button onClick={save} disabled={saving} className={`px-5 py-2 rounded-lg text-white ${saving? 'bg-gray-400':'bg-blue-600 hover:bg-blue-700'}`}>{saving? 'Saving...':'Save Profile'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


