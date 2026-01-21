import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar/navbar.component';
import { MaterialesService } from '../../services/materiales.service';
import { ActivatedRoute } from '@angular/router';


// ⬇Si ya tienes ApiService, descomenta
// import { ApiService } from '../../services/api.service';

export interface MaterialCasaDTO {
  id: number;
  materialId: number;
  clave?: string;
  nombre: string;
  unidad: string;
  requerido: number;
  usado: number;
  fechaEntrega?: string;
}

export interface MaterialResumen {
  [x: string]: any;
  id: number;
  clave: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;     
  entradas: number;
  salidas: number;
  precioUnitario: number;
  categoria: string;
}

export interface CasaDTO {
 id: number;
  nombre: string;
  lote: string;       // número o código de lote
  ubicacion?: string; // opcional, dirección completa o zona
  progreso: number;
  modelo: {
    id: number;
    nombre: string;
  };
}

export interface SalidaCasaDTO {
  casaId: number;
  materialId: number;
  cantidad: number;
}


export interface MaterialEntrega {
  id: number;
  clave: string;
  descripcion: string;
  unidad: string;
  cantidadPresupuestada: number;
  cantidadEntregada: number;
  salidasPorEntregar: number;
  fechaEntrega: string;
}

export interface CrearCasaDTO {
  nombre: string;
  lote: string;
  modelo: {
    id: number;
  };
}



@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ],
  templateUrl: './lotes.component.html',
  styleUrl: './lotes.component.css'
})

export class LotesComponent implements OnInit {

  [x: string]: any;
  
  
mostrarModalMaterial = false;

  materialesEntrega: MaterialEntrega[] = [];
  casas: CasaDTO[] = [];
  casaSeleccionada: CasaDTO | null = null;
  materialesFiltrados: MaterialCasaDTO[] = [];

  filtro = '';
  mostrarFormulario = false;
  cargando = false;
  error?: string;

 nuevoMaterial: Partial<MaterialCasaDTO> & { id?: number } = {
  id: undefined,
  clave: '',
  nombre: '',
  unidad: '',
  requerido: 0,
  fechaEntrega: ''
};

// Variables en tu componente
mostrarModalSalida: boolean = false;
materialParaSalida: MaterialCasaDTO | null = null;
cantidadSalida: number | null = null;

// Variables para el modal de devolución
mostrarModalDevolucion: boolean = false;
cantidadDevolucion: number | null = null;
materialParaDevolver: MaterialCasaDTO | null = null;

filtroMaterial: string = '';

// Nuevas para registrarSalida
materialSeleccionadoParaSalida: MaterialCasaDTO | null = null;

// Texto dinámico para el modal (para diferenciar devolución o salida)
modalTitulo: string = '';
modalMaxCantidadTexto: string = '';
modalConfirmButtonText: string = '';
modalConfirmAction: (() => void) | null = null;  // función que se ejecuta al confirmar

  mensajeModal: string = '';
mostrarModalMensaje: boolean = false;

mostrarModalCantidad: boolean = false;
cantidadDevuelta: number | null = null;
materialSeleccionadoParaDevolver: MaterialCasaDTO | null = null;
sobranteParaDevolver: number = 0;



  mostrarFormularioCasa = false;

  nombreCasa: string = '';
  loteCasa: string = '';
  modeloSeleccionadoId: number | null = null;

  nuevaCasa: Partial<CasaDTO> = {
    nombre: '',
    ubicacion: ''
  };

  modeloId!: number;
titulo: string = '';

  materialesInventario: MaterialResumen[] = [];
  materialSeleccionado: MaterialResumen | null = null;

  modalInventarioAbierto = false;


  constructor(private materialesService: MaterialesService,   private route: ActivatedRoute) {}

  ngOnInit(): void {
   this.route.data.subscribe(data => {
    this.modeloId = data['modeloId'];
    this.titulo = data['titulo'];
    this.cargarCasas();   //  ahora sí ya existe modeloId
    
  });


  this.cargarModelos();
  this.cargarInventarioGeneral(); // carga inicial de inventario general

  }

  
abrirModalInventario() {
  this.modalInventarioAbierto = true;
}

cerrarModalInventario() {
  this.modalInventarioAbierto = false;
}

seleccionarDesdeModal(material: any) {
  this.materialSeleccionado = material;
  this.modalInventarioAbierto = false;

  // si necesitas ejecutar lógica extra
  this.seleccionarMaterial(material);
}
  /* ===== CASAS ===== */
  cargarEntregas() {
    this.cargando = true;
    this.materialesService.obtenerEntregas().subscribe({
      next: data => {
        this.materialesEntrega = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar entregas';
        this.cargando = false;
      }
    });
  }

cargarCasas() {
  this.cargando = true;

  this.materialesService
    .obtenerCasasPorModelo(this.modeloId)
    .subscribe({
      next: data => {
        this.casas = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
}



  /* ===== MATERIALES ===== */

verMateriales(casa: CasaDTO) {
  this.casaSeleccionada = casa;
  this.cargando = true;

  this.materialesService.obtenerMaterialesPorCasa(casa.id).subscribe({
    next: (data: any[]) => {
      console.log('Materiales recibidos del backend:', data);

      // 🔧 MAPEO CORRECTO BACKEND → FRONTEND
      this.materialesFiltrados = data.map(m => ({
        id: m.id,
        materialId: m.materialId ?? m.material?.id,
        clave: m.clave ?? m.material?.clave,
        nombre: m.nombre ?? m.material?.nombre,
        unidad: m.unidad ?? m.material?.unidad,
        requerido: m.requerido ?? 0,
        usado: m.usado ?? 0,
        fechaEntrega: m.fechaEntrega
      }));

      console.log('Materiales mapeados para la vista:', this.materialesFiltrados);

      this.filtro = '';
      this.mostrarFormulario = false;
      this.cargando = false;
    },
    error: err => {
      console.error('Error cargando materiales:', err);
      this.materialesFiltrados = [];
      this.error = 'Error al cargar materiales';
      this.cargando = false;
      this.cargarEntregas();
    }
  });
}


  cerrarDetalle() {
    this.casaSeleccionada = null;
    this.materialesFiltrados = [];
    this.mostrarFormulario = false;
    this.filtro = '';
  }

  
  buscarMateriales(texto: string) {
    if (!texto) {
      // Si no hay texto, mostrar todos los materiales (reseteo)
      if (this.casaSeleccionada) {
        this.verMateriales(this.casaSeleccionada);
      }
      return;
    }

    const f = texto.toLowerCase();
    this.materialesFiltrados = this.materialesFiltrados.filter(m =>
      m.nombre.toLowerCase().includes(f) ||
      m.unidad.toLowerCase().includes(f)
    );
  }

  /* ===== CÁLCULOS ===== */

  getPorEntregar(m: MaterialCasaDTO): number {
    return (m.requerido ?? 0) - (m.usado ?? 0);
  }

  /* ===== ALTA MATERIAL ===== */

  agregarMaterial() {
    if (!this.casaSeleccionada) return;

    if (!this.nuevoMaterial.id || (this.nuevoMaterial.requerido ?? 0) <= 0) {
      alert('Completa los campos obligatorios');
      return;
    }

    const request = {
      casaId: this.casaSeleccionada.id,
      materialId: this.nuevoMaterial.id,
      requerido: this.nuevoMaterial.requerido!,
      fechaEntrega: this.nuevoMaterial.fechaEntrega
    };

    this.materialesService.asignarMaterial(request).subscribe({
      next: () => {
        this.verMateriales(this.casaSeleccionada!);
        this.resetFormulario();
      },
      error: err => {
        console.error(err);
        alert('Error al asignar material');
      }
    });
  }

  resetFormulario() {
    this.nuevoMaterial = {
      nombre: '',
      unidad: '',
      requerido: 0,
      usado: 0,
      fechaEntrega: ''
    };
    this.mostrarFormulario = false;
  }

  trackByCasa(index: number, casa: CasaDTO) {
    return casa.id;
  }

registrarSalida(material: MaterialCasaDTO) {
  if (!this.casaSeleccionada?.id) {
    this.mensajeModal = 'Selecciona una casa válida';
    this.mostrarModalMensaje = true;
    return;
  }

  this.materialParaSalida = material;
  this.cantidadSalida = null;
  this.mensajeModal = '';
  this.mostrarModalSalida = true;
}




crearCasa() {
  console.log('Creando casa con modeloId:', this.modeloId, 'nombre:', this.nombreCasa, 'lote:', this.loteCasa);
  const payload: CrearCasaDTO = {
    nombre: this.nombreCasa.trim(),
    lote: this.loteCasa.trim(),
    modelo: {
      id: this.modeloId
    }
  };

  this.materialesService.crearCasa(payload).subscribe({
    next: () => {
      this.mostrarMensaje(`${this.titulo} creada con éxito`);
      this.mostrarFormularioCasa = false;
      this.cargarCasas();
    },
    error: err => {
      console.error('Error crear casa:', err);
      this.mostrarMensaje('Error al crear');
    }
  });
}



// Método para mostrar mensaje en modal y autoocultarlo
mostrarMensaje(texto: string) {
  this.mensajeModal = texto;
  this.mostrarModalMensaje = true;

  // Oculta el modal después de 3 segundos (ajustable)
  setTimeout(() => {
    this.mostrarModalMensaje = false;
  }, 3000);
}

  cancelarCasa() {
    this.nombreCasa = '';
    this.loteCasa = '';
    this.modeloSeleccionadoId = null;
    this.mostrarFormularioCasa = false;
  }

  cargarModelos() {
  this.materialesService.obtenerModelos().subscribe({
    next: data => {
      this['modelos'] = data;
    },
    error: err => {
      console.error('Error cargando modelos', err);
      alert('No se pudo cargar modelos. Verifica el endpoint en backend.');
      // Opcional: cargar modelos por defecto o dejar el select vacío
      this['modelos'] = [];
    }
  });
}

// Método para abrir el modal con el material seleccionado
abrirModalSalida(material: MaterialCasaDTO) {
  this.materialParaSalida = material;
  this.cantidadSalida = null; // reiniciar cantidad
  this.mostrarModalSalida = true;
}

// Método para confirmar la salida y llamar al servicio
confirmarSalida() {
  if (!this.materialParaSalida) {
    this.mensajeModal = 'No se seleccionó material';
    this.mostrarModalMensaje = true;
    return;
  }

  if (!this.cantidadSalida || this.cantidadSalida <= 0) {
    this.mensajeModal = 'Ingresa una cantidad válida';
    this.mostrarModalMensaje = true;
    return;
  }

  const porEntregar = this.getPorEntregar(this.materialParaSalida);
  if (this.cantidadSalida > porEntregar) {
    this.mensajeModal = `No puedes registrar una salida mayor a la cantidad por entregar (${porEntregar}).`;
    this.mostrarModalMensaje = true;
    return;
  }

  const request: SalidaCasaDTO = {
    casaId: this.casaSeleccionada!.id,
    materialId: this.materialParaSalida.materialId ?? this.materialParaSalida.id,
    cantidad: this.cantidadSalida
  };

  this.materialesService.registrarSalidaCasa(request).subscribe({
    next: () => {
      this.mostrarModalSalida = false;
      this.mensajeModal = '';
      this.verMateriales(this.casaSeleccionada!);
      this.materialesService.emitirActualizacionInventario();
    },
    error: (err) => {
      this.mensajeModal = err.error?.message || 'Error al registrar salida';
      this.mostrarModalMensaje = true;
    }
  });
}


// Método para cancelar la operación y cerrar el modal
cancelarSalida() {
  this.mostrarModalSalida = false;
  this.materialParaSalida = null;
  this.cantidadSalida = null;
}

asignarMaterial() {
  if (!this.casaSeleccionada?.id || !this.nuevoMaterial.id || !this.nuevoMaterial.requerido) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  const request = {
    casaId: this.casaSeleccionada.id,
    materialId: this.nuevoMaterial.id,
    requerido: this.nuevoMaterial.requerido,
    fechaEntrega: this.nuevoMaterial.fechaEntrega
  };

  this.materialesService.asignarMaterial(request).subscribe({
    next: () => {
      this.materialesService.registrarMovimiento(
        this.nuevoMaterial.id!,
        {
          tipo: 'SALIDA',
          cantidad: this.nuevoMaterial.requerido!,
          materialId: 0
        }
      ).subscribe({
        next: () => {
          this.verMateriales(this.casaSeleccionada!);
          this.materialesService.emitirActualizacionInventario();
          this.resetFormulario();
          alert('Material asignado y descontado del inventario correctamente');
        },
        error: err => {
          console.error('Error al registrar salida en inventario:', err);
          alert('Error al descontar del inventario general');
        }
      });
    },
    error: err => {
      console.error('Error asignando material:', err);
      alert(err.error?.message || 'Error al asignar material');
    }
  });
}

abrirFormularioMaterial() {
  this.mostrarFormulario = true;
  this.materialesService.listarResumen().subscribe(data => {
    this.materialesInventario = data;
      this.mostrarModalMaterial = true;

  });
}

seleccionarMaterial(material: MaterialResumen) {
  this.materialSeleccionado = material;

  this.nuevoMaterial = {
    id: material.id,
    clave: material.clave,
    nombre: material.descripcion,
    unidad: material.unidadMedida,
    requerido: 0
  };
}

// Método para iniciar la devolución y mostrar modal input
devolverMaterial(material: MaterialCasaDTO) {
  this.materialSeleccionadoParaDevolver = material;
  this.sobranteParaDevolver = this.getPorEntregar(material);
  this.cantidadDevuelta = null;
  this.mensajeModal = '';
  this.mostrarModalCantidad = true; // mostramos el modal input
}

confirmarCantidadDevolucion() {
  if (
    this.cantidadDevuelta === null ||
    isNaN(this.cantidadDevuelta) ||
    this.cantidadDevuelta <= 0 ||
    this.cantidadDevuelta > this.sobranteParaDevolver
  ) {
    this.mensajeModal = `Cantidad inválida. Debe ser mayor a 0 y menor o igual a ${this.sobranteParaDevolver}`;
    this.mostrarModalMensaje = true;
    return;
  }

  const request = {
    casaId: this.casaSeleccionada!.id,
    materialId: this.materialSeleccionadoParaDevolver!.materialId ?? this.materialSeleccionadoParaDevolver!.id,
    cantidad: this.cantidadDevuelta
  };

  this.materialesService.devolverMaterialCasa(request).subscribe({
    next: () => {
      this.verMateriales(this.casaSeleccionada!);

      // Actualiza localmente para UI inmediata (opcional)
      if (this.materialSeleccionadoParaDevolver) {
        const materialInventario = this.materialesInventario.find(m => m.id === (this.materialSeleccionadoParaDevolver!.materialId ?? this.materialSeleccionadoParaDevolver!.id));
        if (materialInventario) {
          materialInventario.cantidad += this.cantidadDevuelta!;
          this.materialesInventario = [...this.materialesInventario]; // forzar refresco Angular
        }
      }

      // RECARGA el inventario general para mantener sincronía real con backend
      this.cargarInventarioGeneral();

      this.materialesService.emitirActualizacionInventario();
      this.mensajeModal = 'Material devuelto al inventario correctamente';
      this.mostrarModalMensaje = true;
      this.mostrarModalCantidad = false; // Cerramos modal input
    },
    error: err => {
      console.error(err);
      this.mensajeModal = err.error?.message || 'Error al devolver material';
      this.mostrarModalMensaje = true;
      this.mostrarModalCantidad = false;
    }
  });
}



cargarInventarioGeneral() {
  this.materialesService.listarResumen().subscribe({
    next: (data) => {
      this.materialesInventario = data;
    },
    error: (err) => {
      console.error('Error al cargar inventario general', err);
    }
  });
}


// Método para cerrar el modal de mensajes
cerrarModalMensaje() {
  this.mostrarModalMensaje = false;
  this.mensajeModal = '';
}

// Método para cerrar modal input (cancelar)
cerrarModalCantidad() {
  this.mostrarModalCantidad = false;
  this.materialSeleccionadoParaDevolver = null;
  this.cantidadDevuelta = null;
  this.mensajeModal = '';
}
cerrarModalMaterial() {
  this.mostrarModalMaterial = false;
  this.resetFormulario(); // opcional
    this.mostrarModalMaterial = false;

}

guardarMaterial() {
  this.agregarMaterial(); // tu lógica actual
  this.cerrarModalMaterial();
}

abrirModalMaterial() {
  this.nuevoMaterial = {
  requerido: undefined,
  fechaEntrega: undefined,
  nombre: '',
  unidad: ''
};
  this.materialSeleccionado = null;
  this.mostrarModalMaterial = true;
}


}
