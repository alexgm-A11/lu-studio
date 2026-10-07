# LU Studio

Calculadora educativa de sistemas de ecuaciones lineales mediante factorización LU por Doolittle e interpolación polinomial de Newton.

## Uso

Descarga el repositorio y abre `index.html` en tu navegador. No requiere instalación ni dependencias.

## Funciones

- Editor de matrices de hasta 30 variables.
- Factores L y U, sustitución hacia adelante y hacia atrás.
- Ejercicio de microservicios resuelto automáticamente para dos vectores independientes.
- Comprobación Ax = b y procedimiento por iteraciones.
- Navegación lateral y diseño adaptable a móviles.
- Interpolación de Newton con vectores X e Y editables, tabla completa de diferencias divididas y construcción paso a paso.
- Evaluación anidada, forma estándar del polinomio y verificación en los nodos experimentales.
- Gráfica de latencia y comparación interactiva de grados.
- Caso de la sesión 9: X = [1, 2, 4, 7], Y = [45, 65, 110, 220]. Para 500 req/s (x = 5), P₃(5) = 139 ms.

## Interpolación de Newton

Abre la sección **Interpolación Newton**. Las cargas X se expresan en centenas de req/s y las latencias Y en ms. El polinomio completo del caso es P₃(x) = (1/3)x³ − (3/2)x² + (133/6)x + 24. Al seleccionar un grado menor se utilizan los primeros nodos en el orden ingresado. La aplicación valida nodos distintos, vectores del mismo tamaño y valores finitos.

## Método

La implementación utiliza Doolittle sin pivoteo. Se detiene si un pivote tiene magnitud menor que 10⁻¹². Los resultados se muestran con hasta seis decimales.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño visual.
- `script.js`: cálculos, validaciones e interacción.
- `newton.js`: diferencias divididas, evaluación eficiente, polinomio, gráfica y validación de Newton.
