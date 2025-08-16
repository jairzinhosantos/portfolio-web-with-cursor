# Constants Module

Este módulo contiene las constantes de la aplicación organizadas por dominio.

## Arquitectura

### portfolio.constants.ts
Contiene únicamente valores de fallback para mostrar durante la carga inicial de datos.

IMPORTANTE: Estos valores son placeholders temporales que se reemplazan automáticamente cuando se cargan los datos reales desde archivos JSON.

#### Principios:
- No hardcodear datos reales - Los datos vienen de archivos JSON
- Solo valores de fallback - Para mejorar UX durante la carga
- Claramente documentado - Cada constante explica su propósito

### carousel.constants.ts
Configuración específica para componentes de carrusel.

## Uso Recomendado

### Correcto
```typescript
// En componentes - inicializar con fallback
personalInfo: PersonalInfo = FALLBACK_PERSONAL_INFO;

// Luego cargar datos reales
this.staticPortfolioService.getPersonalInfo().subscribe(data => {
  this.personalInfo = data.personalInfo;
});
```

### Incorrecto
```typescript
// No hardcodear datos reales en constantes
export const PERSONAL_INFO = {
  nombre: 'Tu Nombre Real', // Hardcoded
  titulo1: 'Tu Título Real' // Hardcoded
};
```

## Flujo de Datos

```
JSON Files → StaticPortfolioService → Components
    ↑              ↑                     ↑
Assets/data    HTTP Client        Fallback Constants
                                 (solo durante carga)
```

### Beneficios
1. **Modularidad**: Datos separados del código
2. **Mantenimiento**: Cambios sin recompilación
3. **Performance**: SSR + datos estáticos
4. **UX**: Fallbacks suaves durante carga
5. **Clean Code**: Separación de responsabilidades 