/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { PropertyAgent } from '@/types/property';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AgentCardProps {
  priceFormatted: string;
  pricePeriod?: string;
  address: string;
  location: string;
  agent?: PropertyAgent;
  propertyTitle: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  priceFormatted,
  pricePeriod,
  address,
  location,
  agent,
  propertyTitle,
}) => {
  const [scheduled, setScheduled] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const { t, interpolate, getLocalizedPricePeriod } = useLanguage();

  const agentData: PropertyAgent = agent || {
    name: 'Sarah Jenkins',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w',
    phone: '+1 (555) 349-8200',
    email: 'sarah.jenkins@luxeestate.com',
    title: t.agent.topRatedAgent,
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    setTimeout(() => {
      setContactModalOpen(false);
      setScheduled(false);
    }, 2500);
  };

  const localizedPeriod = getLocalizedPricePeriod(pricePeriod);

  const mailToSubject = interpolate(t.agent.emailSubject, { title: propertyTitle });
  const mailToBody = interpolate(t.agent.emailBody, {
    agentName: agentData.name,
    propertyTitle,
    address,
    location,
  });

  const mailToLink = `mailto:${agentData.email || 'contact@luxeestate.com'}?subject=${encodeURIComponent(
    mailToSubject
  )}&body=${encodeURIComponent(mailToBody)}`;

  const telLink = `tel:${agentData.phone?.replace(/[^0-9+]/g, '') || '+15553498200'}`;

  return (
    <>
      <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10">
        {/* Price & Address Header */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <h1 className="text-4xl font-display font-light text-nordic dark:text-white">
              {priceFormatted}
            </h1>
            {localizedPeriod && (
              <span className="text-base text-nordic/60 dark:text-hint-of-green/70">
                {localizedPeriod}
              </span>
            )}
          </div>
          <p className="text-nordic/60 dark:text-hint-of-green/70 font-medium flex items-center gap-1 text-sm">
            <span className="material-icons text-mosque dark:text-hint-of-green text-base">
              location_on
            </span>
            {address}, {location}
          </p>
        </div>

        <div className="h-px bg-slate-100 dark:bg-white/10 my-6"></div>

        {/* Agent Info */}
        <div className="flex items-center gap-4 mb-6">
          <img
            alt={agentData.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-white/20 shadow-sm"
            src={agentData.avatar}
          />
          <div>
            <h3 className="font-semibold text-nordic dark:text-white">{agentData.name}</h3>
            <div className="flex items-center gap-1 text-xs text-mosque dark:text-hint-of-green font-medium">
              <span className="material-icons text-[14px]">star</span>
              <span>{agentData.title || t.agent.topRatedAgent}</span>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <a
              href={mailToLink}
              aria-label={interpolate(t.agent.emailAgentAria, { name: agentData.name })}
              className="p-2 rounded-full bg-mosque/10 dark:bg-hint-of-green/20 text-mosque dark:text-hint-of-green hover:bg-mosque hover:text-white dark:hover:bg-hint-of-green dark:hover:text-nordic transition-colors"
            >
              <span className="material-icons text-sm">chat</span>
            </a>
            <a
              href={telLink}
              aria-label={interpolate(t.agent.callAgentAria, { name: agentData.name })}
              className="p-2 rounded-full bg-mosque/10 dark:bg-hint-of-green/20 text-mosque dark:text-hint-of-green hover:bg-mosque hover:text-white dark:hover:bg-hint-of-green dark:hover:text-nordic transition-colors"
            >
              <span className="material-icons text-sm">call</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="w-full bg-mosque hover:bg-primary-hover dark:bg-hint-of-green dark:hover:bg-hint-of-green/90 text-white dark:text-nordic py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 dark:shadow-none flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span className="material-icons text-xl group-hover:scale-110 transition-transform">
              calendar_today
            </span>
            {t.agent.scheduleVisit}
          </button>

          <a
            href={mailToLink}
            className="w-full bg-transparent border border-nordic/10 dark:border-white/20 hover:border-mosque dark:hover:border-hint-of-green text-nordic/80 hover:text-mosque dark:text-white/80 dark:hover:text-hint-of-green py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-icons text-xl">mail_outline</span>
            {t.agent.contactAgent}
          </a>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {contactModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#162e2a] text-nordic dark:text-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-mosque/10 relative animate-fadeIn">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-nordic/50 hover:text-nordic dark:text-white/50 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={t.agent.closeModal}
            >
              <span className="material-icons">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-mosque/10 dark:bg-hint-of-green/20 text-mosque dark:text-hint-of-green rounded-full">
                <span className="material-icons">event</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t.agent.scheduleModalTitle}</h3>
                <p className="text-xs text-nordic/60 dark:text-white/60 truncate max-w-[260px]">
                  {propertyTitle}
                </p>
              </div>
            </div>

            {scheduled ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-icons text-2xl">check</span>
                </div>
                <h4 className="text-lg font-bold text-nordic dark:text-white">
                  {t.agent.visitRequestedTitle}
                </h4>
                <p className="text-sm text-nordic/70 dark:text-white/70">
                  {interpolate(t.agent.visitRequestedDesc, { name: agentData.name })}
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/70 dark:text-white/70 mb-1">
                    {t.agent.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.agent.fullNamePlaceholder}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-nordic/10 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:border-mosque dark:focus:border-hint-of-green text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/70 dark:text-white/70 mb-1">
                    {t.agent.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.agent.phonePlaceholder}
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-nordic/10 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:border-mosque dark:focus:border-hint-of-green text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/70 dark:text-white/70 mb-1">
                      {t.agent.desiredDateLabel}
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-nordic/10 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:border-mosque text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/70 dark:text-white/70 mb-1">
                      {t.agent.preferredTimeLabel}
                    </label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-nordic/10 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:border-mosque text-sm"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:30">05:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-mosque hover:bg-primary-hover dark:bg-hint-of-green dark:hover:bg-hint-of-green/90 text-white dark:text-nordic py-3.5 rounded-lg font-semibold transition-colors mt-4 cursor-pointer"
                >
                  {t.agent.confirmScheduleButton}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
