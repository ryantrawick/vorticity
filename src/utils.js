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
export const radiantToDegree = (rad) => rad * 180 / Math.PI
export const whichQuadrant = (x, y) => {
  if (x >= 0 && y >= 0) return 1
  if (x < 0 && y >= 0) return 2
  if (x < 0 && y < 0) return 3
  if (x >= 0 && y < 0) return 4
}
export const getAngle = (x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  return angle < 0 ? angle + 360 : angle
}
export const getDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}
export const getDistance2 = (x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}
export const getSideOfLine = (Ax, Ay, Bx, By, Cx, Cy) => (Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax)
export const getNormalOfLine = (Ax, Ay, Bx, By) => {
  const dx = Bx - Ax
  const dy = By - Ay
  const length = Math.sqrt(dx * dx + dy * dy)
  return {
    x: -dy / length,
    y: dx / length
  }
}
export const getNormalOfLineToPoint = (Ax, Ay, Bx, By, Cx, Cy) => {
  const dx = Bx - Ax
  const dy = By - Ay
  const length = Math.sqrt(dx * dx + dy * dy)
  const nx = -dy / length
  const ny = dx / length
  const dp = (Cx - Ax) * nx + (Cy - Ay) * ny
  return {
    x: nx * dp,
    y: ny * dp
  }
}
export const getParallelLine = (Ax, Ay, Bx, By, distance) => {
  const normal = getNormalOfLine(Ax, Ay, Bx, By)
  return {
    x: Ax + normal.x * distance,
    y: Ay + normal.y * distance
  }
}
export const getPerpendicularLine = (Ax, Ay, Bx, By, distance) => {
  const normal = getNormalOfLine(Ax, Ay, Bx, By)
  return {
    x: Ax - normal.y * distance,
    y: Ay + normal.x * distance
  }
}
export const getPerpendicularDirection = (Ax, Ay, Bx, By, distance) => {
  const normal = getNormalOfLine(Ax, Ay, Bx, By)
  return {
    x: normal.y * distance,
    y: -normal.x * distance
  }
}
export const rotateLine90Degrees = (Ax, Ay, Bx, By) => {
  const dx = Bx - Ax
  const dy = By - Ay
  return {
    x: -dy,
    y: dx
  }
}
export const getParallelDirectionOfLineFromPoint = (Ax, Ay, Bx, By, Cx, Cy) => {
  const normal = getNormalOfLine(Ax, Ay, Bx, By)
  const dx = Cx - Ax
  const dy = Cy - Ay
  return {
    x: normal.x * dx + normal.y * dy,
    y: normal.y * dx - normal.x * dy
  }
}

export function getClosestPointOnLineSegment (Ax, Ay, Bx, By, Px, Py) {
  const APx = Px - Ax
  const APy = Py - Ay
  const ABx = Bx - Ax
  const ABy = By - Ay
  const AB2 = ABx * ABx + ABy * ABy
  const APAB = APx * ABx + APy * ABy
  const t = APAB / AB2
  if (t < 0) {
    return { x: Ax, y: Ay }
  }
  if (t > 1) {
    return { x: Bx, y: By }
  }
  return { x: Ax + ABx * t, y: Ay + ABy * t }
}

export const distanceBetweenPointsLong = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
export const distanceBetweenPoints = (a, b) => distanceBetweenPoints(a.x, a.y, b.x, b.y)
export const getClosestPointOnLineSegmentLong = (Ax, Ay, Bx, By, Px, Py) => {
  const APx = Px - Ax
  const APy = Py - Ay
  const ABx = Bx - Ax
  const ABy = By - Ay
  const AB2 = ABx * ABx + ABy * ABy
  const APAB = APx * ABx + APy * ABy
  const t = APAB / AB2
  if (t <= 0) {
    return {
      x: Ax,
      y: Ay
    }
  }
  if (t >= 1) {
    return {
      x: Bx,
      y: By
    }
  }
  return {
    x: Ax + ABx * t,
    y: Ay + ABy * t
  }
}
import rgbHex from 'rgb-hex'

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