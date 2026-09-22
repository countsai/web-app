"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Globe, Edit, Trash2, Clock } from "lucide-react";

interface VisaGuide {
  id: string;
  country: string;
  country_code: string;
  title: string;
  content: string;
  visa_type: string;
  processing_time: string;
  difficulty: string;
  sponsorship_likelihood: string;
  updated_at: string;
}

const EMPTY_FORM = {
  country: "",
  country_code: "",
  title: "",
  content: "",
  visa_type: "",
  processing_time: "",
  difficulty: "Medium",
  sponsorship_likelihood: "",
};

export default function AdminVisaGuidesPage() {
  const [guides, setGuides] = useState<VisaGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/visa-guides");
      const data = await res.json();
      if (res.ok) setGuides(data.guides ?? []);
    } catch {
      // ignore — list stays as-is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (g: VisaGuide) => {
    setEditingId(g.id);
    setForm({
      country: g.country,
      country_code: g.country_code,
      title: g.title,
      content: g.content,
      visa_type: g.visa_type,
      processing_time: g.processing_time,
      difficulty: g.difficulty || "Medium",
      sponsorship_likelihood: g.sponsorship_likelihood,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.country.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch("/api/admin/visa-guides", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch("/api/admin/visa-guides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setDialogOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this visa guide?")) return;
    setGuides((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/admin/visa-guides?id=${id}`, { method: "DELETE" });
  };

  const inputCls = "w-full rounded-xl text-sm font-medium";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Visa & Work Guides</h1>
            <p className="text-muted-foreground mt-1 font-medium">Manage country-specific guidance for AI talent.</p>
          </div>
          <Button onClick={openAdd} className="rounded-xl font-bold gap-2 h-12 px-6">
            <Plus size={20} /> Add New Guide
          </Button>
        </div>

        {loading ? (
          <p className="text-sm font-medium text-muted-foreground">Loading…</p>
        ) : guides.length === 0 ? (
          <Card className="border-2 border-dashed border-muted shadow-none rounded-3xl flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Globe size={26} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-black text-muted-foreground/60 mb-1">No visa guides yet</h3>
            <p className="text-sm text-muted-foreground/40 font-medium max-w-sm">
              Add your first country guide — it will appear on the public Visa Guides page and the candidate Visa Hub.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
              <Card key={g.id} className="border-none shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-lg leading-none">{g.country}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {g.country_code || "—"} {g.visa_type && `• ${g.visa_type}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <Clock size={14} />
                  <span className="font-medium">Last updated {new Date(g.updated_at).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(g)} className="w-full rounded-xl font-bold gap-2">
                    <Edit size={16} /> Edit
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)} className="rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Visa Guide" : "Add Visa Guide"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Country *</Label>
                <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="e.g. Portugal" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label>Country Code</Label>
                <Input value={form.country_code} onChange={(e) => setForm((f) => ({ ...f, country_code: e.target.value }))} placeholder="e.g. PT" className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Digital Nomad Visa (D7)" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Visa Type</Label>
                <Input value={form.visa_type} onChange={(e) => setForm((f) => ({ ...f, visa_type: e.target.value }))} placeholder="e.g. Digital Nomad" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label>Processing Time</Label>
                <Input value={form.processing_time} onChange={(e) => setForm((f) => ({ ...f, processing_time: e.target.value }))} placeholder="e.g. 1–2 months" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm font-medium outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Sponsorship Likelihood</Label>
                <Input value={form.sponsorship_likelihood} onChange={(e) => setForm((f) => ({ ...f, sponsorship_likelihood: e.target.value }))} placeholder="e.g. High Probability" className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Guide summary shown to candidates…" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.country.trim()}>
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Guide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
