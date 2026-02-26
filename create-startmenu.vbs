Set objShell = CreateObject("WScript.Shell")
strStartMenu = objShell.SpecialFolders("StartMenu")

REM إنشاء اختصار في Start Menu
Set objLink = objShell.CreateShortcut(strStartMenu & "\DDoS-BSO Tespiti.lnk")
objLink.TargetPath = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis\start-app.bat"
objLink.WorkingDirectory = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis"
objLink.IconLocation = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis\public\icon.ico"
objLink.Description = "DDoS Saldırısı Tespiti - BSO-Hibrit Framework"
objLink.WindowStyle = 1
objLink.Save

REM رسالة النجاح
MsgBox "تم إنشاء الاختصار في Start Menu!" & vbCrLf & "DDoS-BSO Tespiti", vbInformation, "نجاح"
