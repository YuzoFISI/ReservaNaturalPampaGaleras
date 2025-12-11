import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Especies() {
  const [especies, setEspecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nombre_comun: '', nombre_cientifico: '', estado_conservacion: 'DD', clase: '', orden: '', familia: '' })
  const [editing, setEditing] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('rnpg_token') || '' : ''
  const estados = ['LC', 'NT', 'VU', 'EN', 'CR', 'DD', 'NE']

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    fetchEspecies()
  }, [token])

  async function fetchEspecies() {
    setLoading(true)
    try {
      const res = await axios.get('/api/especies')
      setEspecies(res.data.rows || [])
    } catch (err) {
      console.error(err)
      setError('Error cargando especies')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ nombre_comun: '', nombre_cientifico: '', estado_conservacion: 'DD', clase: '', orden: '', familia: '' })
    setEditing(null)
    setSuccessMsg('')
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!token) {
      alert('Debes iniciar sesión para crear especies. Ve a /admin y haz login.')
      return
    }
    try {
      const r = await axios.post('/api/especies', form)
      if (r.data && r.data.ok) {
        const res = await axios.get('/api/especies')
        setEspecies(res.data.rows || [])
        setSuccessMsg('✓ Especie creada exitosamente')
        resetForm()
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      alert('Error creando especie: ' + (err?.response?.data?.error || err.message))
    }
  }

  function startEdit(s) {
    const id = s.ID_ESPECIE || s.id_especie
    setEditing(id)
    setForm({
      nombre_comun: s.NOMBRE_COMUN || s.nombre_comun || '',
      nombre_cientifico: s.NOMBRE_CIENTIFICO || s.nombre_cientifico || '',
      estado_conservacion: s.ESTADO_CONSERVACION || s.estado_conservacion || 'DD',
      clase: s.CLASE || s.clase || '',
      orden: s.ORDEN || s.orden || '',
      familia: s.FAMILIA || s.familia || ''
    })
    setSuccessMsg('')
    setTimeout(() => {
      document.querySelector('.especies-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!token) {
      alert('Debes iniciar sesión para editar especies. Ve a /admin y haz login.')
      return
    }
    try {
      const r = await axios.put(`/api/especies/${editing}`, form)
      if (r.data && r.data.ok) {
        const res = await axios.get('/api/especies')
        setEspecies(res.data.rows || [])
        setSuccessMsg('✓ Especie actualizada exitosamente')
        resetForm()
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      alert('Error actualizando especie: ' + (err?.response?.data?.error || err.message))
    }
  }

  async function handleDelete(id) {
    if (!token) {
      alert('Debes iniciar sesión para eliminar especies. Ve a /admin y haz login.')
      return
    }
    if (!confirm('Eliminar especie #' + id + '? Esta acción es irreversible.')) return
    try {
      const r = await axios.delete(`/api/especies/${id}`)
      if (r.data && r.data.ok) {
        setEspecies(prev => prev.filter(x => (x.ID_ESPECIE || x.id_especie) !== id))
        setSuccessMsg('✓ Especie eliminada exitosamente')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      alert('Error eliminando: ' + (err?.response?.data?.error || err.message))
    }
  }

  if (loading) return <div className="page"><p>Cargando especies...</p></div>
  if (error) return <div className="page"><p className="error">{error}</p></div>

  return (
    <div className="page especies-page">
      <div className="page-header">
        <h1>🦎 Gestión de Especies</h1>
        <p className="muted">Registra y gestiona especies de la reserva. Requiere autenticación.</p>
      </div>

      <div className="crud-container">
        <div className="list-section">
          <h2>Especies Registradas ({especies.length})</h2>
          {especies.length === 0 ? (
            <div className="empty-state">
              <p>No hay especies registradas. Crea una usando el formulario.</p>
            </div>
          ) : (
            <div className="items-list">
              {especies.map(s => {
                const speciesId = s.ID_ESPECIE || s.id_especie
                return (
                  <div className="item-card" key={speciesId}>
                    <div className="item-header">
                      <div className="item-id">#{speciesId}</div>
                      <div className="item-title">{s.NOMBRE_COMUN || s.nombre_comun}</div>
                      <div className={`item-badge estado-${(s.ESTADO_CONSERVACION || s.estado_conservacion || 'DD').toLowerCase()}`}>
                        {s.ESTADO_CONSERVACION || s.estado_conservacion || 'DD'}
                      </div>
                    </div>
                    <div className="item-body">
                      <div className="info-row">
                        <span className="label">Científico:</span>
                        <span className="value">{s.NOMBRE_CIENTIFICO || s.nombre_cientifico || '—'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Clase:</span>
                        <span className="value">{s.CLASE || s.clase || '—'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Orden:</span>
                        <span className="value">{s.ORDEN || s.orden || '—'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Familia:</span>
                        <span className="value">{s.FAMILIA || s.familia || '—'}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => startEdit(s)}>✏️ Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(speciesId)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <aside className="especies-form-section">
          <div className="form-card">
            <h3>{editing ? '✏️ Editar especie' : '➕ Registrar especie'}</h3>
            {successMsg && <div className="success-msg">{successMsg}</div>}
            
            <form onSubmit={editing ? handleUpdate : handleCreate}>
              <div className="form-group">
                <label>Nombre común</label>
                <input value={form.nombre_comun} onChange={e => setForm(f => ({ ...f, nombre_comun: e.target.value }))} placeholder="Ej. Vicuña" />
              </div>

              <div className="form-group">
                <label>Nombre científico</label>
                <input value={form.nombre_cientifico} onChange={e => setForm(f => ({ ...f, nombre_cientifico: e.target.value }))} placeholder="Ej. Vicugna vicugna" />
              </div>

              <div className="form-group">
                <label>Estado de conservación</label>
                <select value={form.estado_conservacion} onChange={e => setForm(f => ({ ...f, estado_conservacion: e.target.value }))}>
                  {estados.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Clase</label>
                  <input value={form.clase} onChange={e => setForm(f => ({ ...f, clase: e.target.value }))} placeholder="Ej. Mammalia" />
                </div>
                <div className="form-group">
                  <label>Orden</label>
                  <input value={form.orden} onChange={e => setForm(f => ({ ...f, orden: e.target.value }))} placeholder="Ej. Cetartiodactyla" />
                </div>
              </div>

              <div className="form-group">
                <label>Familia</label>
                <input value={form.familia} onChange={e => setForm(f => ({ ...f, familia: e.target.value }))} placeholder="Ej. Camelidae" />
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  {editing ? '💾 Guardar cambios' : '✅ Crear especie'}
                </button>
                {editing && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    ❌ Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}
