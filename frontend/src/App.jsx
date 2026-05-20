import { useState } from 'react';
import './index.css';
import SolicitudForm from './components/SolicitudForm';
import NavisionForm from './components/NavisionForm';

function App() {
  const [step, setStep] = useState(1);
  const [solicitudId, setSolicitudId] = useState(null);

  const handleSolicitudSuccess = (id, requiresNavision) => {
    setSolicitudId(id);
    if (requiresNavision) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleNavisionSuccess = () => {
    setStep(3);
  };

  return (
    <div className="app-container">
      {/* Sidebar matching the dashboard style */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          {/* Mock Logo matching ISS style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: '4px',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.2rem',
              letterSpacing: '1px'
            }}>ISS</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', fontWeight: '700', lineHeight: '1.2' }}>Facility</span>
              <span style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', fontWeight: '700', lineHeight: '1.2' }}>Services</span>
            </div>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Sistema de Accesos</span>
        </div>

        <div className="sidebar-steps">
          <div className={`step-item ${step === 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            Información General
          </div>
          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            Detalles Navision
          </div>
          <div className={`step-item ${step === 3 ? 'active' : ''}`}>
            <div className="step-number">✓</div>
            Completado
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <h1>Activación de Cuenta de Usuario y Equipo</h1>
        <p className="subtitle">
          {step === 1 && "Por favor llenar los cuadros con toda la información requerida para control de accesos."}
          {step === 2 && "Los siguientes campos deben ser completados si el usuario usará Navision."}
          {step === 3 && "Registro finalizado con éxito."}
        </p>

        <div className="form-panel">
          {step === 1 && (
            <SolicitudForm onSuccess={handleSolicitudSuccess} />
          )}

          {step === 2 && (
            <NavisionForm idSolicitud={solicitudId} onSuccess={handleNavisionSuccess} />
          )}

          {step === 3 && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>¡Formulario Enviado Exitosamente!</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                La creación de la cuenta y los permisos de acceso al sistema serán gestionados a la brevedad.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => { setStep(1); setSolicitudId(null); }}
              >
                Registrar Nuevo Usuario
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
