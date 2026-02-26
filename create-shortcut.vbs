Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")

REM إنشاء اختصار على سطح المكتب
Set objLink = objShell.CreateShortcut(strDesktop & "\DDoS-BSO Tespiti.lnk")
objLink.TargetPath = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis\start-app.bat"
objLink.WorkingDirectory = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis"
objLink.IconLocation = "C:\Users\imiss\Desktop\DDoS-BSO-Thesis\public\icon.ico"
objLink.Description = "DDoS Saldırısı Tespiti - BSO-Hibrit Framework"
objLink.WindowStyle = 1
objLink.Save

REM رسالة النجاح
MsgBox "تم إنشاء اختصار على سطح المكتب!" & vbCrLf & "DDoS-BSO Tespiti", vbInformation, "نجاح"
