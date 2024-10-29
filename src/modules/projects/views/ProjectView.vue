<template>
  <div class="p-8 overflow-x-auto w-full">
    <h2>Nombre Proyecto: {{ proyectoActual?.nombre }}</h2>

    <div class="mt-4">
      <input 
        v-model="nuevaTarea" 
        type="text" 
        placeholder="Agregar nueva tarea" 
        class="input input-bordered mr-2" 
      />
      <button @click="agregarTarea" class="btn btn-primary">Agregar</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Completada</th>
          <th>Tarea</th>
          <th>Fecha y hora de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarea, index) in proyectoActual?.tareas" :key="tarea.id">
          <td>{{ index + 1 }}</td>
          <td>
            <input
              type="checkbox"
              v-model="tarea.completada"
              @change="actualizarProgreso"
            />
          </td>
          <td>{{ tarea.nombre }}</td>
          <td>{{ tarea.fecha }}</td>
          <td>
            <button @click="prepararActualizacion(tarea)" class="btn btn-warning btn-sm">Actualizar</button>
            <button @click="eliminarTarea(tarea.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="tareaParaActualizar" class="mt-4">
      <h3>Actualizar Tarea</h3>
      <input 
        v-model="tareaParaActualizar.nombre" 
        type="text" 
        placeholder="Nombre de la tarea" 
        class="input input-bordered mr-2" 
      />
      <button @click="actualizarTarea" class="btn btn-success">Guardar Cambios</button>
      <button @click="cancelarActualizacion" class="btn btn-secondary">Cancelar</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProyectosStore } from '../store/projects.store';

const proyectosStore = useProyectosStore();
const route = useRoute();
const nuevaTarea = ref('');
const tareaParaActualizar = ref(null); // Referencia para la tarea que se va a actualizar

const proyectoActual = computed(() =>
  proyectosStore.proyectos.find((proyecto) => proyecto.id === route.params.id)
);

const agregarTarea = () => {
  const proyecto = proyectoActual.value;
  if (nuevaTarea.value.trim() !== '') {
    // Verificar si hay menos de 10 tareas antes de agregar
    if (proyecto?.tareas.length < 10) {
      const fechaActual = new Date().toLocaleString(); // Obtener fecha y hora actuales
      proyecto.tareas.push({
        id: Date.now().toString(),
        nombre: nuevaTarea.value,
        completada: false,
        fecha: fechaActual,
      });
      nuevaTarea.value = ''; // Limpiar el campo de entrada
      actualizarProgreso(); // Actualizar progreso después de agregar
    } else {
      alert('No se pueden agregar más de 10 tareas a este proyecto.'); // Mensaje de advertencia
    }
  }
};

const actualizarProgreso = () => {
  const proyecto = proyectoActual.value;
  if (proyecto) {
    const totalTareas = proyecto.tareas.length;
    const tareasCompletadas = proyecto.tareas.filter(t => t.completada).length;
    // Calcular progreso basado en tareas completadas
    proyecto.progreso = Math.min((tareasCompletadas / totalTareas) * 100, 100);
  }
};


// Preparar la actualización de la tarea
const prepararActualizacion = (tarea) => {
  tareaParaActualizar.value = { ...tarea }; // Clonar la tarea
};

// Actualizar la tarea
const actualizarTarea = () => {
  const proyecto = proyectoActual.value;
  if (proyecto && tareaParaActualizar.value) {
    const index = proyecto.tareas.findIndex(t => t.id === tareaParaActualizar.value.id);
    if (index !== -1) {
      proyecto.tareas[index].nombre = tareaParaActualizar.value.nombre; // Actualizar nombre
      tareaParaActualizar.value = null; // Limpiar la referencia de actualización
      actualizarProgreso(); // Actualizar progreso después de cambiar la tarea
    }
  }
};

// Cancelar la actualización
const cancelarActualizacion = () => {
  tareaParaActualizar.value = null; // Limpiar la referencia de actualización
};

// Eliminar una tarea
const eliminarTarea = (id) => {
  const proyecto = proyectoActual.value;
  if (proyecto) {
    proyecto.tareas = proyecto.tareas.filter(t => t.id !== id); // Eliminar tarea por ID
    actualizarProgreso(); // Actualizar progreso después de eliminar
  }
};
</script>
