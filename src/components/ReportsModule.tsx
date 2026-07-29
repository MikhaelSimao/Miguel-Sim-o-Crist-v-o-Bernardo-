/**
 * @file src/components/ReportsModule.tsx
 * @description Módulo de Pesquisa, Geração e Impressão de Relatórios Oficiais de Inundação
 */

import React, { useState } from 'react';
import { FileBarChart, Search, Plus, Printer, Calendar, ShieldCheck, Filter, UserCheck, Eye } from 'lucide-react';
import { Report, Language, User } from '../types';
import { getReports, saveReport } from '../services/storage';
import { getTranslation } from '../data/translations';
import { PrintableReportModal } from './PrintableReportModal';

interface ReportsModuleProps {
  currentLang: Language;
  currentUser: User;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ currentLang, currentUser }) => {
  const [reports, setReports] = useState<Report[]>(getReports());
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [printingReport, setPrintingReport] = useState<Report | null>(null);

  // Filtra relatórios por código, título ou zona
  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.riskZone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Guardar Novo Relatório
  const handleCreateReport = (newR: Report) => {
    saveReport(newR);
    setReports(getReports());
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <FileBarChart className="w-6 h-6 text-blue-400" />
              Emitir e Pesquisar Relatórios Técnicos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Documentos oficiais de acompanhamento do nível hídrico do Rio Dande e impacto no Bairro Mubungo
            </p>
          </div>

          {(currentUser.role === 'admin' || currentUser.role === 'tecnico' || currentUser.role === 'protecao_civil') && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {getTranslation(currentLang, 'createNewReport')}
            </button>
          )}
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative pt-2 border-t border-slate-800">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={getTranslation(currentLang, 'searchPlaceholder')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabela de Relatórios Registados */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código / Título</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Zona Afeita</th>
                <th className="py-3 px-4">Pico (m)</th>
                <th className="py-3 px-4">Elaborado Por</th>
                <th className="py-3 px-4 text-right">Ação / Impressão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Nenhum relatório encontrado.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="font-mono text-[10px] text-blue-400">{r.code}</div>
                      <div className="text-xs">{r.title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{r.date}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.riskZone}</td>
                    <td className="py-3.5 px-4 font-bold text-red-400 font-mono">{r.maxWaterLevelMeters} m</td>
                    <td className="py-3.5 px-4 text-slate-400">{r.createdBy}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setPrintingReport(r)}
                        className="bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-all inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        {getTranslation(currentLang, 'printReport')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA EMITIR NOVO RELATÓRIO */}
      {isCreateModalOpen && (
        <CreateReportModal
          onSave={handleCreateReport}
          onClose={() => setIsCreateModalOpen(false)}
          currentUser={currentUser}
        />
      )}

      {/* MODAL DE IMPRESSÃO DE RELATÓRIO */}
      {printingReport && (
        <PrintableReportModal
          report={printingReport}
          onClose={() => setPrintingReport(null)}
        />
      )}
    </div>
  );
};

// SUBCOMPONENTE MODAL PARA CRIAR NOVO RELATÓRIO
const CreateReportModal: React.FC<{
  onSave: (r: Report) => void;
  onClose: () => void;
  currentUser: User;
}> = ({ onSave, onClose, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [riskZone, setRiskZone] = useState('Bairro Mubungo - Zonas A e B');
  const [avgWaterLevelMeters, setAvg] = useState(2.8);
  const [maxWaterLevelMeters, setMax] = useState(3.5);
  const [affectedFamiliesEstimate, setFamilies] = useState(25);
  const [recommendations, setRecommendations] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: Report = {
      id: `rep-${Date.now()}`,
      code: `REL-BENGO-2026-${Math.floor(10 + Math.random() * 90)}`,
      title,
      date: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
      creatorRole: currentUser.role,
      description,
      avgWaterLevelMeters: Number(avgWaterLevelMeters),
      maxWaterLevelMeters: Number(maxWaterLevelMeters),
      floodEventsCount: 1,
      affectedFamiliesEstimate: Number(affectedFamiliesEstimate),
      riskZone,
      recommendations,
      status: 'Publicado',
    };
    onSave(newR);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4">
        <h3 className="font-bold text-base">Emitir Novo Relatório Técnico de Inundação</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título do Relatório</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Relatório Semanal de Caudal do Rio Dande"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Média de Nível (m)</label>
              <input
                type="number"
                step="0.1"
                value={avgWaterLevelMeters}
                onChange={e => setAvg(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pico Máximo (m)</label>
              <input
                type="number"
                step="0.1"
                value={maxWaterLevelMeters}
                onChange={e => setMax(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Análise Técnica e Situação do Mubungo</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva o comportamento do escoamento..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Recomendações e Ações de Mitigação</label>
            <textarea
              required
              rows={2}
              value={recommendations}
              onChange={e => setRecommendations(e.target.value)}
              placeholder="Medidas preventivas sugeridas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow"
            >
              Emitir Relatório
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
