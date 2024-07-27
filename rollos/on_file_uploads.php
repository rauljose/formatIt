// https://www.php.net/manual/en/function.is-uploaded-file.php
// $_FILE error
// Max size
// sanitize name
// valid extension
// params: save path,  in/valid extensions, max size, replace or new with same name

function fileNameSafe($fileName):string {
    $name = preg_replace(
      '/_{2,}/S',
      '_',
      preg_replace('/[^a-z\p{L}0-9_\- .]/miuS',
        '_',
        ltrim(trim("$fileName"), './\\')
      )
    );
    $extension = strtolower(ltrim(strrchr($name, '.', false), '.'));
    $normalizeExtension = ['jpeg' => 'jpg'];
    return strrchr($name, '.', true) . $normalizeExtension[$extension] ?? $extension;
}



function fileNameExtensionValid() {
    $validExtension = [
      'xls' => 'Excel Spreadsheet',
      'xlsx' => 'Excel Open XML Spreadsheet',
      'csv' => 'Comma-Separated Values file',
      'pdf' => 'Portable Document Format',
      'doc' => 'Microsoft Word document',
      'docx' => 'Microsoft Word Open XML document',
      'odt' => 'OpenDocument Text document',
      'ods' => 'OpenDocument Spreadsheet',
      'odp' => 'OpenDocument Presentation',
      'txt' => 'Plain text file',
      'rtf' => 'Rich Text Format',
      'ppt' => 'PowerPoint presentation',
      'pptx' => 'PowerPoint Open XML presentation',
      'ppsx' => 'PowerPoint Open XML Slide Show',
      'jpg' => 'JPEG image',
      'png' => 'PNG image',
      'gif' => 'GIF image',
      'bmp' => 'Bitmap image file',
      'tif' => 'Tagged Image File',
      'tiff' => 'Tagged Image File Format',
      'ico' => 'Icon file format',
      'webp' => 'WebP image',
      'heic' => 'High Efficiency Image Format',
      'heif' => 'High Efficiency Image File Format',
      'mp3' => 'MP3 audio file',
      'mp4' => 'MPEG-4 video file',
      'avi' => 'Audio Video Interleave files',
      'mov' => 'Apple QuickTime Movie files',
      'wmv' => 'Windows Media Video files',
      'flv' => 'Flash Video files',
      'mkv' => 'Matroska Video files',
      'webm' => 'WebM files',
      'wav' => 'WAVE audio file',
      'ogg' => 'Ogg Vorbis audio files',
      'flac' => 'FLAC audio files',
      'aac' => 'Advanced Audio Codec files',
      'm4a' => 'M4A audio files',
      'json' => 'JavaScript Object Notation file',
      
      'css' => 'Cascading Style Sheets file'
    ];
    $danger = [
      'html' => 'HyperText Markup Language file',
      'office macros' => '',  
    ];
}
function fileNameExtensio() {
    $invalidExtension = [
      'php' => 'PHP script file',
      'js' => 'JavaScript script file',
      'mjs' => 'JavaScript module file',
      'ts' => 'TypeScript script file',
      'pl' => 'Perl script file',
      'class' => 'Java compiled file',
      'jar' => 'Java Archive',
      'so' => 'Shared library (Unix/Linux)',
      'sh' => 'Bash shell script',
      'dll' => 'Dynamic Link Library',
      'exe' => 'Windows executable file',
      'pif' => 'Program Information file (shortcut to program)',
      'application' => 'ClickOnce Deployment Manifest file',
      'htaccess' => 'Apache per directory configuration file',
      'gadget' => 'Windows Gadget file',
      'msc' => 'Microsoft Management Console Snap-in Control file',
      'ws' => 'Windows Script file',
      'bat' => 'Batch file for Windows',
      'cmd' => 'Command file for Windows NT',
      'ps1' => 'Windows PowerShell script file',
      'psm1' => 'Windows PowerShell module file',
      'psd1' => 'Windows PowerShell data file',
      'com' => 'DOS command file',
      'ddl' => 'Data Definition Language file',
      'vbs' => 'VBScript file',
      'vbe' => 'VBScript Encoded script file',
      'vb' => 'VBScript file or Any Visual Basic source',
      'wsf' => 'Windows Script file',
      'msi' => 'Windows Installer package',
      'scr' => 'Windows screen saver file',
      'sys' => 'Windows system file',
      'drv' => 'Device driver file',
      'vxd' => 'Virtual device driver',
      'cpl' => 'Windows Control Panel item',
      'ocx' => 'OLE Control Extension file',
      'html' => 'HyperText Markup Language file',
      'asp' => 'Active Server Pages script',
      'cer' => 'Internet Security Certificate file',
      'crt' => 'Security Certificate',
      'ins' => 'Internet Naming Service',
      'isp' => 'Internet Communication settings',
      'jse' => 'JScript Encoded Script file',
      'mst' => 'Windows Installer Setup Transform file',
      'psc1' => 'Windows PowerShell Console file',
      'ps1xml' => 'Windows PowerShell Format and Type Definitions',
      'ps2' => 'Windows PowerShell Script',
      'ps2xml' => 'Windows PowerShell Format and Type Definitions',
      'psc2' => 'Windows PowerShell Console file',
      'reg' => 'Registration Entries',
      'wsc' => 'Windows Script Component',
      'wsh' => 'Windows Script Host Settings file',
      
    ];

}
