Function PostInstallHook
    MessageBox MB_YESNO "Set Electro as the default image viewer?" IDYES continue_installation IDNO skip_registration

    continue_installation:
    DetailPrint "Registering file associations."
    
    ; The APP_ASSOCIATE macro is comes bundled with Tauri v2.0's `installer.nsi` script.
    ; See: https://github.com/tauri-apps/tauri/tree/dev/crates/tauri-bundler/src/bundle/windows/nsis
    
    !insertmacro APP_ASSOCIATE "png" "Electro.PNGFile" "PNG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "apng" "Electro.APNGFile" "APNG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "avif" "Electro.AVIFFile" "AVIF File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "gif" "Electro.GIFFile" "GIF File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "jpg" "Electro.JPGFile" "JPG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "jpeg" "Electro.JPEGFile" "JPEG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "jfif" "Electro.JFIFFile" "JFIF File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "pjpeg" "Electro.PJPEGFile" "PJPEG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "pjp" "Electro.PJPFile" "PJP File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "svg" "Electro.SVGFile" "SVG File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "webp" "Electro.WEBPFile" "WEBP File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "bmp" "Electro.BMPFile" "BMP File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "ico" "Electro.ICOFile" "ICO File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'
    !insertmacro APP_ASSOCIATE "cur" "Electro.CURFile" "CUR File" "$INSTDIR\Electro.exe,0" "Open with Electro" '"$INSTDIR\Electro.exe" "%1"'

    Goto end_messagebox

    skip_registration:
    DetailPrint "Skipping file association registration."

    end_messagebox:
FunctionEnd

!macro NSIS_HOOK_POSTINSTALL
    Call PostInstallHook
!macroend
