window.electronAPI.getConfig()
.then((config) => {
    config.lang == 'ar' ? setRtl() : '';
})
.catch(() => setRtl());

function setRtl() {
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = '../asset/css/app-rtl.css';

    document.getElementsByTagName('head')[0].appendChild(linkNode);
}
