const localeElements = document.getElementsByClassName('locale');

window.electronAPI.getConfig()
.then((config) => {
    config.lang == 'ar' ? setRtl() : '';
})
.catch(() => setRtl())
.finally(() => translate());

function setRtl() {
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = '../asset/css/app-rtl.css';

    document.getElementsByTagName('head')[0].appendChild(linkNode);
}

function translate() {
    for(let i = 0; i < localeElements.length; i++) {
        const localeElement = localeElements[i];
        window.i18n.t(localeElement.getAttribute('data-key'))
        .then(result => {
            localeElement.textContent = result;
        });
    }
}