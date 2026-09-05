/**
 * kip-pay — le tunnel de paiement complet, posé DANS la page du site.
 *
 * POURQUOI CE MODULE EXISTE
 * Une grande partie du parc encaisse sur un même compte Stripe dont le nom public est
 * « KIPDEV ». Sur la page hébergée, le dernier écran avant de payer affiche donc le nom
 * d'une entreprise que l'acheteur n'a jamais vue, avec un logo qui n'est pas celui du
 * site. Ce nom n'est PAS réglable par session : c'est un paramètre de compte. Le seul
 * moyen de ne plus le montrer est de ne plus afficher la page de Stripe.
 *
 * CE QU'IL REND, DANS L'ORDRE
 *   1. L'en-tête : LE LOGO DU SITE et son nom — la marque que l'acheteur reconnaît.
 *   2. Le récapitulatif : chaque ligne de commande, puis sous-total, remise, taxe, total.
 *      Tous ces montants sont lus DANS la session Stripe, jamais recopiés de la page.
 *   3. Le code promo, repliable, avec application et retrait.
 *   4. Les boutons UN CLIC (Link, Apple Pay, Google Pay) — masqués, séparateur compris,
 *      si aucun portefeuille n'est disponible sur l'appareil.
 *   5. L'e-mail, le moyen de paiement, les conditions légales.
 *   6. Le bouton de paiement portant le total.
 *
 * CE QU'IL N'EST PAS
 * Ce n'est pas un composant React. Neuf sites du parc sont en PHP MVC et n'ont aucun
 * outillage front : un composant React ne les aurait jamais servis, et on l'aurait écrit
 * deux fois. Ce fichier n'importe rien et ne suppose aucun framework — il reçoit une
 * instance Stripe.js déjà chargée et se débrouille avec le DOM.
 *   • Next : `import { mountKipPay } from "@/lib/kip-pay"`
 *   • PHP  : `<script type="module">import { mountKipPay } from "/js/kip-pay.js"</script>`
 *
 * PRÉREQUIS SERVEUR
 * Une session Checkout `ui_mode: "elements"` avec un `return_url`, dont on renvoie le
 * `client_secret`. Exige le SDK `stripe` ≥ 22 : avant, `ui_mode` n'acceptait que
 * `hosted` et `embedded`.
 */

const TEXTES = {
  payer: "Payer",
  patienter: "Un instant…",
  encours: "Paiement en cours…",
  recap: "Votre commande",
  sousTotal: "Sous-total",
  remise: "Remise",
  taxe: "TVA",
  total: "Total",
  parMois: "par mois",
  parAn: "par an",
  codePromo: "J'ai un code promo",
  codePromoChamp: "Code promo",
  appliquer: "Appliquer",
  retirer: "Retirer",
  codeRefuse: "Ce code n'est pas valable pour cette commande.",
  unClic: "Payer en un clic",
  ou: "ou payer par carte",
  coordonnees: "Vos coordonnées",
  paiement: "Moyen de paiement",
  erreurCharge:
    "Le formulaire de paiement n'a pas pu se charger. Rechargez la page ; si cela recommence, écrivez-nous.",
  erreurSession:
    "Impossible de préparer le paiement. Rechargez la page ; si cela recommence, écrivez-nous.",
  rassurance: "Paiement sécurisé par Stripe. Votre carte n'est jamais vue par ce site.",
};


/**
 * Les libellés dessinés par le module, par langue.
 *
 * 🚨 Ceux de Stripe s'adaptent seuls à la langue du visiteur ; les nôtres, non.
 * Vu à l'écran sur tabela-alergenow.pl : « PAYER EN UN CLIC » et « Moyen de
 * paiement » en français au milieu d'une page polonaise. Le parc compte six sites
 * non francophones par domaine, plus les `.com` anglophones.
 *
 * La langue vient de `<html lang>` — le site la déclare déjà, on ne la redemande
 * pas. `textes` reste prioritaire pour un site qui veut sa propre formulation.
 */
const LANGUES = {
  en: {
    payer: "Pay", patienter: "One moment…", encours: "Processing…",
    recap: "Your order", sousTotal: "Subtotal", remise: "Discount", taxe: "Tax",
    total: "Total", parMois: "per month", parAn: "per year",
    codePromo: "I have a promo code", codePromoChamp: "Promo code",
    appliquer: "Apply", retirer: "Remove",
    codeRefuse: "This code is not valid for this order.",
    unClic: "Pay in one click", ou: "or pay by card",
    coordonnees: "Your details", paiement: "Payment method",
    erreurCharge: "The payment form could not load. Reload the page; if it happens again, write to us.",
    erreurSession: "The payment could not be prepared. Reload the page; if it happens again, write to us.",
    rassurance: "Payment secured by Stripe. This site never sees your card.",
  },
  pl: {
    payer: "Zapłać", patienter: "Chwileczkę…", encours: "Przetwarzanie…",
    recap: "Twoje zamówienie", sousTotal: "Suma częściowa", remise: "Rabat", taxe: "VAT",
    total: "Razem", parMois: "miesięcznie", parAn: "rocznie",
    codePromo: "Mam kod rabatowy", codePromoChamp: "Kod rabatowy",
    appliquer: "Zastosuj", retirer: "Usuń",
    codeRefuse: "Ten kod nie jest ważny dla tego zamówienia.",
    unClic: "Zapłać jednym kliknięciem", ou: "lub zapłać kartą",
    coordonnees: "Twoje dane", paiement: "Metoda płatności",
    erreurCharge: "Formularz płatności nie mógł się załadować. Odśwież stronę; jeśli to się powtórzy, napisz do nas.",
    erreurSession: "Nie udało się przygotować płatności. Odśwież stronę; jeśli to się powtórzy, napisz do nas.",
    rassurance: "Płatność zabezpieczona przez Stripe. Ta strona nigdy nie widzi Twojej karty.",
  },
  it: {
    payer: "Paga", patienter: "Un momento…", encours: "Pagamento in corso…",
    recap: "Il tuo ordine", sousTotal: "Subtotale", remise: "Sconto", taxe: "IVA",
    total: "Totale", parMois: "al mese", parAn: "all'anno",
    codePromo: "Ho un codice sconto", codePromoChamp: "Codice sconto",
    appliquer: "Applica", retirer: "Rimuovi",
    codeRefuse: "Questo codice non è valido per questo ordine.",
    unClic: "Paga con un clic", ou: "oppure paga con carta",
    coordonnees: "I tuoi dati", paiement: "Metodo di pagamento",
    erreurCharge: "Il modulo di pagamento non si è caricato. Ricarica la pagina; se succede ancora, scrivici.",
    erreurSession: "Impossibile preparare il pagamento. Ricarica la pagina; se succede ancora, scrivici.",
    rassurance: "Pagamento protetto da Stripe. Questo sito non vede mai la tua carta.",
  },
  es: {
    payer: "Pagar", patienter: "Un momento…", encours: "Procesando…",
    recap: "Tu pedido", sousTotal: "Subtotal", remise: "Descuento", taxe: "IVA",
    total: "Total", parMois: "al mes", parAn: "al año",
    codePromo: "Tengo un código promocional", codePromoChamp: "Código promocional",
    appliquer: "Aplicar", retirer: "Quitar",
    codeRefuse: "Este código no es válido para este pedido.",
    unClic: "Pagar con un clic", ou: "o pagar con tarjeta",
    coordonnees: "Tus datos", paiement: "Método de pago",
    erreurCharge: "El formulario de pago no se ha podido cargar. Recarga la página; si vuelve a ocurrir, escríbenos.",
    erreurSession: "No se ha podido preparar el pago. Recarga la página; si vuelve a ocurrir, escríbenos.",
    rassurance: "Pago protegido por Stripe. Este sitio nunca ve tu tarjeta.",
  },
};

function languePage(o) {
  if (o.langue) return o.langue;
  const l = (document.documentElement.getAttribute("lang") || "").slice(0, 2).toLowerCase();
  return LANGUES[l] ? l : "fr";
}

const INTERVALLES = { month: "par mois", year: "par an", week: "par semaine", day: "par jour" };

/**
 * @param {HTMLElement} container élément vide qui recevra le tunnel
 * @param {object} o
 * @param {any} o.stripe instance Stripe.js déjà chargée
 * @param {() => Promise<{clientSecret: string}>} o.createSession appelle VOTRE endpoint
 * @param {string} [o.logoUrl] URL du logo du site (SVG de préférence)
 * @param {string} [o.siteName] nom affiché à côté du logo
 * @param {string} [o.email] pré-remplit l'adresse, modifiable
 * @param {object} [o.appearance] Appearance API de Stripe, pour coller à votre charte
 * @param {boolean} [o.codePromo] afficher le champ de code promo (défaut : true)
 * @param {(session:any)=>void} [o.onSuccess]
 * @param {(message:string)=>void} [o.onError]
 * @param {Partial<typeof TEXTES>} [o.textes]
 * @returns {Promise<{destroy:()=>void}>}
 */
export async function mountKipPay(container, o) {
  const t = { ...TEXTES, ...(LANGUES[languePage(o)] || {}), ...(o.textes || {}) };


  /**
   * Le montage a échoué : on LÈVE, on n'affiche pas.
   *
   * 🚨 Cette fonction rendait un message d'erreur et renvoyait un objet valide.
   * Conséquence : l'appelant croyait le montage réussi, son repli sur la page
   * hébergée ne partait JAMAIS, et l'acheteur restait devant une impasse polie.
   * C'est ce qui s'est vu à l'écran le 05/09 sur l'aperçu de legal-site.fr.
   * Le contrat est maintenant : un montage qui échoue lève, et c'est l'appelant
   * — qui seul sait s'il a une page hébergée sous la main — qui décide.
   */
  const echec = (msg) => {
    container.innerHTML = "";
    if (o.onError) o.onError(msg);
    const err = new Error(msg);
    err.kipPayMontage = true;
    throw err;
  };

  container.innerHTML = squelette(t, o);
  const $ = (s) => container.querySelector(s);
  const form = $("form.kip-pay");

  // 🚨 L'Appearance API de Stripe n'habille QUE ses iframes. Tout ce que le module
  // dessine lui-même — récapitulatif, séparateurs, bouton de paiement — garderait
  // sinon ses couleurs par défaut : sur un site marine ou laiton, le bouton
  // « Payer » jure avec toute la page.
  // 🚨 Et il faut les poser sur `.kip-pay` lui-même, pas sur le conteneur : la
  // feuille les déclare SUR cet élément, et une déclaration propre bat toujours
  // une valeur héritée du parent.
  if (o.theme && form) {
    for (const [nom, valeur] of Object.entries(o.theme)) {
      if (valeur) form.style.setProperty(`--kip-${nom}`, valeur);
    }
  }
  const bouton = $('[data-kip="bouton"]');
  const zoneErreur = $('[data-kip="erreur"]');
  const blocExpress = $('[data-kip="bloc-express"]');

  const montrerErreur = (m) => {
    zoneErreur.textContent = m;
    zoneErreur.hidden = false;
    if (o.onError) o.onError(m);
  };
  const effacerErreur = () => {
    zoneErreur.textContent = "";
    zoneErreur.hidden = true;
  };

  // Le SDK accepte une promesse : Stripe initialise son iframe pendant que le serveur
  // crée la session. 🚨 Si elle échoue, `loadActions()` renvoie une erreur au lieu de
  // lever — c'est là qu'on rattrape, pas dans un try/catch autour de createSession.
  const clientSecret = Promise.resolve()
    .then(() => o.createSession())
    .then((r) => {
      if (!r || !r.clientSecret) throw new Error("clientSecret absent de la réponse");
      return r.clientSecret;
    });
  clientSecret.catch(() => {});

  let checkout;
  try {
    checkout = o.stripe.initCheckoutElementsSdk({
      clientSecret,
      // 🚨 Sans ça, Stripe propose de payer dans une autre devise en avertissant que
      //    « votre banque peut appliquer des frais de change » — en plein tunnel, sur
      //    un achat de quelques euros en France, ça travaille contre la vente.
      adaptivePricing: { allowed: false },
      ...(o.appearance ? { elementsOptions: { appearance: o.appearance } } : {}),
      ...(o.email ? { defaultValues: { email: o.email } } : {}),
    });
  } catch {
    return echec(t.erreurCharge);
  }

  const chargement = await checkout.loadActions();
  if (chargement.type !== "success") return echec(t.erreurSession);
  const actions = chargement.actions;

  const elements = [];

  /**
   * 🚨 Chaque élément se monte dans SON PROPRE try/catch, et le module distingue
   *    l'indispensable de l'agrément.
   *
   *    Avec un seul try/catch autour des quatre, le Terms Element — qui exige une
   *    autorisation Stripe que ce compte n'a pas (« You cannot use the Terms Element
   *    without being gated into this functionality ») — faisait tomber l'e-mail et la
   *    carte avec lui : le tunnel entier affichait « le formulaire n'a pas pu se
   *    charger » alors que tout ce qui sert à payer fonctionnait.
   *
   *    Règle : un élément d'agrément qui échoue disparaît. Un élément indispensable
   *    qui échoue fait basculer sur la page hébergée.
   */
  const monter = (cible, fabrique, { requis = false, surEchec, avantMontage } = {}) => {
    try {
      const el = fabrique();
      // 🚨 `avantMontage` n'est pas un raffinement : certains événements — `ready` de
      //    l'Express Checkout — partent PENDANT le montage. Un gestionnaire attaché
      //    après `mount()` ne les voit jamais, et le bloc reste masqué alors que le
      //    portefeuille était disponible. C'est exactement le défaut que ce paramètre
      //    existe pour empêcher.
      if (avantMontage) avantMontage(el);
      el.mount($(cible));
      elements.push(el);
      return el;
    } catch (err) {
      if (requis) throw err;
      if (surEchec) surEchec();
      return null;
    }
  };

  try {
    // Agrément — le chemin le plus court vers le paiement, quand l'appareil le permet.
    monter('[data-kip="express"]', () => checkout.createExpressCheckoutElement({ buttonHeight: 44 }), {
      surEchec: () => { blocExpress.hidden = true; },
      avantMontage: (el) =>
        el.on("ready", (e) => {
          // 🚨 L'élément se monte même quand aucun portefeuille n'est disponible : sans
          //    ce test, on afficherait un cadre vide surmonté d'un séparateur « ou payer
          //    par carte » qui ne sépare rien. Stripe renvoie `undefined` quand rien
          //    n'est proposable, et sinon un objet où CHAQUE moyen vaut true ou false —
          //    compter les clés ne suffit donc pas, il faut au moins un `true`.
          const dispo = e && e.availablePaymentMethods;
          const auMoinsUn = dispo && Object.values(dispo).some(Boolean);
          blocExpress.hidden = !auMoinsUn;
        }),
    });

    // Indispensables : sans eux il n'y a pas de paiement possible.
    monter('[data-kip="contact"]', () => checkout.createContactDetailsElement(), { requis: true });
    monter('[data-kip="paiement"]', () => checkout.createPaymentElement({ layout: "accordion" }), { requis: true });

    // Agrément : mandats SEPA et conditions des portefeuilles. Réservé par Stripe aux
    // comptes autorisés — absent, le bloc reste simplement vide.
    monter('[data-kip="conditions"]', () => checkout.createTermsElement());
  } catch {
    return echec(t.erreurCharge);
  }

  const peindre = (s) => {
    if (!s) return;
    $('[data-kip="lignes"]').innerHTML = (s.lineItems || []).map((l) => ligneHTML(l, t)).join("");
    $('[data-kip="totaux"]').innerHTML = totauxHTML(s, t);
    const promo = (s.discountAmounts || []).find((d) => d.promotionCode);
    peindrePromo($, t, promo);
    bouton.textContent = s.total && s.total.total ? `${t.payer} ${s.total.total.amount}` : t.payer;
    bouton.disabled = !s.canConfirm;
  };
  peindre(actions.getSession());
  checkout.on("change", peindre);

  if (o.codePromo !== false) branchePromo($, t, actions, montrerErreur);

  let enCours = false;
  const onSubmit = async (e) => {
    e.preventDefault();
    if (enCours) return;
    enCours = true;
    effacerErreur();
    const libelle = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = t.encours;

    const r = await actions.confirm();

    // Si la banque impose une authentification, Stripe a déjà redirigé et on n'arrive
    // jamais ici. On ne repasse que si le paiement a abouti sans redirection, ou échoué.
    if (r && r.type === "error") {
      montrerErreur(r.error && r.error.message ? r.error.message : t.erreurSession);
      bouton.textContent = libelle;
      bouton.disabled = false;
      enCours = false;
      return;
    }
    if (o.onSuccess) o.onSuccess(actions.getSession());
  };
  form.addEventListener("submit", onSubmit);

  return {
    destroy() {
      form.removeEventListener("submit", onSubmit);
      elements.forEach((el) => {
        try { el.destroy(); } catch { /* déjà démonté */ }
      });
      container.innerHTML = "";
    },
  };
}

/* ------------------------------------------------------------------ rendu */

function squelette(t, o) {
  const entete =
    o.logoUrl || o.siteName
      ? `<header class="kip-pay__marque">
           ${o.logoUrl ? `<img class="kip-pay__logo" src="${esc(o.logoUrl)}" alt="" width="36" height="36">` : ""}
           ${o.siteName ? `<span class="kip-pay__site">${esc(o.siteName)}</span>` : ""}
         </header>`
      : "";

  return `
    <form class="kip-pay" novalidate>
      ${entete}

      <div class="kip-pay__colonnes">
      <div class="kip-pay__col kip-pay__col--resume">
      <section class="kip-pay__recap" aria-label="${esc(t.recap)}">
        <div data-kip="lignes"></div>
        <dl class="kip-pay__totaux" data-kip="totaux"></dl>
        ${o.codePromo === false ? "" : `
        <details class="kip-pay__promo" data-kip="promo-bloc">
          <summary>${esc(t.codePromo)}</summary>
          <div class="kip-pay__promo-saisie">
            <label class="kip-pay__sr" for="kip-promo">${esc(t.codePromoChamp)}</label>
            <input id="kip-promo" data-kip="promo-champ" type="text" autocomplete="off"
                   spellcheck="false" placeholder="${esc(t.codePromoChamp)}">
            <button type="button" class="kip-pay__promo-btn" data-kip="promo-valider">${esc(t.appliquer)}</button>
          </div>
          <p class="kip-pay__promo-erreur" data-kip="promo-erreur" role="alert" hidden></p>
        </details>
        <p class="kip-pay__promo-actif" data-kip="promo-actif" hidden></p>`}
      </section>
      <p class="kip-pay__note">${esc(t.rassurance)}</p>
      </div>

      <div class="kip-pay__col kip-pay__col--payer">
      <div class="kip-pay__express" data-kip="bloc-express" hidden>
        <span class="kip-pay__label">${esc(t.unClic)}</span>
        <div data-kip="express"></div>
        <p class="kip-pay__ou"><span>${esc(t.ou)}</span></p>
      </div>

      <div class="kip-pay__champ">
        <span class="kip-pay__label">${esc(t.coordonnees)}</span>
        <div data-kip="contact"></div>
      </div>

      <div class="kip-pay__champ">
        <span class="kip-pay__label">${esc(t.paiement)}</span>
        <div data-kip="paiement"></div>
      </div>

      <div class="kip-pay__conditions" data-kip="conditions"></div>
      <p class="kip-pay__erreur" data-kip="erreur" role="alert" hidden></p>
      <button class="kip-pay__bouton" type="submit" data-kip="bouton" disabled>${esc(t.patienter)}</button>
      </div>
      </div>
    </form>`;
}

function ligneHTML(l, t) {
  const periode = l.recurring ? ` <span class="kip-pay__periode">${esc(periodeTexte(l.recurring, t))}</span>` : "";
  const qte = l.quantity > 1 ? `<span class="kip-pay__qte">× ${l.quantity}</span>` : "";
  return `
    <div class="kip-pay__ligne">
      <div class="kip-pay__ligne-txt">
        <span class="kip-pay__ligne-nom">${esc(l.name)}${qte}</span>
        ${l.description ? `<span class="kip-pay__ligne-desc">${esc(l.description)}</span>` : ""}
      </div>
      <span class="kip-pay__ligne-prix">${esc(l.total.amount)}${periode}</span>
    </div>`;
}

function periodeTexte(r, t) {
  const base = INTERVALLES[r.interval] || "";
  if (!base) return "";
  return r.intervalCount > 1 ? `tous les ${r.intervalCount} ${r.interval === "month" ? "mois" : "ans"}` : base;
}

/** N'affiche que les lignes qui existent : un « TVA 0,00 € » sur un produit non taxé
 *  fait douter, et une remise à zéro laisse croire qu'un code a échoué. */
function totauxHTML(s, t) {
  const nul = (a) => !a || !a.minorUnitsAmount;
  const l = [];
  const tot = s.total || {};
  if (!nul(tot.discount) || !nul(tot.taxInclusive) || !nul(tot.taxExclusive)) {
    l.push(paire(t.sousTotal, tot.subtotal && tot.subtotal.amount));
  }
  if (!nul(tot.discount)) l.push(paire(t.remise, `−${tot.discount.amount}`, "remise"));
  if (!nul(tot.taxExclusive)) l.push(paire(t.taxe, tot.taxExclusive.amount));
  l.push(paire(t.total, tot.total && tot.total.amount, "total"));
  return l.join("");
}

function paire(cle, valeur, modif) {
  const c = modif ? ` kip-pay__paire--${modif}` : "";
  return `<div class="kip-pay__paire${c}"><dt>${esc(cle)}</dt><dd>${esc(valeur || "—")}</dd></div>`;
}

function peindrePromo($, t, promo) {
  const bloc = $('[data-kip="promo-bloc"]');
  const actif = $('[data-kip="promo-actif"]');
  if (!bloc || !actif) return;
  if (promo) {
    bloc.hidden = true;
    actif.hidden = false;
    actif.innerHTML = `<span>${esc(promo.displayName || promo.promotionCode)}</span>
      <button type="button" class="kip-pay__promo-retirer" data-kip="promo-retirer">${esc(t.retirer)}</button>`;
  } else {
    bloc.hidden = false;
    actif.hidden = true;
    actif.innerHTML = "";
  }
}

function branchePromo($, t, actions, montrerErreur) {
  const erreur = $('[data-kip="promo-erreur"]');
  const dire = (m) => {
    if (!erreur) return;
    erreur.textContent = m;
    erreur.hidden = !m;
  };

  $(".kip-pay").addEventListener("click", async (e) => {
    const valider = e.target.closest('[data-kip="promo-valider"]');
    const retirer = e.target.closest('[data-kip="promo-retirer"]');
    if (!valider && !retirer) return;
    e.preventDefault();

    if (retirer) {
      const r = await actions.removePromotionCode();
      if (r && r.type === "error") montrerErreur(r.error && r.error.message);
      return;
    }
    const champ = $('[data-kip="promo-champ"]');
    const code = (champ.value || "").trim();
    if (!code) return;
    dire("");
    valider.disabled = true;
    const r = await actions.applyPromotionCode(code);
    valider.disabled = false;
    if (r && r.type === "error") {
      dire((r.error && r.error.message) || t.codeRefuse);
      return;
    }
    champ.value = "";
  });

  // Entrée dans le champ ne doit pas envoyer le paiement.
  const champ = $('[data-kip="promo-champ"]');
  if (champ) {
    champ.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        $('[data-kip="promo-valider"]').click();
      }
    });
  }
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}
