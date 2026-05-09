'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditInput, ToolInput, ToolName, UseCase } from '@/types';
import { runAudit } from '@/lib/auditEngine';

const TOOLS_CONFIG = [
  { id: 'cursor' as ToolName, label: 'Cursor', plans: ['hobby', 'pro', 'business', 'enterprise'] },
  { id: 'github_copilot' as ToolName, label: 'GitHub Copilot', plans: ['individual', 'business', 'enterprise'] },
  { id: 'claude' as ToolName, label: 'Claude (Anthropic)', plans: ['free', 'pro', 'max', 'team', 'enterprise', 'api'] },
  { id: 'chatgpt' as ToolName, label: 'ChatGPT (OpenAI)', plans: ['free', 'plus', 'team', 'enterprise', 'api'] },
  { id: 'anthropic_api' as ToolName, label: 'Anthropic API Direct', plans: ['payg'] },
  { id: 'openai_api' as ToolName, label: 'OpenAI API Direct', plans: ['payg'] },
  { id: 'gemini' as ToolName, label: 'Gemini (Google)', plans: ['free', 'pro', 'ultra', 'api'] },
  { id: 'windsurf' as ToolName, label: 'Windsurf', plans: ['free', 'pro', 'team'] },
];

const STORAGE_KEY = 'ai-spend-audit-form';

export default function AuditForm() {
  const router = useRouter();
  const [selectedTools, setSelectedTools] = useState<Set<ToolName>>(new Set());
  const [toolInputs, setToolInputs] = useState<Partial<Record<ToolName, ToolInput>>>({});
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCase>('mixed');
  const [loading, setLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedTools(new Set(data.selectedTools || []));
      setToolInputs(data.toolInputs || {});
      setTeamSize(data.teamSize || 1);
      setUseCase(data.useCase || 'mixed');
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedTools: Array.from(selectedTools),
      toolInputs,
      teamSize,
      useCase,
    }));
  }, [selectedTools, toolInputs, teamSize, useCase]);

  const toggleTool = (toolId: ToolName) => {
    setSelectedTools(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
        // Set defaults
        setToolInputs(inputs => ({
          ...inputs,
          [toolId]: { tool: toolId, plan: TOOLS_CONFIG.find(t => t.id === toolId)!.plans[1] || TOOLS_CONFIG.find(t => t.id === toolId)!.plans[0], monthlySpend: 0, seats: 1 }
        }));
      }
      return next;
    });
  };

  const updateToolInput = (toolId: ToolName, field: keyof ToolInput, value: string | number) => {
    setToolInputs(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId]!, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const tools = Array.from(selectedTools)
      .map(id => toolInputs[id])
      .filter(Boolean) as ToolInput[];

    const input: AuditInput = { tools, teamSize, useCase };
    const result = runAudit(input);

    // Save to localStorage for results page
    localStorage.setItem(`audit-${result.auditId}`, JSON.stringify(result));

    // Save to backend
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
    } catch (e) {
      // Continue even if backend fails
    }

    router.push(`/results/${result.auditId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Audit Your AI Spend</h1>
      <p className="text-slate-400 mb-8">Select the tools you pay for and enter your current spend.</p>

      {/* Team Info */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardHeader><CardTitle className="text-white">Your Team</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Team Size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={e => setTeamSize(Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-300">Primary Use Case</Label>
            <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['coding', 'writing', 'data', 'research', 'mixed'].map(u => (
                  <SelectItem key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tool Selection */}
      <h2 className="text-xl font-semibold text-white mb-4">Select Your Tools</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOOLS_CONFIG.map(tool => (
          <button
            key={tool.id}
            onClick={() => toggleTool(tool.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTools.has(tool.id)
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Tool Details */}
      {Array.from(selectedTools).map(toolId => {
        const config = TOOLS_CONFIG.find(t => t.id === toolId)!;
        const input = toolInputs[toolId];
        if (!input) return null;
        return (
          <Card key={toolId} className="bg-slate-800 border-slate-700 mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">{config.label}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300 text-sm">Plan</Label>
                <Select value={input.plan} onValueChange={v => updateToolInput(toolId, 'plan', v)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.plans.map(p => (
                      <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Monthly Spend ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={input.monthlySpend}
                  onChange={e => updateToolInput(toolId, 'monthlySpend', Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Seats</Label>
                <Input
                  type="number"
                  min={1}
                  value={input.seats}
                  onChange={e => updateToolInput(toolId, 'seats', Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {selectedTools.size > 0 && (
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg py-6 mt-4"
        >
          {loading ? 'Analyzing...' : 'Get My Free Audit →'}
        </Button>
      )}
    </div>
  );
}