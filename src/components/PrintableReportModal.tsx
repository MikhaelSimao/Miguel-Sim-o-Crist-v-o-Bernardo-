/**
 * @file src/components/PrintableReportModal.tsx
 * @description Modal e Visualização Formatada para Impressão de Relatórios Oficiais de Inundação
 */

import React from 'react';
import { Printer, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Report } from '../types';

interface PrintableReportModalProps {
  report: Report | null;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative border border-slate-200">
        {/* Botões de Ação Superiores (Não aparecem na Impressão) */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800">
              Visualização de Impressão de Relatório
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar em PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DOCUMENTO IMPRESSO OFICIAL DO GOVERNO PROVINCIAL DO BENGO */}
        <div className="space-y-6 text-slate-900 print:p-0">
          {/* Cabecalho Institucional */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <h1 className="font-extrabold text-sm uppercase tracking-widest text-slate-900">
              REPÚBLICA DE ANGOLA
            </h1>
            <h2 className="font-bold text-xs uppercase text-slate-700">
              GOVERNO PROVINCIAL DO BENGO
            </h2>
            <h3 className="font-semibold text-xs text-blue-900">
              Comando Provincial da Proteção Civil e Bombeiros - Dande
            </h3>
            <p className="text-[10px] text-slate-500 italic mt-1">
              Sistema de Monitoramento e Alerta do Bairro Mubungo (SABM)
            </p>
          </div>

          {/* Dados Gerais do Relatório */}
          <div className="flex justify-between items-start text-xs border-b pb-3 border-slate-200">
            <div>
              <span className="font-mono text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {report.code}
              </span>
              <h2 className="font-extrabold text-lg text-slate-900 mt-1">{report.title}</h2>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Data de Emissão: <strong>{report.date}</strong></div>
              <div>Estado: <strong className="text-emerald-700 uppercase">{report.status}</strong></div>
            </div>
          </div>

          {/* Tabela de Indicadores TÉCNICOS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">Média de Nível Registado</div>
              <div className="font-extrabold text-slate-800 text-sm">{report.avgWaterLevelMeters} m</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Pico Máximo de Nível</div>
              <div className="font-extrabold text-red-600 text-sm">{report.maxWaterLevelMeters} m</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Ocorrências de Alerta</div>
              <div className="font-extrabold text-slate-800 text-sm">{report.floodEventsCount} eventos</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Famílias em Zona de Risco</div>
              <div className="font-extrabold text-amber-600 text-sm">~{report.affectedFamiliesEstimate}</div>
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] border-b pb-1">
              1. Análise da Situação no Bairro Mubungo
            </h4>
            <p className="text-slate-700 leading-relaxed text-justify">
              {report.description}
            </p>
          </div>

          {/* Recomendações e Medidas Operacionais */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] border-b pb-1">
              2. Recomendações Técnicas e Ações de Mitigação
            </h4>
            <p className="text-slate-700 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-200">
              {report.recommendations}
            </p>
          </div>

          {/* Assinatura e Validação do Emissor */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-800">{report.createdBy}</div>
              <div className="text-[10px] text-slate-500">{report.creatorRole}</div>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-800">Comando da Proteção Civil</div>
              <div className="text-[10px] text-slate-500">Província do Bengo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
