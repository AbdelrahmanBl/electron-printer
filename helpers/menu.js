import { Menu } from 'electron';

export function create() {
    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            {
                label: global.i18n.t('Menu'),
                submenu: [
                    {
                        label: global.i18n.t('Configurations'),
                        click: () => global.mainWindow.loadFile(global.paths.pages.config)
                    }
                ]
            }
        ])
    );
}