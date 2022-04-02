export function computeControlPoints(coordinates: number[]): {
    p1: number[];
    p2: number[];
  } {
    if (coordinates.length === 2) {
      return {
        p1: [coordinates[0]],
        p2: [coordinates[1]],
      };
    }

    const p1 = [];
    const p2 = [];
    const numberOfCoordinates = coordinates.length - 1;

    const a = [];
    const b = [];
    const c = [];
    const r = [];

    /*left most segment*/
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = coordinates[0] + 2 * coordinates[1];

    /*internal segments*/
    for (let i = 1; i < numberOfCoordinates - 1; i++) {
      a[i] = 1;
      b[i] = 4;
      c[i] = 1;
      r[i] = 4 * coordinates[i] + 2 * coordinates[i + 1];
    }

    /*right segment*/
    a[numberOfCoordinates - 1] = 2;
    b[numberOfCoordinates - 1] = 7;
    c[numberOfCoordinates - 1] = 0;
    r[numberOfCoordinates - 1] =
      8 * coordinates[numberOfCoordinates - 1] +
      coordinates[numberOfCoordinates];

    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (let i = 1; i < numberOfCoordinates; i++) {
      const m: number = a[i] / b[i - 1];
      b[i] = b[i] - m * c[i - 1];
      r[i] = r[i] - m * r[i - 1];
    }

    p1[numberOfCoordinates - 1] =
      r[numberOfCoordinates - 1] / b[numberOfCoordinates - 1];
    for (let i = numberOfCoordinates - 2; i >= 0; --i) {
      p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
    }

    /*we have p1, now compute p2*/
    for (let i = 0; i < numberOfCoordinates - 1; i++) {
      p2[i] = 2 * coordinates[i + 1] - p1[i + 1];
    }

    p2[numberOfCoordinates - 1] =
      0.5 * (coordinates[numberOfCoordinates] + p1[numberOfCoordinates - 1]);

    return { p1, p2 };
  }