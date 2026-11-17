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
    const correr = () => {
        const el = doc.querySelector(`[data-rtc-seccion~="${clave}"]`);
        if (!el) {
            doc.documentElement.setAttribute('data-rtc-desprendida', 'no');
            avisar(0);
            return;
        }
        // Se ocultan los hermanos de la sección y de cada uno de sus contenedores: la sección conserva
        // su CSS (el de su sitio) y nada más ocupa lugar. Scripts y estilos se dejan en paz.
        for (let n = el; n && n !== doc.body && n.parentElement; n = n.parentElement) {
            for (const h of Array.from(n.parentElement.children)) {
                if (h !== n && !/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(h.tagName))
                    h.style.setProperty('display', 'none', 'important');
            }
        }
        doc.documentElement.setAttribute('data-rtc-desprendida', clave);
        doc.body.style.setProperty('margin', '0', 'important');
        el.style.setProperty('margin-top', '0', 'important');
        win.scrollTo(0, 0);
        const medir = () => avisar(Math.ceil(el.getBoundingClientRect().height));
        medir();
        if ('ResizeObserver' in win)
            new ResizeObserver(medir).observe(el);
        win.addEventListener('load', medir);
    };
    if (doc.readyState === 'loading')
        doc.addEventListener('DOMContentLoaded', correr);
    else
        correr();
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
