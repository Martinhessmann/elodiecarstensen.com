export const getAssetUrl = (path) => `${process.env.PUBLIC_URL}/assets/images/${path}`;

export const images = {
  splash: getAssetUrl('splash.jpg'),
  logo: getAssetUrl('logo.svg'), // Assuming you have a logo image
  projects: {
    absenceOfPromisedSafety: {
      faunus: getAssetUrl('absence-of-promised-safety/01_FAUNUS.jpg'),
      gina: getAssetUrl('absence-of-promised-safety/02_GINA.jpg'),
      eden: getAssetUrl('absence-of-promised-safety/03_EDEN.jpg'),
      mitra: getAssetUrl('absence-of-promised-safety/04_MITRA.jpg'),
      grana: getAssetUrl('absence-of-promised-safety/05_GRANA.jpg'),
      neo: getAssetUrl('absence-of-promised-safety/06_NEO.jpg'),
      limax: getAssetUrl('absence-of-promised-safety/08_LIMAX.jpg'),
      taia: getAssetUrl('absence-of-promised-safety/09_TAIA.jpg'),
      helix: getAssetUrl('absence-of-promised-safety/10_HELIX.jpg'),
      // ... add other images here
    },
    // ... other projects
  }
};
