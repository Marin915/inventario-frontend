import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar/navbar.component";

interface MaterialEntrada {
  nombre: string;
  cantidad: number;
  unidad: string;
}

interface Renta {
  id: number;
  nombre: string;
  ubicacion: string;
  progreso: number;
  materiales: MaterialEntrada[];
}

@Component({
  selector: 'app-renta',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './renta.component.html',
  styleUrl: './renta.component.css'
})
export class RentaComponent {

  constructor(private router: Router) {}

  rentas: Renta[] = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    nombre: `Renta ${String(i + 1).padStart(2, '0')}`,
    ubicacion: 'Colonia pendiente',
    progreso: Math.floor(Math.random() * 100),
    materiales: []
  }));

  filtro: string = '';
  materialesFiltrados: MaterialEntrada[] = [];
  rentaSeleccionada: Renta | null = null;
  mostrarFormulario = false;

  nuevaEntrada: MaterialEntrada = {
    nombre: '',
    cantidad: 0,
    unidad: ''
  };

  verMateriales(renta: Renta) {
    this.rentaSeleccionada = renta;
    this.materialesFiltrados = renta.materiales;
    this.filtro = '';
  }

  agregarEntrada() {
    if (!this.nuevaEntrada.nombre || this.nuevaEntrada.cantidad <= 0) return;

    this.rentaSeleccionada?.materiales.push({ ...this.nuevaEntrada });
    this.materialesFiltrados = [...this.rentaSeleccionada!.materiales];

    this.nuevaEntrada = { nombre: '', cantidad: 0, unidad: '' };
    this.mostrarFormulario = false;
  }

  cerrarDetalle() {
    this.rentaSeleccionada = null;
    this.mostrarFormulario = false;
  }

  buscarMateriales(texto: string) {
    if (!this.rentaSeleccionada) return;

    if (!texto) {
      this.materialesFiltrados = [...this.rentaSeleccionada.materiales];
      return;
    }

    const filtro = texto.toLowerCase();
    this.materialesFiltrados = this.rentaSeleccionada.materiales.filter(m =>
      m.nombre.toLowerCase().includes(filtro)
    );
  }

  trackById(index: number, renta: Renta) {
    return renta.id;
  }
}
