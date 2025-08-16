# Constants Module

This module contains application constants organized by domain.

## Architecture

### portfolio.constants.ts
Contains only fallback values to display during initial data loading.

IMPORTANT: These values are temporary placeholders that are automatically replaced when real data is loaded from JSON files.

#### Principles:
- Don't hardcode real data - Data comes from JSON files
- Only fallback values - To improve UX during loading
- Clearly documented - Each constant explains its purpose

### carousel.constants.ts
Specific configuration for carousel components.

## Recommended Usage

### Correct
```typescript
// In components - initialize with fallback
personalInfo: PersonalInfo = FALLBACK_PERSONAL_INFO;

// Then load real data
this.staticPortfolioService.getPersonalInfo().subscribe(data => {
  this.personalInfo = data.personalInfo;
});
```

### Incorrect
```typescript
// Don't hardcode real data in constants
export const PERSONAL_INFO = {
  nombre: 'Your Real Name', // Hardcoded
  titulo1: 'Your Real Title' // Hardcoded
};
```

## Data Flow

```
JSON Files → StaticPortfolioService → Components
    ↑              ↑                     ↑
Assets/data    HTTP Client        Fallback Constants
                                 (only during loading)
```

### Benefits
1. **Modularity**: Data separated from code
2. **Maintenance**: Changes without recompilation
3. **Performance**: SSR + static data
4. **UX**: Smooth fallbacks during loading
5. **Clean Code**: Separation of concerns 