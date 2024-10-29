import { defineStore } from 'pinia';

interface Tarea {
  id: string;
  nombre: string;
  completada: boolean;
  fecha: string;
}

interface Proyecto {
  id: string;
  nombre: string;
  tareas: Tarea[];
  progreso: number;
}

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: [] as Proyecto[],
  }),
  actions: {
    agregarProyecto(nombre: string) {
      this.proyectos.push({
        id: Date.now().toString(),
        nombre,
        tareas: [],
        progreso: 0,
      });
    },
    agregarTarea(idProyecto: string, tarea: Tarea) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        proyecto.tareas.push(tarea);
        // Actualizar progreso después de agregar
        const totalTareas = proyecto.tareas.length;
        const tareasCompletadas = proyecto.tareas.filter(t => t.completada).length;
        proyecto.progreso = Math.min((tareasCompletadas / totalTareas) * 100, 100);
      }
    },
    
    eliminarProyecto(id: string) {
      this.proyectos = this.proyectos.filter((proyecto) => proyecto.id !== id);
    },
  },
});
