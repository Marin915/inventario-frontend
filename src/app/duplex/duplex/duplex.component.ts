import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar/navbar.component';

interface MaterialEntrada {
  nombre: string;
  cantidad: number;
  unidad: string;
}

interface Duplex {
  id: number;
  nombre: string;
  ubicacion: string;
  progreso: number;
  materiales: MaterialEntrada[];
}



@Component({
  selector: 'app-duplex',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './duplex.component.html',
  styleUrl: './duplex.component.css'
})
export class DuplexComponent {

  constructor(private router: Router) {}

  duplex: Duplex[] = Array.from({ length: 68 }, (_, i) => ({
    id: i + 1,
    nombre: `Dúplex ${String(i + 1).padStart(2, '0')}`,
    ubicacion: 'Colonia pendiente',
    progreso: Math.floor(Math.random() * 100),
    materiales: []
  }));

  filtro: string = '';
  materialesFiltrados: MaterialEntrada[] = [];
  duplexSeleccionado: Duplex | null = null;
  mostrarFormulario = false;

  nuevaEntrada: MaterialEntrada = {
    nombre: '',
    cantidad: 0,
    unidad: ''
  };

  verMateriales(duplex: Duplex) {
    this.duplexSeleccionado = duplex;
    this.materialesFiltrados = duplex.materiales;
    this.filtro = '';
  }

  agregarEntrada() {
    if (!this.nuevaEntrada.nombre || this.nuevaEntrada.cantidad <= 0) return;

    this.duplexSeleccionado?.materiales.push({ ...this.nuevaEntrada });
    this.materialesFiltrados = [...this.duplexSeleccionado!.materiales];

    this.nuevaEntrada = { nombre: '', cantidad: 0, unidad: '' };
    this.mostrarFormulario = false;
  }

  cerrarDetalle() {
    this.duplexSeleccionado = null;
    this.mostrarFormulario = false;
  }

  buscarMateriales(texto: string) {
    if (!this.duplexSeleccionado) return;

    if (!texto) {
      this.materialesFiltrados = [...this.duplexSeleccionado.materiales];
      return;
    }

    const filtro = texto.toLowerCase();
    this.materialesFiltrados = this.duplexSeleccionado.materiales.filter(m =>
      m.nombre.toLowerCase().includes(filtro)
    );
  }

  trackById(index: number, duplex: Duplex) {
    return duplex.id;
  }
}
