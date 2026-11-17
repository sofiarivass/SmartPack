/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, Shipment } from './types';
import { INITIAL_SHIPMENTS } from './data/shipments';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { WorkstationView } from './components/WorkstationView';
import { TrackingView } from './components/TrackingView';
import { AdministrationView } from './components/AdministrationView';
import { LabelModal } from './components/LabelModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SupportModal } from './components/SupportModal';
import { subscribeToShipments, saveShipmentToFirebase } from './lib/firebase';
import { useArduinoSerial } from './lib/useArduinoSerial';

export default function App() {
  const arduino = useArduinoSerial();
  const [currentView, setCurrentView] = useState<ViewMode>('resumen');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('SP-849203-ES');

  // Modals
  const [activeLabelShipment, setActiveLabelShipment] = useState<Shipment | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  // Subscribe to real-time shipments from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToShipments((remoteShipments) => {
      if (remoteShipments && remoteShipments.length > 0) {
        setShipments((prev) => {
          const map = new Map<string, Shipment>();
          // Newest remote records first
          remoteShipments.forEach((s) => map.set(s.id, s));
          // Keep existing seed records if not yet in remote
          prev.forEach((s) => {
            if (!map.has(s.id)) {
              map.set(s.id, s);
            }
          });
          return Array.from(map.values());
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipmentId(shipment.id);
    setCurrentView('etiquetas');
  };

  const handleTrackCode = (code: string) => {
    setSelectedShipmentId(code);
    setCurrentView('etiquetas');
  };

  const handleNewShipmentCreated = async (pkg: Shipment) => {
    setActiveLabelShipment(pkg);
    setShipments((prev) => [pkg, ...prev.filter((p) => p.id !== pkg.id)]);
    await saveShipmentToFirebase(pkg);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <div className="flex w-full">
        {/* Fixed Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          pingsPerMin={42}
        />

        {/* Main content wrapper shifted by sidebar width */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'pl-20' : 'pl-72'
          }`}
        >
          {/* Top Fixed Header */}
          <Header
            collapsed={sidebarCollapsed}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
            unreadCount={2}
          />

          {/* Main View Area */}
          <main className="w-full pt-16 pb-16">
            {currentView === 'resumen' && (
              <ExecutiveSummaryView
                onNavigateToShipments={() => setCurrentView('envios')}
                onNavigateToTracking={handleTrackCode}
              />
            )}

            {currentView === 'envios' && (
              <WorkstationView
                shipments={shipments}
                arduino={arduino}
                onSelectShipment={handleSelectShipment}
                onOpenLabelModal={handleNewShipmentCreated}
              />
            )}

            {currentView === 'etiquetas' && (
              <TrackingView
                shipments={shipments}
                initialCode={selectedShipmentId}
                onOpenSupport={() => setSupportOpen(true)}
                embedded
              />
            )}

            {currentView === 'administracion' && <AdministrationView />}
          </main>
        </div>
      </div>

      {/* MODALS */}
      {activeLabelShipment && (
        <LabelModal
          shipment={activeLabelShipment}
          onClose={() => setActiveLabelShipment(null)}
          onTrack={(id) => {
            setActiveLabelShipment(null);
            handleTrackCode(id);
          }}
        />
      )}

      {searchOpen && (
        <SearchModal
          shipments={shipments}
          onClose={() => setSearchOpen(false)}
          onSelectShipment={(shipment) => {
            handleSelectShipment(shipment);
          }}
        />
      )}

      {notificationsOpen && (
        <NotificationsModal
          onClose={() => setNotificationsOpen(false)}
          onSelectShipmentId={(id) => {
            handleTrackCode(id);
          }}
        />
      )}

      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </div>
  );
}
