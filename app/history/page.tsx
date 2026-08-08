'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { formatDate, getRiskLabel } from '@/lib/utils';
import { 
  Search, Trash2, Download, Activity, Loader2, Calendar, 
  Wind, Wine, Dumbbell, Droplets, HeartPulse, ShieldAlert, ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { predictions, loading: predLoading, deletePrediction } = usePredictions(user?.id);
  const container = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'risk_desc' | 'risk_asc' | 'bp_desc' | 'bmi_desc'>('date_desc');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  useGSAP(() => {
    if (authLoading || predLoading) return;
    
    gsap.from('.history-header', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' });
    gsap.from('.metric-card', { opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' });
    gsap.from('.history-controls', { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out', delay: 0.3 });
    gsap.from('.history-row', { 
      opacity: 0, 
      y: 20, 
      duration: 0.5, 
      stagger: 0.05, 
      ease: 'power2.out',
      delay: 0.4
    });
    
    gsap.to('.ambient-glow', {
      opacity: 0.6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, { scope: container, dependencies: [authLoading, predLoading] });

  const filteredAndSorted = useMemo(() => {
    let result = [...predictions];
    
    // Search & Filter
    result = result.filter(pred => {
      const searchLower = searchTerm.toLowerCase();
      const dateStr = formatDate(pred.date).toLowerCase();
      const riskStr = (pred.risk_level || '').toLowerCase();
      const probStr = Math.round(pred.probability || 0).toString();
      const bpStr = `${pred.ap_hi}/${pred.ap_lo}`;
      
      const matchesSearch = !searchTerm || 
        dateStr.includes(searchLower) || 
        riskStr.includes(searchLower) ||
        probStr.includes(searchLower) ||
        bpStr.includes(searchLower);
        
      let matchesDate = true;
      if (pred.date) {
        const predDate = new Date(pred.date);
        predDate.setHours(0, 0, 0, 0);
        
        if (filterDateFrom) {
          const fromDate = new Date(filterDateFrom);
          fromDate.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && predDate >= fromDate;
        }
        if (filterDateTo) {
          const toDate = new Date(filterDateTo);
          toDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && predDate <= toDate;
        }
      }

      const matchesRisk = filterRisk === 'all' || pred.risk_level?.toLowerCase() === filterRisk;
      return matchesSearch && matchesRisk && matchesDate;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'risk_desc':
          return (b.probability || 0) - (a.probability || 0);
        case 'risk_asc':
          return (a.probability || 0) - (b.probability || 0);
        case 'bp_desc':
          return (b.ap_hi || 0) - (a.ap_hi || 0);
        case 'bmi_desc':
          const bmiA = a.weight && a.height ? a.weight / ((a.height/100)**2) : 0;
          const bmiB = b.weight && b.height ? b.weight / ((b.height/100)**2) : 0;
          return bmiB - bmiA;
        default:
          return 0;
      }
    });

    return result;
  }, [predictions, searchTerm, filterRisk, sortBy, filterDateFrom, filterDateTo]);

  const totalScans = predictions.length;
  const avgRisk = totalScans > 0 ? (predictions.reduce((acc, p) => acc + (p.probability || 0), 0) / totalScans).toFixed(1) : '0';
  const highRiskCount = predictions.filter(p => p.risk_level?.toLowerCase() === 'high').length;

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this clinical record?')) return;
    setDeleting(id);
    try {
      await deletePrediction(id);
      toast.success('Record purged securely.');
    } catch (error: any) {
      toast.error('Failed to purge record.');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = () => {
    if (predictions.length === 0) return;
    const csvContent = [
      ['Date', 'Age', 'Gender', 'BMI', 'Systolic BP', 'Diastolic BP', 'Cholesterol', 'Glucose', 'Smoker', 'Alcohol', 'Active', 'Risk %', 'Classification'],
      ...predictions.map(p => {
        const bmi = (p.weight && p.height) ? (p.weight / ((p.height / 100) ** 2)).toFixed(1) : 'N/A';
        return [
          formatDate(p.date), p.age_years, p.gender === 1 ? 'Male' : 'Female', bmi, p.ap_hi, p.ap_lo,
          p.cholesterol, p.gluc, p.smoke ? 'Yes' : 'No', p.alco ? 'Yes' : 'No', p.active ? 'Yes' : 'No',
          Math.round(p.probability), p.risk_level
        ];
      })
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cardioguard_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <UnifiedLayout>
      {authLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <span className="font-sans text-xs tracking-wider uppercase font-bold text-muted-foreground">Verifying Credentials...</span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto pb-12 relative" ref={container}>
          
          <div className="history-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-6 mb-8 mt-6">
            <div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
                Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Archives</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground font-sans">
                Advanced Telemetry Ledger & Trends
              </p>
            </div>
            <Button onClick={handleExport} variant="outline" className="h-12 px-6 rounded-xl font-sans text-xs tracking-wider uppercase font-bold border-primary/30 hover:bg-primary/10 hover:text-primary transition-all hover:scale-105 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <Download className="w-4 h-4 mr-2" />
              Export Ledger
            </Button>
          </div>

          {/* HUD Summary Metrics */}
          {!predLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="metric-card rounded-3xl border border-border shadow-md bg-card overflow-hidden relative group">
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase font-bold text-muted-foreground mb-2">Total Scans Logged</p>
                    <p className="text-4xl font-heading font-bold text-foreground">{totalScans}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="metric-card rounded-3xl border border-border shadow-md bg-card overflow-hidden relative group">
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase font-bold text-muted-foreground mb-2">Average Risk Index</p>
                    <p className="text-4xl font-heading font-bold text-foreground">{avgRisk}%</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <HeartPulse className="w-6 h-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="metric-card rounded-3xl border border-border shadow-md bg-card overflow-hidden relative group">
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase font-bold text-muted-foreground mb-2">Critical Alerts</p>
                    <p className="text-4xl font-heading font-bold text-red-500">{highRiskCount}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="rounded-[2rem] border border-border shadow-lg bg-card overflow-hidden relative">
            <div className="history-controls p-6 border-b border-border bg-muted/30 flex flex-col xl:flex-row gap-6 items-center justify-between relative z-10">
              
              <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4 items-center">
                <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-border bg-background focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 font-sans text-base shadow-sm transition-all"
                  />
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-36 group">
                    <span className="absolute left-3 top-[-8px] bg-background px-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground z-10 rounded-full border border-border">From</span>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="h-12 px-3 rounded-xl border-border bg-background focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 font-sans text-xs font-bold tracking-wide text-foreground shadow-sm transition-all block w-full"
                    />
                  </div>
                  <div className="relative w-full sm:w-36 group">
                    <span className="absolute left-3 top-[-8px] bg-background px-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground z-10 rounded-full border border-border">To</span>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="h-12 px-3 rounded-xl border-border bg-background focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 font-sans text-xs font-bold tracking-wide text-foreground shadow-sm transition-all block w-full"
                    />
                  </div>
                </div>

                <div className="relative w-full sm:w-48 group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-12 pl-4 pr-10 rounded-xl border-border bg-background focus:bg-background focus:ring-2 focus:ring-primary/20 font-sans text-sm font-bold tracking-wide text-muted-foreground shadow-sm appearance-none transition-all outline-none cursor-pointer"
                  >
                    <option value="date_desc">Date: Newest First</option>
                    <option value="date_asc">Date: Oldest First</option>
                    <option value="risk_desc">Risk: High to Low</option>
                    <option value="risk_asc">Risk: Low to High</option>
                    <option value="bp_desc">BP: High to Low</option>
                    <option value="bmi_desc">BMI: High to Low</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex bg-background rounded-xl p-1.5 border border-border w-full xl:w-auto overflow-x-auto shadow-sm">
                {['all', 'low', 'medium', 'high'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`flex-1 xl:flex-none px-6 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                      filterRisk === r ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    Risk: {r}
                  </button>
                ))}
              </div>
            </div>

            <CardContent className="p-0 relative z-10">
              {predLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-primary">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <span className="font-sans text-xs tracking-wider uppercase font-bold">Decrypting Archives...</span>
                </div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center mb-6 border border-border shadow-inner">
                    <Activity className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-3">No Records Found</h3>
                  <p className="text-muted-foreground font-sans text-sm max-w-md leading-relaxed font-medium">
                    Adjust your filters or initialize a new diagnostic scan to populate the ledger.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Scan Date</th>
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">Vitals</th>
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">Labs</th>
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">Lifestyle Badges</th>
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">Risk Index</th>
                        <th className="px-8 py-5 font-sans text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredAndSorted.map((pred) => (
                        <tr key={pred.id} className="history-row hover:bg-muted/20 transition-colors group cursor-default">
                          
                          {/* Date */}
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-[14px] bg-background flex items-center justify-center border border-border shadow-sm">
                                <Calendar className="w-5 h-5 text-blue-500" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-[15px] text-foreground">{formatDate(pred.date).split(' ')[0]}</span>
                                <span className="font-sans text-xs font-semibold text-muted-foreground mt-0.5">{formatDate(pred.date).split(' ')[1]}</span>
                              </div>
                            </div>
                          </td>

                          {/* Vitals */}
                          <td className="px-8 py-6">
                            <div className="flex justify-center items-center gap-6">
                              <div className="flex flex-col items-center">
                                <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-muted-foreground mb-1">BMI</span>
                                <span className="font-sans font-bold text-lg text-foreground">
                                  {pred.height && pred.weight ? (pred.weight / ((pred.height / 100) ** 2)).toFixed(1) : 'N/A'}
                                </span>
                              </div>
                              <div className="w-px h-8 bg-border/50" />
                              <div className="flex flex-col items-center">
                                <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Age</span>
                                <span className="font-sans font-bold text-lg text-foreground">{pred.age_years || 'N/A'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Labs */}
                          <td className="px-8 py-6">
                            <div className="flex flex-col items-center gap-2">
                              <div className="px-3 py-1 bg-background rounded-full border border-border flex items-center gap-1.5 text-xs font-sans shadow-sm">
                                <Activity className="w-3 h-3 text-red-500" /> 
                                <span className="text-muted-foreground font-medium">BP:</span> 
                                <span className="font-bold text-foreground">{pred.ap_hi}/{pred.ap_lo}</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="px-2 py-0.5 bg-background rounded-md border border-border text-[9px] font-sans">
                                  <span className="text-muted-foreground uppercase tracking-wider font-bold">Chol: </span>
                                  <span className="text-foreground font-bold">{pred.cholesterol}</span>
                                </div>
                                <div className="px-2 py-0.5 bg-background rounded-md border border-border text-[9px] font-sans">
                                  <span className="text-muted-foreground uppercase tracking-wider font-bold">Gluc: </span>
                                  <span className="text-foreground font-bold">{pred.gluc}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Lifestyle Badges */}
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-2.5">
                              <div className={`p-1.5 rounded-full border ${pred.smoke ? 'border-red-300 text-red-500 bg-red-50/50' : 'border-border text-muted-foreground/40'} transition-colors`} title="Smoker">
                                <Wind className="w-3.5 h-3.5" />
                              </div>
                              <div className={`p-1.5 rounded-full border ${pred.alco ? 'border-orange-300 text-orange-500 bg-orange-50/50' : 'border-border text-muted-foreground/40'} transition-colors`} title="Alcohol">
                                <Wine className="w-3.5 h-3.5" />
                              </div>
                              <div className={`p-1.5 rounded-full border ${pred.active ? 'border-green-300 text-green-500 bg-green-50/50' : 'border-border text-muted-foreground/40'} transition-colors`} title="Active">
                                <Dumbbell className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </td>

                          {/* Risk */}
                          <td className="px-8 py-6 text-center">
                            <div className="flex flex-col items-center bg-background rounded-[14px] py-2 px-6 border border-border shadow-sm relative overflow-hidden inline-flex min-w-[120px]">
                              <span className="font-sans font-bold text-[22px] text-foreground">{Math.round(pred.probability || 0)}%</span>
                              <span className={`text-[9px] font-sans tracking-widest uppercase font-bold mt-1 mb-1 ${
                                pred.risk_level?.toLowerCase() === 'low' ? 'text-green-500' :
                                pred.risk_level?.toLowerCase() === 'medium' ? 'text-orange-500' : 'text-red-500'
                              }`}>
                                {getRiskLabel(pred.risk_level as any)}
                              </span>
                              <div className={`absolute bottom-0 left-0 h-1 w-full ${
                                pred.risk_level?.toLowerCase() === 'low' ? 'bg-green-500' :
                                pred.risk_level?.toLowerCase() === 'medium' ? 'bg-orange-500' : 'bg-red-500'
                              }`} />
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-8 py-6 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(pred.id)}
                              disabled={deleting === pred.id}
                              className="opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500 rounded-xl w-10 h-10 border border-transparent"
                            >
                              {deleting === pred.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </UnifiedLayout>
  );
}
