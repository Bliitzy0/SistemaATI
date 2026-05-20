import { useState } from 'react';

export default function NavisionForm({ idSolicitud, onSuccess }) {
  const [formData, setFormData] = useState({
    tipo_solicitud: 'Alta de Usuario',
    acceso_companias: [],
    area: '',
    puestos: [],
    great: [],
    unidad_negocio: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxList = (e, field) => {
    const { value, checked } = e.target;
    let list = [...formData[field]];
    if (checked) {
      list.push(value);
    } else {
      list = list.filter(item => item !== value);
    }
    setFormData({ ...formData, [field]: list });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData, id_solicitud_principal: idSolicitud };

      const response = await fetch('http://localhost:8000/api/navision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al registrar accesos de Navision');
      await response.json();
      onSuccess();
    } catch (err) {
      setError('Error al enviar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const companias = ['MX_001 Centro América', 'MX_002 ISS Servicios Integrales', 'MX_003 ISS Facility Services', 'MX_012 Group Eliminatios CA', 'MX_011 Group Eliminatio...'];
  const areas = ['Dirección', 'Finanzas', 'Operaciones', 'G&C', 'Ventas', 'Externo', 'Otro'];
  const puestosList = ['CONSULTANT', 'OPERATION SUPPORT & FINANCIAL', 'PURCHASER', 'WAREHOUSE', 'OPERATION SUPPORT', 'BUSINESS PARTNER', 'POSTEADOR', 'IT SUPPORT', 'OPERATION AUTHORIZER', 'TREASURY', 'TREASURY TEAM LEAD', 'INVOICING', 'INVOICING TEAM LEAD', 'COLLECTION', 'COLLECTION TEAM LEAD', 'ACCOUNTING CXP', 'ACCOUNTING INVENTORY', 'ACCOUNTING AF', 'ACCOUNTING TAX', 'NAVISION ESPECIALIST SUPPORT', 'ACCOUNTING AUXILIAR', 'ACCOUNTING TEAM LEAD'];
  const greats = ['MX_201 KA-Multisites Global', 'MX_202 KA-Office Based Single Sites', 'MX_203 KA-Multisites Local', 'MX_225 Production Based KA', 'MX_405 Cleaning Services', 'MX_410 Food Services', 'MX_610 Strategic Transformatio'];
  const unidades = ['UN101', 'UN102', 'UN201', 'UN206', 'UN301', 'UN302', 'UN401', 'UN402', 'UN403', 'UN900', 'UN910', 'UN920', 'UN930', 'UN940', 'UN950', 'UN960', 'UN970', 'UN990', 'UN999'];

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="radio-group-horizontal">
        {['Alta de Usuario', 'Reactivación de Cuenta', 'Modificación de Perfil'].map(tipo => (
          <label key={tipo} className="radio-option">
            <input type="radio" name="tipo_solicitud" value={tipo} checked={formData.tipo_solicitud === tipo} onChange={handleChange} />
            {tipo}
          </label>
        ))}
      </div>

      <h3 className="section-title">Acceso a compañías</h3>
      <div className="checkbox-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {companias.map(comp => (
          <div className="checkbox-group" key={comp}>
            <input type="checkbox" id={comp} value={comp} onChange={(e) => handleCheckboxList(e, 'acceso_companias')} />
            <label htmlFor={comp}>{comp}</label>
          </div>
        ))}
      </div>

      <div className="grid-2-col" style={{ marginTop: '2rem' }}>
        <div>
          <h3 className="section-title">Área</h3>
          <div className="form-group">
            <select name="area" value={formData.area} onChange={handleChange} required>
              <option value="" disabled>Selecciona un área</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <h3 className="section-title">Great</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {greats.map(g => (
              <div className="checkbox-group" key={g}>
                <input type="checkbox" id={g} value={g} onChange={(e) => handleCheckboxList(e, 'great')} />
                <label htmlFor={g}>{g}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="section-title">Puestos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
            {puestosList.map(p => (
              <div className="checkbox-group" key={p}>
                <input type="checkbox" id={p} value={p} onChange={(e) => handleCheckboxList(e, 'puestos')} />
                <label htmlFor={p} style={{ fontSize: '0.85rem' }}>{p}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="section-title">Unidad de Negocio</h3>
      <div className="checkbox-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
        {unidades.map(u => (
          <div className="checkbox-group" key={u}>
            <input type="checkbox" id={u} value={u} onChange={(e) => handleCheckboxList(e, 'unidad_negocio')} />
            <label htmlFor={u}>{u}</label>
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <div className="spinner" /> : 'Finalizar Activación Navision'}
      </button>
    </form>
  );
}
