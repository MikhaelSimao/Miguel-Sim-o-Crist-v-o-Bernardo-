/**
 * @file src/components/MessagesSupport.tsx
 * @description Módulo de Mensagens da Comunidade, Envio de SMS de Emergência e Contactos Oficiais
 */

import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Send, AlertTriangle, CheckCircle2, ShieldAlert, Radio, UserCheck, HelpCircle } from 'lucide-react';
import { SupportMessage, Language, User } from '../types';
import { getMessages, saveMessage, updateMessageResponse, EMERGENCY_CONTACTS } from '../services/storage';
import { getTranslation } from '../data/translations';

interface MessagesSupportProps {
  currentLang: Language;
  currentUser: User;
}

export const MessagesSupport: React.FC<MessagesSupportProps> = ({ currentLang, currentUser }) => {
  const [messages, setMessages] = useState<SupportMessage[]>(getMessages());
  const [activeTab, setActiveTab] = useState<'contacts' | 'citizen_messages' | 'sms_broadcast'>('contacts');

  // Estados do Formulário de Denúncia
  const [senderName, setSenderName] = useState(currentUser.name);
  const [senderPhone, setSenderPhone] = useState(currentUser.phone);
  const [neighborhood, setNeighborhood] = useState('Bairro Mubungo - Sector A');
  const [messageText, setMessageText] = useState('');
  const [category, setCategory] = useState<SupportMessage['category']>('Denúncia de Risco');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Estado para Resposta de Proteção Civil
  const [replyingMsgId, setReplyingMsgId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Estado para Disparo de SMS em Massa
  const [smsText, setSmsText] = useState('ATENÇÃO BENGO: Nível da Vala do Mubungo em Alerta de Cheia. Famílias das áreas baixas devem deslocar-se para a Escola Primária.');
  const [smsSentCount, setSmsSentCount] = useState<number | null>(null);

  // Submissão de Mensagem de Cidadão
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText) return;

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      senderName,
      senderPhone,
      neighborhood,
      message: messageText,
      date: new Date().toLocaleString('pt-AO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      status: 'Pendente',
      category,
    };

    saveMessage(newMsg);
    setMessages(getMessages());
    setMessageText('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  // Responder Mensagem (Admin / Proteção Civil)
  const handleSendResponse = (msgId: string) => {
    if (!responseText) return;
    updateMessageResponse(msgId, responseText);
    setMessages(getMessages());
    setReplyingMsgId(null);
    setResponseText('');
  };

  // Simular Envio de SMS em Massa para a População do Bengo
  const handleBroadcastSms = () => {
    setSmsSentCount(1420); // Simula 1.420 moradores registados no Bengo
    setTimeout(() => {
      alert(`Alerta SMS enviado com sucesso para 1.420 telemóveis registados no Bairro Mubungo e Caxito!`);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            Mensagens, Alerta SMS e Suporte de Emergência
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Canal direto de comunicação entre a população do Bairro Mubungo e as autoridades do Bengo
          </p>
        </div>
      </div>

      {/* Separadores */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          Contactos de Emergência Bengo
        </button>

        <button
          onClick={() => setActiveTab('citizen_messages')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'citizen_messages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Denúncias & Mensagens ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('sms_broadcast')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sms_broadcast' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          Difusão SMS de Emergência
        </button>
      </div>

      {/* ABA 1: CONTACTOS DE EMERGÊNCIA NO BENGO */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                  {c.organization}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.location} • Atendimento: {c.availableHours}</p>
                <div className="font-mono font-bold text-emerald-400 text-sm mt-2">{c.phone}</div>
              </div>

              <a
                href={`tel:${c.phone}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl shadow transition-all flex items-center justify-center"
                title="Ligar para Linha Direta"
              >
                <PhoneCall className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ABA 2: MENSAGENS E DENÚNCIAS DA COMUNIDADE */}
      {activeTab === 'citizen_messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Envio para o Cidadão */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" />
              Enviar Denúncia / Pedido de Apoio
            </h3>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Telefone (SMS)</label>
                <input
                  type="text"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Localização no Mubungo</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Categoria da Mensagem</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white cursor-pointer"
                >
                  <option value="Denúncia de Risco">Denúncia de Risco de Inundação</option>
                  <option value="Pedido de Ajuda">Pedido de Resgate / Ajuda</option>
                  <option value="Dúvida Técnica">Dúvida Técnica de Sensores</option>
                  <option value="Geral">Assunto Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mensagem Detalhada</label>
                <textarea
                  required
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Relate o estado da vala ou necessidade de evacuação..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {sentSuccess && (
                <div className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mensagem enviada com sucesso para a Proteção Civil do Bengo!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Enviar para Proteção Civil
              </button>
            </form>
          </div>

          {/* Lista de Mensagens Recebidas */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Registo de Mensagens da Comunidade do Mubungo
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{m.senderName}</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded">
                        {m.senderPhone}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      m.status === 'Pendente' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {m.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Local: <strong>{m.neighborhood}</strong></span>
                    <span>{m.date}</span>
                  </div>

                  {/* Resposta Registada */}
                  {m.response && (
                    <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl text-blue-200 mt-2 space-y-1">
                      <span className="font-bold text-blue-400 text-[10px] uppercase block">Resposta da Proteção Civil:</span>
                      <p>{m.response}</p>
                    </div>
                  )}

                  {/* Ação de Resposta para Autoridades/Admin */}
                  {(currentUser.role === 'admin' || currentUser.role === 'protecao_civil') && !m.response && (
                    <div className="pt-2 border-t border-slate-700/60">
                      {replyingMsgId === m.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Escreva a resposta oficial para o cidadão..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReplyingMsgId(null)}
                              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-xs"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSendResponse(m.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                            >
                              Responder
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingMsgId(m.id)}
                          className="text-xs text-blue-400 font-semibold hover:underline"
                        >
                          + Adicionar Resposta Oficial
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: DIFUSÃO DE SMS DE EMERGÊNCIA */}
      {activeTab === 'sms_broadcast' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-base text-white">
                Módulo de Disparo de SMS Massivo de Emergência
              </h3>
              <p className="text-xs text-slate-400">
                Envie alertas SMS urgentes em lote para todos os telemóveis do Bairro Mubungo e Caxito
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Texto do Alerta SMS (Max 160 Caracteres)</label>
              <textarea
                rows={3}
                maxLength={160}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono"
              />
              <div className="text-right text-[10px] text-slate-500 mt-1">
                {smsText.length} / 160 caracteres
              </div>
            </div>

            {smsSentCount && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Alerta broadcast enviado para <strong>{smsSentCount}</strong> números registados no Bengo!</span>
              </div>
            )}

            <button
              onClick={handleBroadcastSms}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 fill-current" />
              Disparar Alerta SMS de Emergência Agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
