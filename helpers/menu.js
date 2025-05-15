import { Menu } from 'electron';

export function create() {
    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Configurations',
                        click: () => global.mainWindow.loadFile(global.paths.pages.config)
                    }
                ]
            }
        ])
    );
}