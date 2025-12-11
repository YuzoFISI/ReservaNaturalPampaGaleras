import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Reserva Natural Pampa Galeras Bárbara D'Achille</h1>
          <p className="subtitle">Descubre y protege la biodiversidad del Perú</p>
          <div className="hero-buttons">
            <Link to="/animales" className="btn btn-primary">Explorar Animales</Link>
            <Link to="/especies" className="btn btn-secondary">Ver Especies</Link>
          </div>
        </div>
        <img src="/images/imagen de fondo primera parte.jpeg" alt="Reserva" className="hero-image" />
      </section>

      <section className="features">
        <h2>Secciones principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🦙</div>
            <h3>Animales</h3>
            <p>Conoce los animales registrados en nuestra reserva</p>
            <Link to="/animales" className="link">Ver más →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Especies</h3>
            <p>Información sobre todas las especies en la reserva</p>
            <Link to="/especies" className="link">Ver más →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏞️</div>
            <h3>Reservas</h3>
            <p>Detalles de las áreas protegidas</p>
            <Link to="/reservas" className="link">Ver más →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Actividades</h3>
            <p>Actividades y eventos de la reserva</p>
            <Link to="/actividades" className="link">Ver más →</Link>
          </div>
        </div>
      </section>

      <section className="info">
        <h2>Sobre la Reserva</h2>
        <div className="info-grid">
          <div className="info-card">
            <h4>Ubicación</h4>
            <p>Lucanas, Ayacucho, Perú</p>
          </div>
          <div className="info-card">
            <h4>Superficie</h4>
            <p>6,500 hectáreas</p>
          </div>
          <div className="info-card">
            <h4>Categoría</h4>
            <p>Reserva Nacional</p>
          </div>
          <div className="info-card">
            <h4>Objetivo</h4>
            <p>Conservar la vicuña</p>
          </div>
        </div>
      </section>
    </div>
  )
}
