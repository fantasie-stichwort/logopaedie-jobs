import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Konfiguration
const OUTPUT_FILE = 'alle-dateien.txt';
const FOLDERS_TO_SCAN = ['src', 'public']; // Ordner, die durchsucht werden
const ROOT_FILES = ['astro.config.mjs', 'package.json', 'tailwind.config.mjs', 'tsconfig.json']; // Wichtige Einzeldateien
const EXTENSIONS = ['.astro', '.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.mjs', '.html', '.vue', '.svelte'];
const IGNORE_DIRS = ['node_modules', '.git', '.astro', 'dist', '.idx'];

// Helper für __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let output = '';

// Funktion zum Scannen von Ordnern
function scanDirectory(directory) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(file);
            if (EXTENSIONS.includes(ext)) {
                addFileToOutput(fullPath);
            }
        }
    });
}

// Funktion zum Hinzufügen einer Datei zum Output
function addFileToOutput(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Relativer Pfad für bessere Lesbarkeit
        const relativePath = path.relative(__dirname, filePath);
        
        output += `\n================================================================================\n`;
        output += `FILE: ${relativePath}\n`;
        output += `================================================================================\n`;
        output += content + `\n`;
        
        console.log(`Hinzugefügt: ${relativePath}`);
    } catch (err) {
        console.error(`Fehler beim Lesen von ${filePath}:`, err.message);
    }
}

// 1. Root-Dateien scannen
console.log('--- Starte Export ---');
ROOT_FILES.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        addFileToOutput(fullPath);
    }
});

// 2. Ordner scannen
FOLDERS_TO_SCAN.forEach(folder => {
    scanDirectory(path.join(__dirname, folder));
});

// 3. Datei schreiben
fs.writeFileSync(OUTPUT_FILE, output);
console.log(`\n✅ Fertig! Der gesamte Code wurde in '${OUTPUT_FILE}' gespeichert.`);