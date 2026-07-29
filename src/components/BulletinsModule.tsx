/**
 * @file src/components/BulletinsModule.tsx
 * @description Módulo de Pesquisa, Leitura e Criação de Boletins Hidrometeorológicos do Bengo
 */

import React, { useState } from 'react';
import { FileText, Search, Plus, Filter, Calendar, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { Bulletin, SeverityLevel, Language, User } from '../types';
import { getBulletins, saveBulletin } from '../services/storage';
import { getTranslation } from '../data/translations';

interface BulletinsModuleProps {
  currentLang: Language;
  currentUser: User;
}

export const BulletinsModule: React.FC<BulletinsModuleProps> = ({ currentLang, currentUser }) => {
  const [bulletins, setBulletins] = useState<Bulletin[]>(getBulletins());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtro por termo de pesquisa e severidade
  const filteredBulletins = bulletins.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'Todos' || b.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  // Guardar Novo Boletim
  const handleCreateBulletin = (newB: Bulletin) => {
    saveBulletin(newB);
    setBulletins(getBulletins());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Barra de Pesquisa e Filtros */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Boletins Hidrometeorológicos Oficiais
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consulte avisos de cheias e comunicados oficiais da Proteção Civil para a Província do Bengo
            </p>
          </div>

          {(currentUser.role === 'admin' || currentUser.role === 'protecao_civil') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {getTranslation(currentLang, 'createNewBulletin')}
            </button>
          )}
        </div>

        {/* Filtros e Barra de Pesquisa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={getTranslation(currentLang, 'searchPlaceholder')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Todos">Todas as Severidades</option>
              <option value="Normal">Normal</option>
              <option value="Atenção">Atenção</option>
              <option value="Alerta">Alerta</option>
              <option value="Emergência">Emergência</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Boletins Registados */}
      <div className="space-y-4">
        {filteredBulletins.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            Nenhum boletim encontrado com os critérios de pesquisa especificados.
          </div>
        ) : (
          filteredBulletins.map((b) => {
            const badgeClass =
              b.severity === 'Emergência'
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : b.severity === 'Alerta'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : b.severity === 'Atenção'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {b.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                        {b.severity}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white">{b.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{b.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {b.content}
                </p>

                {b.instructions && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      Recomendações para a População do Mubungo:
                    </div>
                    <p>{b.instructions}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Emissor: <strong>{b.author}</strong></span>
                  <span>Abrangência: <strong>{b.location}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE CRIAÇÃO DE NOVO BOLETIM */}
      {isModalOpen && (
        <CreateBulletinModal
          onSave={handleCreateBulletin}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// SUBCOMPONENTE MODAL DE FORMULÁRIO DE BOLETIM
const CreateBulletinModal: React.FC<{
  onSave: (b: Bulletin) => void;
  onClose: () => void;
  currentUser: User;
}> = ({ onSave, onClose, currentUser }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Atenção');
  const [location, setLocation] = useState('Bairro Mubungo, Caxito');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: Bulletin = {
      id: `bol-${Date.now()}`,
      code: `BOL-BENGO-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      content,
      instructions,
      severity,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      location,
    };
    onSave(newB);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4">
        <h3 className="font-bold text-base">Publicar Novo Boletim Hidrometeorológico</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título do Comunicado</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Alerta de Inundação Bairro Mubungo"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nível de Severidade</label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value as SeverityLevel)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white cursor-pointer"
            >
              <option value="Normal">Normal</option>
              <option value="Atenção">Atenção</option>
              <option value="Alerta">Alerta</option>
              <option value="Emergência">Emergência Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Descrição / Conteúdo do Boletim</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Descreva a situação do leito do rio Dande..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Recomendações à População do Mubungo</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Ex: Desligar os disjuntores e seguir para os pontos de apoio..."
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
              Publicar Boletim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
