import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database, object, ref, onValue, Unsubscribe, set } from '@angular/fire/database';

// Definir interfaz para la habitación
interface Habitacion {
  nombre: string;
  luminaria: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // Definir array de habitaciones con la interfaz Habitacion
  habitaciones: Habitacion[] = [
    { nombre: 'Atico', luminaria: false },
    { nombre: 'Banio', luminaria: false },
    { nombre: 'Cocina', luminaria: false },
    { nombre: 'Dormitorio', luminaria: false },
    { nombre: 'Garaje', luminaria: false },
    { nombre: 'Sala', luminaria: false }
  ];

  // Suscripción para detectar cambios en Firebase
  firebaseSubscription!: Unsubscribe;

  constructor(private database: Database) {}

  ngOnInit() {
    const route = ref(this.database, "/casa");
    this.firebaseSubscription = onValue(route, snapshot => {
      const valores_db = snapshot.val();
      this.actualizarEstado(valores_db);
    });
  }

  ngOnDestroy() {
    // Asegurarse de cancelar la suscripción cuando el componente se destruye para evitar memory leaks
    if (this.firebaseSubscription) {
      this.firebaseSubscription();
    }
  }

  actualizarEstado(valores: any) {
    for (let habitacion in valores) {
      const index = this.habitaciones.findIndex(hab => hab.nombre.toLowerCase() === habitacion.toLowerCase());
      if (index !== -1) {
        this.habitaciones[index].luminaria = valores[habitacion];
      }
    }
  }
}