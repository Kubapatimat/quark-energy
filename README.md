# quark-energy
Explore how the energy of the quarks changes in different models.

## Controls
- Left mouse button: select one quark
- Left mouse button + CTRL/SHIFT: add/remove from selection
- Right mouse button: add new quark (gray)
- Right mouse button + "1": add new quark (red)
- Right mouse button + "2": add new quark (green)
- Right mouse button + "3": add new quark (blue)
- Delete: Remove selected quark

## Energy functions
Available fields:
- `quark.x`: returns the x component of position
- `quark.y`: returns the y component of position
- `quark.angle`: returns the angle between the x-axis and the vector

Available custom functions:
- `radians(degrees)`: converts the angle given in degrees to radians

Example energy functions:
1. Dot product
$$E = \frac{E_0}{|v|^2} \sum_{i,j=1}^n \vec{v_i} \cdot \vec{v_j}$$
If we suppose that $|v_i| = 1$ for every $i$ in $\set{1, \..., n}$ and $E_0 = 1$, we have the following function:

```js
function (quarks) {
  let sum = 0;
  for (const q1 of quarks) {
    for (const q2 of quarks) {
      sum += Math.cos(
        radians(q1.angle - q2.angle)
      )
    }
  }
  return sum;
};
```

2. Dot product + Coulomb-like potential
$$E = \frac{E_0}{|v|^2} \sum_{i,j=1}^n \frac{\vec{v_i} \cdot \vec{v_j}}{a + d(\vec{v_i}, \vec{v_j})}$$
$d(v_1, v_2)$ is a distance function and $a$ is a positive constant so there is no division by zero.
If we make the same assumptions as above, choose $a = 1$ and $d(v_1, v_2)$ as the euclidean distance metric, we have:
```js
function (quarks) {
  let sum = 0;
  for (const q1 of quarks) {
    for (const q2 of quarks) {
      sum += Math.cos(
        radians(q1.angle - q2.angle)
      ) / (1 + Math.hypot(q1.x - q2.x, q1.y - q2.y));
    }
  }
  return sum;
};
```
