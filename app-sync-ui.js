import { syncPrefsDepuisStockage, lireEtoiles, lireNomRenard, getNiveauCourant } from "./app-state.js";
import { synchroniserAffichageMenu } from "./app-nav.js";
import { syncProfilActif } from "./app-profils.js";
import { afficherMissions } from "./app-gamification.js";

export function rafraichirUiComplete() {
  try {
    syncPrefsDepuisStockage();
    syncProfilActif(lireEtoiles(), lireNomRenard(), getNiveauCourant());
    synchroniserAffichageMenu();
    afficherMissions();
  } catch { /* ignore */ }
}
