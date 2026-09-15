# LU Studio

Calculadora educativa de sistemas de ecuaciones lineales mediante factorización LU por Doolittle.

## Uso

Descarga el repositorio y abre `index.html` en tu navegador. No requiere instalación ni dependencias.

## Funciones

- Editor de matrices de hasta 30 variables.
- Factores L y U, sustitución hacia adelante y hacia atrás.
- Ejercicio de microservicios resuelto automáticamente para dos vectores independientes.
- Comprobación Ax = b y procedimiento por iteraciones.
- Navegación lateral y diseño adaptable a móviles.

## Método

La implementación utiliza Doolittle sin pivoteo. Se detiene si un pivote tiene magnitud menor que 10⁻¹². Los resultados se muestran con hasta seis decimales.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño visual.
- `script.js`: cálculos, validaciones e interacción.
