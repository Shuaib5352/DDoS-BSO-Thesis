const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
// اختبر وجود Next.js server
const isDev = true; // تم تعيينه مباشرة للتطوير

// URL'i belirle - geliştirme de localhost, production'da file protokolü
const NEXT_URL = 'http://localhost:8888'; // اتصل مباشرة بـ localhost:8888

let mainWindow;
let appIsReady = false;

/**
 * Electron Penceresi Oluşturma
 * Ana uygulama penceresini başlatır ve konfigüre eder
 */
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true
        },
        icon: path.join(__dirname, 'icon.ico')
    });

    // URL'i yükle
    mainWindow.loadURL(NEXT_URL);

    // Geliştirme modunda DevTools'u aç
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Pencere kapatıldığında işleme
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // URL değiştiğinde (geliştirme modunda)
    mainWindow.webContents.on('did-fail-load', () => {
        if (isDev) {
            setTimeout(() => {
                mainWindow.loadURL(NEXT_URL);
            }, 1000);
        }
    });
};

/**
 * Uygulama Menüsü Oluşturma
 * Türkçe dilinde tüm menü öğelerini tanımlar
 */
const createMenu = () => {
    const template = [
        {
            label: 'Dosya',
            submenu: [
                {
                    label: 'Çıkış',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Düzen',
            submenu: [
                {
                    label: 'Yakınlaştır',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
                        }
                    }
                },
                {
                    label: 'Uzaklaştır',
                    accelerator: 'CmdOrCtrl+Minus',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
                        }
                    }
                },
                {
                    label: 'Varsayılan Zum Seviyesi',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.setZoomLevel(0);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Tam Ekran',
                    accelerator: 'F11',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    }
                }
            ]
        },
        {
            label: 'Görüşüm',
            submenu: [
                {
                    label: 'Yenile',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.reload();
                        }
                    }
                },
                {
                    label: 'Zorla Yenile',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.reloadIgnoringCache();
                        }
                    }
                }
            ]
        }
    ];

    // Geliştirme modunda Geliştirici Araçları menüsünü ekle
    if (isDev) {
        template.push({
            label: 'Geliştirici',
            submenu: [
                {
                    label: 'Geliştirici Araçlarını Aç',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.openDevTools();
                        }
                    }
                }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

/**
 * IPC Dinleyicileri Ayarla
 * Renderer sürecinden gelen sinyalleri işle
 */
const setupIPC = () => {
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    ipcMain.handle('get-app-name', () => {
        return 'DDoS-BSO Tespiti';
    });

    ipcMain.handle('get-user-data-path', () => {
        return app.getPath('userData');
    });

    ipcMain.handle('show-error-dialog', (_, { title, message }) => {
        return dialog.showErrorBox(title, message);
    });

    ipcMain.handle('show-message-dialog', (_, { title, message, type }) => {
        return dialog.showMessageBox(mainWindow, {
            title,
            message,
            type: type || 'info',
            buttons: ['Tamam']
        });
    });
};

/**
 * Uygulama Başlangıcı
 */
app.on('ready', () => {
    appIsReady = true;
    createWindow();
    createMenu();
    setupIPC();
    console.log('DDoS-BSO Tespiti Uygulaması Başlatıldı');
});

/**
 * Tüm Pencereler Kapatıldığında
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * Uygulama Etkinleştirildiğinde (macOS)
 */
app.on('activate', () => {
    if (mainWindow === null && appIsReady) {
        createWindow();
    }
});

/**
 * Özel İşlemleri Engelle
 */
app.on('web-contents-created', (event, contents) => {
    // Yeni pencereleri engelle
    contents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) {
            return { action: 'allow' };
        }
        return { action: 'deny' };
    });

    // İlk yükleme dışında navigasyonu engelle (güvenlik)
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== new URL(NEXT_URL).origin) {
            event.preventDefault();
        }
    });
});

/**
 * Hata Yönetimi
 */
process.on('uncaughtException', (error) => {
    console.error('Yakalanmayan İstisna:', error);
});
