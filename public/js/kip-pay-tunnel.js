/**
 * La colle entre un bouton d'achat et le formulaire intégré (kip-pay).
 *
 * Écrite en script CLASSIQUE, pas en module : les 29 sites PHP du parc portent
 * des scripts ES5 sans bundler, et un `<script type="module">` ne peut pas leur
 * exposer de fonction globale. Le module kip-pay est chargé par `import()`
 * dynamique, qui marche depuis un script classique.
 *
 * 🚨 Le principe qui gouverne tout ce fichier : le formulaire intégré passe
 * DEVANT la page hébergée, il ne la remplace pas. Tout ce qui peut échouer —
 * Stripe.js bloqué par un bloqueur de pub, module absent, session refusée,
 * élément indispensable non gaté sur le compte — retombe sur la page hébergée
 * de Stripe. On préfère afficher « KIPDEV » que perdre la vente.
 */
(function () {
  "use strict";

  // 🚨 Le CANAL de l'URL décide de la release, pas le contenu du fichier : le
  // bundle est identique octet pour octet sur tous les canaux, mais `v3` répond
  // « You must upgrade to the Basil release or higher to use initCheckout », et
  // `basil` attend `fetchClientSecret` là où les suivants attendent `clientSecret`.
  // Mesuré dans un navigateur, canal par canal : v3 ❌ · basil ❌ · clover ✅ · dahlia ✅.
  var CDN = "https://js.stripe.com/clover/stripe.js";

  /**
   * Où trouver le module, sans que le site ait à le dire.
   *
   * 🚨 Un chemin en dur ne marche pas : legal-site.fr sert ses fichiers sous
   * `/public/js/`, d'autres sous `/js/`, d'autres encore sous `/assets/`. Avec
   * `/js/kip-pay.js` écrit en dur, l'`import()` tombait en 404 et le tunnel se
   * repliait sur la page hébergée — SANS ERREUR VISIBLE, puisque le repli est
   * exactement le comportement prévu en cas d'échec. La fonctionnalité ne se
   * serait jamais activée et rien ne l'aurait signalé.
   * On se repère donc sur notre propre URL : le module est le voisin de ce
   * fichier. `asset()` ajoute un `?v=…`, d'où la partie optionnelle.
   */
  var MOI = document.currentScript && document.currentScript.src;
  var MODULE = MOI ? MOI.replace(/kip-pay-tunnel\.js(\?.*)?$/, "kip-pay.js")
                   : "/js/kip-pay.js";
  var stripePret = null;

  /** Charge Stripe.js une seule fois, même si l'acheteur rouvre le tunnel. */
  function chargerStripe(cle) {
    if (stripePret) return stripePret;
    stripePret = new Promise(function (ok, ko) {
      if (window.Stripe) return ok(window.Stripe(cle));
      var s = document.createElement("script");
      s.src = CDN;
      s.onload = function () {
        window.Stripe ? ok(window.Stripe(cle)) : ko(new Error("Stripe.js chargé mais absent"));
      };
      s.onerror = function () { ko(new Error("Stripe.js injoignable")); };
      document.head.appendChild(s);
    });
    stripePret.catch(function () { stripePret = null; });   // laisse une 2e chance
    return stripePret;
  }

  /**
   * Envoie la charge au serveur du site, dans le format qu'il attend déjà.
   *
   * 🚨 Plusieurs sites du parc postent un `FormData` et lisent `$_POST` côté PHP :
   * le convertir en JSON casserait leur contrôleur. On renvoie donc le FormData
   * tel quel — et sans en-tête `Content-Type`, que le navigateur doit poser
   * lui-même avec la frontière multipart.
   */
  function poster(endpoint, corps, entetes) {
    var estForm = typeof FormData !== "undefined" && corps instanceof FormData;
    // 🚨 L'intention passe AUSSI par un en-tête, pas seulement par le corps.
    // Les routes Next lisent leur corps de quatre façons différentes, avec des
    // typages TypeScript qui n'acceptent pas un champ de plus — et le relire une
    // seconde fois lève « body already read ». Un en-tête se teste en une ligne,
    // quelle que soit la route.
    var tetes = Object.assign({ "X-Requested-With": "XMLHttpRequest" }, entetes || {});
    if (!estForm) tetes["Content-Type"] = "application/json";
    return fetch(endpoint, {
      method: "POST",
      headers: tetes,
      body: estForm ? corps : JSON.stringify(corps),
    }).then(function (r) { return r.json(); });
  }

  /** Une copie de la charge, marquée « intégré », quel que soit son format. */
  var ENTETE_INTEGRE = { "X-Kip-Pay": "inline" };

  function marquerIntegre(corps) {
    if (typeof FormData !== "undefined" && corps instanceof FormData) {
      var f = new FormData();
      corps.forEach(function (v, k) { f.append(k, v); });
      f.append("ui", "inline");
      return f;
    }
    return Object.assign({}, corps, { ui: "inline" });
  }

  /**
   * La boîte de dialogue.
   *
   * 🚨 `<dialog>` natif se centre tout seul — SAUF si une remise à zéro CSS met
   * `margin: 0` sur tout, ce que fait le preflight de Tailwind et ce que font
   * plusieurs `global.css` du parc. D'où le `margin:auto` posé en dur ici :
   * il ne dépend d'aucune feuille du site.
   */
  function ouvrirBoite() {
    var d = document.createElement("dialog");
    d.className = "kip-pay-boite";
    d.setAttribute("aria-label", "Paiement");
    // 48rem laisse la place aux deux colonnes sur ordinateur ; en dessous de
    // 680px de contenu le tunnel repasse tout seul en une colonne (requête de
    // conteneur, pas de viewport), donc la même valeur sert au téléphone.
    d.style.cssText = "margin:auto;padding:0;border:0;border-radius:14px;" +
                      "width:min(50rem,94vw);max-height:94vh;background:#fff;position:relative;" +
                      // 🚨 `overflow:auto` tout court laissait une barre HORIZONTALE :
                      // l'iframe du paiement en un clic mesure 4 px de plus que sa
                      // colonne. Le panneau défile en hauteur, jamais en largeur.
                      "overflow-x:hidden;overflow-y:auto";
    var fermer = document.createElement("button");
    fermer.type = "button";
    fermer.setAttribute("aria-label", "Fermer");
    fermer.textContent = "×";
    fermer.style.cssText = "position:absolute;top:.6rem;right:.7rem;z-index:2;border:0;" +
                           "width:2rem;height:2rem;border-radius:50%;background:transparent;" +
                           "font-size:1.4rem;line-height:1;cursor:pointer;color:#6b7480";
    var hote = document.createElement("div");
    // Sans marge intérieure le formulaire touche les bords de la boîte : c'est la
    // boîte qui la porte, pas la feuille du module, pour que le module reste posable
    // dans n'importe quel conteneur du site.
    hote.style.cssText = "padding:22px 24px";
    d.appendChild(fermer);
    d.appendChild(hote);
    document.body.appendChild(d);
    d.showModal();
    return { boite: d, hote: hote, fermer: fermer };
  }

  /**
   * @param {object} o
   * @param {string} o.endpoint route qui crée la session (ex. /api/create-checkout)
   * @param {object} o.payload  corps attendu par cette route, sans le `ui`
   * @param {object} [o.entetes] en-têtes supplémentaires (CSRF)
   * @param {string} [o.clePublique] clé publique Stripe. Facultative : si elle
   *   manque, elle est lue dans la réponse de `endpoint` (champ `publishableKey`).
   * @param {string} [o.logoUrl] logo du site, affiché en tête du formulaire
   * @param {string} [o.siteName] nom du site, affiché à côté du logo
   * @param {string} [o.email] pré-remplit l'adresse
   * @param {object} [o.appearance] Appearance API de Stripe, pour ses iframes
   * @param {object} [o.theme] couleurs du panneau lui-même, sans le préfixe `--kip-`
   *   (ex. `{ action: '#14503E', encre: '#2E3742', rayon: '6px' }`)
   * @param {(msg:string)=>void} [o.onErreur] prévenir l'utilisateur quand tout a échoué
   * @param {()=>void} [o.onFerme] réactiver les boutons du site
   */
  function ouvrir(o) {
    var ui = ouvrirBoite();
    var fini = false;
    var terminer = function () {
      if (fini) return;
      fini = true;
      try { ui.boite.close(); } catch (e) {}
      ui.boite.remove();
      if (o.onFerme) o.onFerme();
    };
    ui.fermer.addEventListener("click", terminer);
    ui.boite.addEventListener("cancel", terminer);   // Échap

    /** Le repli : on redemande la MÊME route sans `ui`, et on part chez Stripe. */
    var replier = function () {
      return poster(o.endpoint, o.payload, o.entetes).then(function (res) {
        if (res && res.url) { window.location.href = res.url; return; }
        terminer();
        if (o.onErreur) o.onErreur((res && res.error) || "Le paiement n'a pas pu démarrer.");
      }).catch(function () {
        terminer();
        if (o.onErreur) o.onErreur("Le paiement n'a pas pu démarrer. Vérifiez votre connexion.");
      });
    };

    /**
     * La clé publique, sans exiger qu'elle soit posée dans la page.
     *
     * 🚨 Sous Next, une clé lisible par le navigateur doit être préfixée
     * `NEXT_PUBLIC_` et fournie AU BUILD — soit une variable à ajouter puis un
     * rebuild sur chacun des 65 sites. Le serveur, lui, a déjà la clé au runtime.
     * On la laisse donc revenir AVEC la session : le site n'a rien à déclarer, et
     * la clé et le `client_secret` viennent forcément du même compte, ce qui
     * supprime au passage la panne classique du couple dépareillé.
     */
    var corps = marquerIntegre(o.payload);

    /**
     * 🚨 L'ordre compte. Quand la clé est déjà dans la page, on garde l'appel
     * PARESSEUX : si Stripe.js ou le module ne chargent pas, aucune session n'a
     * encore été créée et le repli n'en crée qu'une. Ce n'est que lorsqu'il faut
     * lire la clé DANS la réponse qu'on est obligé d'appeler le serveur d'abord —
     * et un repli coûte alors une session orpheline. On paie ce prix uniquement
     * là où on n'a pas le choix.
     */
    var session = null;
    var demanderSession = function () {
      if (!session) {
        session = poster(o.endpoint, corps,
                         Object.assign({}, o.entetes, ENTETE_INTEGRE)).then(function (res) {
          // 🚨 Toutes les routes ne répondent pas à plat : certaines enveloppent
          // leur charge utile dans `data`. Chercher au premier niveau seulement
          // faisait échouer le montage sur une session parfaitement valide.
          var utile = (res && res.clientSecret) ? res : (res && res.data) || {};
          if (!utile.clientSecret) throw new Error((res && res.error) || "session refusée");
          return utile;
        });
        session.catch(function () {});
      }
      return session;
    };

    var stripePret = o.clePublique
      ? chargerStripe(o.clePublique)
      : demanderSession().then(function (res) {
          if (!res.publishableKey) throw new Error("clé publique absente de la réponse");
          return chargerStripe(res.publishableKey);
        });

    Promise.all([stripePret, import(o.moduleUrl || MODULE)])
      .then(function (r) {
        var stripe = r[0], mod = r[1];
        return mod.mountKipPay(ui.hote, {
          stripe: stripe,
          createSession: function () {
            return demanderSession().then(function (res) {
              return { clientSecret: res.clientSecret };
            });
          },
          logoUrl: o.logoUrl,
          siteName: o.siteName,
          email: o.email,
          appearance: o.appearance,
          theme: o.theme,
          // 🚨 Une erreur DANS le formulaire (carte refusée) ne doit PAS replier :
          // l'acheteur est déjà en train de payer, le renvoyer chez Stripe lui
          // ferait tout ressaisir. Seul un échec de MONTAGE replie, et il se voit
          // au rejet de la promesse ci-dessous.
        });
      })
      .catch(function (err) {
        if (window.console) console.warn("[kip-pay] repli sur la page hébergée :", err);
        return replier();
      });
  }

  window.KipPayTunnel = { ouvrir: ouvrir };
})();
