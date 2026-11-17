/**
 * «Desprender»: enseñar una sola sección de un sitio, en vivo, dentro del cotizador de RTC.
 *
 * El cotizador de rtcsoluciones.mx («Arma tu página») abre, por ejemplo,
 * `https://hackeria.org/?rtc-seccion=precios` en un marco. Este script, servido por el propio
 * sitio (`/rtc-desprender.js`, sin dependencias), oculta todo menos el elemento marcado con
 * `data-rtc-seccion="precios"` y le avisa al marco su altura para que no sobre ni falte espacio.
 * Sin el parámetro no hace nada: el sitio se ve como siempre.
 *
 * A diferencia de «Comentar», éste sí va en producción: vive en los sitios publicados (Hackería,
 * Legend, el portafolio, el blog y la página de Magui). Para que el marco cargue, cada sitio deja
 * que rtcsoluciones.mx lo incruste (`frame-ancestors`, ver README).
 *
 * Una marca puede servir para varias claves: `data-rtc-seccion="portada servicios"`.
 */
/** Las claves son las del catálogo de secciones de las landings (rtc-landinpage/src/lib/secciones.ts). */
export const CLAVE = /^[a-z0-9-]{2,30}$/;
/** La clave pedida en la URL, o null si no hay o no es válida. Pura: se prueba sin navegador. */
export function clavePedida(href) {
    try {
        const c = new URL(href).searchParams.get('rtc-seccion');
        return c && CLAVE.test(c) ? c : null;
    }
    catch {
        return null;
    }
}
/** Arranca en el navegador. Devuelve false si no se pidió ninguna sección. */
export function iniciarDesprender(doc = document, win = window) {
    const clave = clavePedida(win.location.href);
    if (!clave)
        return false;
    const enMarco = win.parent !== win;
    const avisar = (alto) => {
        if (!enMarco)
            return;
        const m = { tipo: 'rtc-desprendida', clave, alto };
        // Sólo viaja una altura y una clave pública: no hace falta restringir el destino.
        win.parent.postMessage(m, '*');
    };
    const selector = `[data-rtc-seccion~="${clave}"]`;
    // Next y React mandan la página por partes: una sección puede llegar primero dentro de un
    // `<div hidden id="S:0">` y moverse después a su lugar. Sólo cuenta la que ya está a la vista; si
    // se tomaba la oculta, se escondía el <main> real y la altura salía 0 (el blog, KAN-105).
    const buscar = () => (Array.from(doc.querySelectorAll(selector)).find((e) => !e.closest('[hidden], template')) ?? null);
    // Cada estilo que se pone guarda el que había, para poder rehacerlo si la sección cambia de lugar.
    const tocados = [];
    const poner = (n, p, v) => {
        tocados.push([n, p, n.style.getPropertyValue(p), n.style.getPropertyPriority(p)]);
        n.style.setProperty(p, v, 'important');
    };
    const deshacer = () => {
        for (const [n, p, v, prioridad] of tocados.splice(0).reverse()) {
            if (v)
                n.style.setProperty(p, v, prioridad);
            else
                n.style.removeProperty(p);
        }
    };
    let actual = null;
    const medir = () => { if (actual)
        avisar(Math.ceil(actual.getBoundingClientRect().bottom + win.scrollY)); };
    const ro = 'ResizeObserver' in win ? new ResizeObserver(medir) : null;
    const aplicar = (el) => {
        deshacer();
        actual = el;
        // Se ocultan los hermanos de la sección y de cada uno de sus contenedores: la sección conserva
        // su CSS (el de su sitio) y nada más ocupa lugar. Scripts y estilos se dejan en paz.
        for (let n = el; n && n !== doc.body && n.parentElement; n = n.parentElement) {
            for (const h of Array.from(n.parentElement.children)) {
                if (h !== n && !/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(h.tagName))
                    poner(h, 'display', 'none');
            }
        }
        doc.documentElement.setAttribute('data-rtc-desprendida', clave);
        // Los contenedores (main, envoltorios de página, body) pierden su relleno, margen y alto mínimo:
        // si no, la sección no queda pegada arriba y la altura avisada se queda corta (en el blog, 80 px).
        for (let n = el.parentElement; n && n !== doc.documentElement; n = n.parentElement) {
            for (const p of ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'])
                poner(n, p, '0');
            poner(n, 'min-height', '0');
        }
        poner(el, 'margin-top', '0');
        poner(el, 'margin-bottom', '0');
        win.scrollTo(0, 0);
        ro?.disconnect();
        ro?.observe(el);
        medir();
    };
    const correr = () => {
        const el = buscar();
        if (el && el !== actual)
            aplicar(el);
    };
    // Mientras la página termina de llegar se vuelve a buscar en cada cambio del documento.
    let pendiente = false;
    const mo = 'MutationObserver' in win
        ? new MutationObserver(() => {
            if (pendiente)
                return;
            pendiente = true;
            win.requestAnimationFrame(() => { pendiente = false; correr(); });
        })
        : null;
    const cerrar = () => {
        mo?.disconnect();
        correr();
        medir();
        if (!actual) {
            doc.documentElement.setAttribute('data-rtc-desprendida', 'no');
            avisar(0);
        }
    };
    const empezar = () => {
        correr();
        mo?.observe(doc.documentElement, { childList: true, subtree: true });
        if (doc.readyState === 'complete')
            win.setTimeout(cerrar, 1500);
        else
            win.addEventListener('load', () => win.setTimeout(cerrar, 1500));
    };
    if (doc.readyState === 'loading')
        doc.addEventListener('DOMContentLoaded', empezar);
    else
        empezar();
    // Dentro del marco, una liga no debe navegar el marco: se abre en otra pestaña.
    if (enMarco) {
        doc.addEventListener('click', (e) => {
            const a = e.target?.closest?.('a[href]');
            if (a) {
                a.target = '_blank';
                a.rel = 'noopener';
            }
        }, true);
    }
    return true;
}
// En el navegador arranca solo; en Node (pruebas) sólo se exportan las funciones.
if (typeof window !== 'undefined' && typeof document !== 'undefined')
    iniciarDesprender();
