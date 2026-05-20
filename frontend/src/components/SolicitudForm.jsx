import { useState } from 'react';

export default function SolicitudForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    nombre_solicitante: '',
    numero_empleado: '',
    puesto: '',
    job_task: '',
    usuario_nombre: '',
    ubicacion: '',
    area: '',
    jefe_inmediato: '',
    req_computadora: false,
    telefono_reasignacion: '',
    req_smartphone: false,
    tag_reasignacion: '',
    observaciones: '',
    soft_onestream: false,
    soft_navision: false,
    soft_grupo_teams: false,
    soft_siscom: false,
    soft_site: false,
    soft_flujo_facturacion: false,
    soft_crm: false,
    soft_acrobat_pro: false,
    lic_creative_cloud: false,
    lic_visio: false,
    lic_project: false,
    lic_teams: false,
    lic_otros: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al registrar la solicitud');

      const data = await response.json();
      // Si seleccionaron Navision, vamos al paso 2. Si no, terminamos.
      onSuccess(data.id_generado, formData.soft_navision);
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}

      <h3 className="section-title">Datos Generales</h3>
      <div className="grid-2-col">
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Nombre completo del solicitante</label>
          <input type="text" name="nombre_solicitante" value={formData.nombre_solicitante} onChange={handleChange} required />
        </div>
      </div>

      <h3 className="section-title">Datos del Usuario</h3>
      <div className="grid-2-col">
        <div className="form-group">
          <label>Número de empleado</label>
          <input type="text" name="numero_empleado" value={formData.numero_empleado} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Nombre completo del usuario</label>
          <input type="text" name="usuario_nombre" value={formData.usuario_nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Puesto</label>
          <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Ubicación</label>
          <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Job/JobTask</label>
          <input type="text" name="job_task" value={formData.job_task} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Área</label>
          <input type="text" name="area" value={formData.area} onChange={handleChange} />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Jefe Inmediato</label>
          <input type="text" name="jefe_inmediato" value={formData.jefe_inmediato} onChange={handleChange} />
        </div>
      </div>

      <h3 className="section-title">Equipo de Trabajo</h3>
      <div className="grid-2-col">
        <div className="form-group checkbox-group">
          <input type="checkbox" id="req_computadora" name="req_computadora" checked={formData.req_computadora} onChange={handleChange} />
          <label htmlFor="req_computadora">Computadora</label>
        </div>
        <div className="form-group checkbox-group">
          <input type="checkbox" id="req_smartphone" name="req_smartphone" checked={formData.req_smartphone} onChange={handleChange} />
          <label htmlFor="req_smartphone">Smartphone</label>
        </div>
        <div className="form-group">
          <label>Teléfono en caso de reasignación</label>
          <input type="text" name="telefono_reasignacion" value={formData.telefono_reasignacion} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>En caso de reasignación (TAG)</label>
          <input type="text" name="tag_reasignacion" value={formData.tag_reasignacion} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Observaciones</label>
        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}></textarea>
      </div>

      <h3 className="section-title">Software y Accesos Adicionales</h3>
      <div className="checkbox-grid">
        {[
          { id: 'soft_onestream', label: 'OneStream' },
          { id: 'soft_navision', label: 'Navision' },
          { id: 'soft_grupo_teams', label: 'Grupo en Teams' },
          { id: 'soft_siscom', label: 'Siscom' },
          { id: 'soft_site', label: 'SITE' },
          { id: 'soft_flujo_facturacion', label: 'Flujo de facturación' },
          { id: 'soft_crm', label: 'CRM' },
          { id: 'soft_acrobat_pro', label: 'Acrobat Pro' }
        ].map(item => (
          <div className="checkbox-group" key={item.id}>
            <input type="checkbox" id={item.id} name={item.id} checked={formData[item.id]} onChange={handleChange} />
            <label htmlFor={item.id}>{item.label}</label>
          </div>
        ))}
      </div>

      <h3 className="section-title">Licencias con Costo Adicional</h3>
      <div className="checkbox-grid">
        {[
          { id: 'lic_creative_cloud', label: 'Creative Cloud' },
          { id: 'lic_visio', label: 'MS Visio' },
          { id: 'lic_project', label: 'MS Project' },
          { id: 'lic_teams', label: 'MS Teams' }
        ].map(item => (
          <div className="checkbox-group" key={item.id}>
            <input type="checkbox" id={item.id} name={item.id} checked={formData[item.id]} onChange={handleChange} />
            <label htmlFor={item.id}>{item.label}</label>
          </div>
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Otros, especifique (Licencias)</label>
        <input type="text" name="lic_otros" value={formData.lic_otros} onChange={handleChange} />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <div className="spinner" /> : (formData.soft_navision ? 'Siguiente Paso (Navision)' : 'Finalizar Solicitud')}
      </button>
    </form>
  );
}
