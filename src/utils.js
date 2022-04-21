export const roundMod = (num, multiple) => Math.round(num / multiple) * multiple
export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t
export const inverseLerp = (v0, v1, t) => (t - v0) / (v1 - v0)
export const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5)
//export const rgbToHex = (r, g, b) => parseInt('0x' + ((1 << 24) + ((r) << 16) + ((g) << 8) + (b)).toString(16).slice(1))
export const easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
export const pingPong = (t, l) => l - Math.abs(repeat(t, l * 2) - l)
export const repeat = (t, l) => clamp(t - Math.floor(t / l) * l, 0.0, l)
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
export const easeOutBack = (t, s = 1) => 1 + (2.70158 * s) * Math.pow(clamp(t, 0, 1) - 1, 3) + (1.70158 * s) * Math.pow(clamp(t, 0, 1) - 1, 2)
export const easeOutBackNoClamp = (t, s = 1) => 1 + (2.70158 * s) * Math.pow(t - 1, 3) + (1.70158 * s) * Math.pow(t - 1, 2)
export function getClosestPointOnLineSegment(Ax, Ay, Bx, By, Px, Py) {
  const APx = Px - Ax
  const APy = Py - Ay
  const ABx = Bx - Ax
  const ABy = By - Ay
  const AB2 = ABx * ABx + ABy * ABy
  const APAB = APx * ABx + APy * ABy
  const t = APAB / AB2
  if (t < 0.0) {
    return { x: Ax, y: Ay }
  }
  if (t > 1.0) {
    return { x: Bx, y: By }
  }
  return { x: Ax + ABx * t, y: Ay + ABy * t }
}
export const distanceBetweenPointsLong = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
export const distanceBetweenPoints = (a, b) => distanceBetweenPoints(a.x, a.y, b.x, b.y)
import rgbHex from 'rgb-hex';
export const rgbToHex = (r, g, b) => rgbHex(r, g, b)
// {
//   Vector2 AP = P - A;       //Vector from A to P   
//   Vector2 AB = B - A;       //Vector from A to B  
//
//   float magnitudeAB = AB.LengthSquared();     //Magnitude of AB vector (it's length squared)     
//   float ABAPproduct = Vector2.Dot(AP, AB);    //The DOT product of a_to_p and a_to_b     
//   float distance = ABAPproduct / magnitudeAB; //The normalized "distance" from a to your closest point  
//
//   if (distance < 0)     //Check if P projection is over vectorAB     
//   {
//     return A;
//
//   }
//   else if (distance > 1)             {
//     return B;
//   }
//   else
//   {
//     return A + AB * distance;
//   }
// }