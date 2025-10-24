// ============================================
// AL MISK JOB ORDER FORM - JAVASCRIPT
// ============================================

// Global variables
let uploadedFiles = [];
let autoSaveInterval;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    startAutoSave();
    updatePreview();
});

function initializeForm() {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;
    
    // Generate invoice number
    generateInvoiceNumber();
}

function setupEventListeners() {
    // Listen to all form inputs for live preview
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });
    
    // File upload handler
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    
    // JSON import handler
    document.getElementById('jsonImportInput').addEventListener('change', handleJSONImport);
}

// ============================================
// INVOICE NUMBER GENERATION
// ============================================
function generateInvoiceNumber() {
    // Get last invoice number from localStorage or start at 1252
    let lastInvoice = parseInt(localStorage.getItem('lastInvoiceNumber')) || 1251;
    lastInvoice++;
    localStorage.setItem('lastInvoiceNumber', lastInvoice);
    document.getElementById('invoiceNo').value = lastInvoice;
}

// ============================================
// FILE UPLOAD HANDLING
// ============================================
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedFiles.push({
                name: file.name,
                type: file.type,
                data: e.target.result
            });
            displayFilePreview();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
}

function displayFilePreview() {
    const container = document.getElementById('filePreviewContainer');
    container.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 p-2 bg-gray-50 rounded border';
        
        let previewHTML = '';
        if (file.type.startsWith('image/')) {
            previewHTML = `<img src="${file.data}" class="w-12 h-12 object-cover rounded">`;
        } else if (file.type === 'application/pdf') {
            previewHTML = `<div class="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-xs">PDF</div>`;
        }
        
        div.innerHTML = `
            ${previewHTML}
            <span class="text-xs flex-1 truncate">${file.name}</span>
            <button onclick="removeFile(${index})" class="text-red-600 hover:text-red-800 text-xs font-bold">✕</button>
        `;
        container.appendChild(div);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayFilePreview();
    updatePreview();
}

// ============================================
// FORM DATA COLLECTION
// ============================================
function collectFormData() {
    return {
        // Basic Info
        orderDate: document.getElementById('orderDate').value,
        invoiceNo: document.getElementById('invoiceNo').value,
        contactPerson: document.getElementById('contactPerson').value,
        telMob: document.getElementById('telMob').value,
        companyName: document.getElementById('companyName').value,
        quantity: document.getElementById('quantity').value,
        kindOfJob: document.getElementById('kindOfJob').value,
        
        // Printing Options
        offsetPrinting: document.getElementById('offsetPrinting').checked,
        digitalPrinting: document.getElementById('digitalPrinting').checked,
        
        // Lamination
        glossy: document.getElementById('glossy').checked,
        matt: document.getElementById('matt').checked,
        softTouch: document.getElementById('softTouch').checked,
        
        // Foiling
        goldFoil: document.getElementById('goldFoil').checked,
        silverFoil: document.getElementById('silverFoil').checked,
        roseGoldFoil: document.getElementById('roseGoldFoil').checked,
        blackFoil: document.getElementById('blackFoil').checked,
        
        // Die Cutting
        fullCut: document.getElementById('fullCut').checked,
        halfCut: document.getElementById('halfCut').checked,
        creasing: document.getElementById('creasing').checked,
        
        // Embossing
        embossing: document.getElementById('embossing').checked,
        dEmbossing: document.getElementById('dEmbossing').checked,
        spotUV: document.getElementById('spotUV').checked,
        
        // Foam Type
        pvc: document.getElementById('pvc').checked,
        velvet: document.getElementById('velvet').checked,
        pu: document.getElementById('pu').checked,
        
        // Paper Type
        grayBoard: document.getElementById('grayBoard').checked,
        grayBoardValue: document.getElementById('grayBoardValue').value,
        foodBoard: document.getElementById('foodBoard').checked,
        foodBoardValue: document.getElementById('foodBoardValue').value,
        artMatt: document.getElementById('artMatt').checked,
        artMattValue: document.getElementById('artMattValue').value,
        sticker: document.getElementById('sticker').checked,
        stickerValue: document.getElementById('stickerValue').value,
        specialPaper: document.getElementById('specialPaper').checked,
        specialPaperValue: document.getElementById('specialPaperValue').value,
        
        // Additional Info
        remarks: document.getElementById('remarks').value,
        manager: document.getElementById('manager').value,
        accountant: document.getElementById('accountant').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        
        // Files
        files: uploadedFiles
    };
}

// ============================================
// LIVE PREVIEW GENERATION
// ============================================
function updatePreview() {
    const data = collectFormData();
    const preview = document.getElementById('jobOrderPreview');
    
    preview.innerHTML = `
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #000;">
            <div style="flex: 1;">
                <h1 style="font-size: 14pt; font-weight: bold; margin: 0; line-height: 1.2;">AL MISK FOR CARTON BXS CON S P LLC</h1>
                <div style="font-size: 7pt; margin-top: 2px; line-height: 1.3;">
                    <p style="margin: 0;">📞 06-7420777 | 📱 055-1440633</p>
                    <p style="margin: 0;">📷 @almisk.boxes | ✉️ almiskboxes@gmail.com</p>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 18pt; font-weight: bold;">📦</div>
                <p style="font-size: 7pt; margin: 2px 0 0 0;">AL MISK</p>
            </div>
        </div>

        <div style="text-align: center; font-size: 10pt; font-weight: bold; margin-bottom: 6px;">
            JOB ORDER NO: ${data.invoiceNo || '______'}
        </div>

        <!-- Main Info Table -->
        <table class="form-table" style="font-size: 8pt; margin-bottom: 6px;">
            <tr>
                <td style="font-weight: bold; width: 15%;">Date:</td>
                <td style="width: 35%;">${data.orderDate || '_____________'}</td>
                <td style="font-weight: bold; width: 15%;">Invoice No.</td>
                <td style="width: 35%;">${data.invoiceNo || '_____________'}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Contact Person:</td>
                <td>${data.contactPerson || '_____________'}</td>
                <td style="font-weight: bold;">Tel/Mob:</td>
                <td>${data.telMob || '_____________'}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Company Name:</td>
                <td colspan="2">${data.companyName || '_____________'}</td>
                <td><strong>Qty:</strong> ${data.quantity || '___'}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Kind of Job:</td>
                <td colspan="3">${data.kindOfJob || '_____________'}</td>
            </tr>
        </table>

        <!-- Specifications Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 6px;">
            
            <!-- Left Column -->
            <div>
                <!-- Printing Type -->
                <table class="form-table" style="font-size: 8pt; margin-bottom: 4px;">
                    <tr>
                        <td style="font-weight: bold; width: 45%;">Offset Printing</td>
                        <td style="text-align: center; width: 15%;">${data.offsetPrinting ? '☑' : '☐'}</td>
                        <td style="font-weight: bold; width: 40%;">Digital Printing</td>
                        <td style="text-align: center;">${data.digitalPrinting ? '☑' : '☐'}</td>
                    </tr>
                </table>

                <!-- Lamination -->
                <table class="form-table" style="font-size: 8pt; margin-bottom: 4px;">
                    <tr>
                        <td style="font-weight: bold;">Lamination:</td>
                        <td style="text-align: center; width: 12%;">Glossy ${data.glossy ? '☑' : '☐'}</td>
                        <td style="text-align: center; width: 12%;">Matt ${data.matt ? '☑' : '☐'}</td>
                        <td style="text-align: center; width: 15%;">Soft touch ${data.softTouch ? '☑' : '☐'}</td>
                    </tr>
                </table>

                <!-- Foiling -->
                <table class="form-table" style="font-size: 8pt; margin-bottom: 4px;">
                    <tr>
                        <td style="font-weight: bold; width: 20%;">Foiling:</td>
                        <td style="text-align: center; width: 15%;">Gold ${data.goldFoil ? '☑' : '☐'}</td>
                        <td style="text-align: center; width: 15%;">Silver ${data.silverFoil ? '☑' : '☐'}</td>
                        <td style="text-align: center; width: 20%;">Rose Gold ${data.roseGoldFoil ? '☑' : '☐'}</td>
                        <td style="text-align: center;">Black ${data.blackFoil ? '☑' : '☐'}</td>
                    </tr>
                </table>

                <!-- Die Cutting -->
                <table class="form-table" style="font-size: 8pt; margin-bottom: 4px;">
                    <tr>
                        <td style="font-weight: bold; width: 25%;">Die Cutting:</td>
                        <td style="text-align: center;">Full Cut ${data.fullCut ? '☑' : '☐'}</td>
                        <td style="text-align: center;">Half Cut ${data.halfCut ? '☑' : '☐'}</td>
                        <td style="text-align: center;">Creasing ${data.creasing ? '☑' : '☐'}</td>
                    </tr>
                </table>

                <!-- Embossing -->
                <table class="form-table" style="font-size: 8pt; margin-bottom: 4px;">
                    <tr>
                        <td style="font-weight: bold; width: 25%;">Embossing:</td>
                        <td style="text-align: center;">${data.embossing ? '☑' : '☐'}</td>
                        <td style="font-weight: bold; width: 25%;">D Embossing</td>
                        <td style="text-align: center;">${data.dEmbossing ? '☑' : '☐'}</td>
                        <td style="font-weight: bold; width: 20%;">Spot UV</td>
                        <td style="text-align: center;">${data.spotUV ? '☑' : '☐'}</td>
                    </tr>
                </table>

                <!-- Foam Type -->
                <table class="form-table" style="font-size: 8pt;">
                    <tr>
                        <td style="font-weight: bold; width: 25%;">Foam Type:</td>
                        <td style="text-align: center;">PVC ${data.pvc ? '☑' : '☐'}</td>
                        <td style="text-align: center;">VELVET ${data.velvet ? '☑' : '☐'}</td>
                        <td style="text-align: center;">PU ${data.pu ? '☑' : '☐'}</td>
                    </tr>
                </table>
            </div>

            <!-- Right Column -->
            <div>
                <!-- Paper Type & Remarks -->
                <table class="form-table" style="font-size: 8pt; height: 100%;">
                    <tr>
                        <td colspan="2" style="font-weight: bold; background: #f0f0f0;">Paper Type:</td>
                        <td rowspan="6" style="font-weight: bold; width: 40%; vertical-align: top; background: #f0f0f0;">
                            <div style="padding: 2px;">Remarks:</div>
                            <div style="padding: 2px; font-weight: normal; min-height: 60px; white-space: pre-wrap;">${data.remarks || ''}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 30%;">Gray Board ${data.grayBoard ? '☑' : '☐'}</td>
                        <td>${data.grayBoardValue || ''}</td>
                    </tr>
                    <tr>
                        <td>Food Board ${data.foodBoard ? '☑' : '☐'}</td>
                        <td>${data.foodBoardValue || ''}</td>
                    </tr>
                    <tr>
                        <td>Art Matt ${data.artMatt ? '☑' : '☐'}</td>
                        <td>${data.artMattValue || ''}</td>
                    </tr>
                    <tr>
                        <td>Sticker ${data.sticker ? '☑' : '☐'}</td>
                        <td>${data.stickerValue || ''}</td>
                    </tr>
                    <tr>
                        <td>Special Paper ${data.specialPaper ? '☑' : '☐'}</td>
                        <td>${data.specialPaperValue || ''}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Uploaded Files -->
        ${generateFilePreviewHTML(data.files)}

        <!-- Bottom Section -->
        <table class="form-table" style="font-size: 7pt; margin-top: 6px;">
            <tr>
                <td style="font-weight: bold; width: 30%;">Manager (Production):</td>
                <td style="width: 35%;">${data.manager || '_____________'}</td>
                <td style="font-weight: bold; width: 15%;">Delivery Date:</td>
                <td>${data.deliveryDate || '_____________'}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Accountant:</td>
                <td colspan="3">${data.accountant || '_____________'}</td>
            </tr>
        </table>
    `;
}

function generateFilePreviewHTML(files) {
    if (!files || files.length === 0) return '';
    
    let html = '<div style="margin: 6px 0; text-align: center;">';
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            html += `<img src="${file.data}" class="file-preview" style="max-width: 100%; max-height: 70mm; margin: 2mm auto; display: block; border: 1px solid #ccc;">`;
        } else if (file.type === 'application/pdf') {
            html += `<embed src="${file.data}" type="application/pdf" style="width: 100%; height: 70mm; margin: 2mm auto; display: block; border: 1px solid #ccc;">`;
        }
    });
    
    html += '</div>';
    return html;
}

// ============================================
// SAVE & LOAD FUNCTIONS
// ============================================
function saveDraft() {
    const data = collectFormData();
    localStorage.setItem('jobOrderDraft', JSON.stringify(data));
    alert('✅ Draft saved successfully!');
}

function loadDraft() {
    const saved = localStorage.getItem('jobOrderDraft');
    if (!saved) {
        alert('❌ No saved draft found.');
        return;
    }
    
    const data = JSON.parse(saved);
    restoreFormData(data);
    alert('✅ Draft loaded successfully!');
}

function restoreFormData(data) {
    // Basic Info
    document.getElementById('orderDate').value = data.orderDate || '';
    document.getElementById('invoiceNo').value = data.invoiceNo || '';
    document.getElementById('contactPerson').value = data.contactPerson || '';
    document.getElementById('telMob').value = data.telMob || '';
    document.getElementById('companyName').value = data.companyName || '';
    document.getElementById('quantity').value = data.quantity || '';
    document.getElementById('kindOfJob').value = data.kindOfJob || '';
    
    // Checkboxes
    document.getElementById('offsetPrinting').checked = data.offsetPrinting || false;
    document.getElementById('digitalPrinting').checked = data.digitalPrinting || false;
    document.getElementById('glossy').checked = data.glossy || false;
    document.getElementById('matt').checked = data.matt || false;
    document.getElementById('softTouch').checked = data.softTouch || false;
    document.getElementById('goldFoil').checked = data.goldFoil || false;
    document.getElementById('silverFoil').checked = data.silverFoil || false;
    document.getElementById('roseGoldFoil').checked = data.roseGoldFoil || false;
    document.getElementById('blackFoil').checked = data.blackFoil || false;
    document.getElementById('fullCut').checked = data.fullCut || false;
    document.getElementById('halfCut').checked = data.halfCut || false;
    document.getElementById('creasing').checked = data.creasing || false;
    document.getElementById('embossing').checked = data.embossing || false;
    document.getElementById('dEmbossing').checked = data.dEmbossing || false;
    document.getElementById('spotUV').checked = data.spotUV || false;
    document.getElementById('pvc').checked = data.pvc || false;
    document.getElementById('velvet').checked = data.velvet || false;
    document.getElementById('pu').checked = data.pu || false;
    document.getElementById('grayBoard').checked = data.grayBoard || false;
    document.getElementById('foodBoard').checked = data.foodBoard || false;
    document.getElementById('artMatt').checked = data.artMatt || false;
    document.getElementById('sticker').checked = data.sticker || false;
    document.getElementById('specialPaper').checked = data.specialPaper || false;
    
    // Paper values
    document.getElementById('grayBoardValue').value = data.grayBoardValue || '';
    document.getElementById('foodBoardValue').value = data.foodBoardValue || '';
    document.getElementById('artMattValue').value = data.artMattValue || '';
    document.getElementById('stickerValue').value = data.stickerValue || '';
    document.getElementById('specialPaperValue').value = data.specialPaperValue || '';
    
    // Additional Info
    document.getElementById('remarks').value = data.remarks || '';
    document.getElementById('manager').value = data.manager || '';
    document.getElementById('accountant').value = data.accountant || '';
    document.getElementById('deliveryDate').value = data.deliveryDate || '';
    
    // Files
    if (data.files) {
        uploadedFiles = data.files;
        displayFilePreview();
    }
    
    updatePreview();
}

function clearForm() {
    if (!confirm('⚠️ Are you sure you want to clear all fields?')) {
        return;
    }
    
    // Clear all inputs
    document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], textarea').forEach(input => {
        if (input.id !== 'invoiceNo') { // Keep invoice number
            input.value = '';
        }
    });
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear files
    uploadedFiles = [];
    document.getElementById('fileUpload').value = '';
    displayFilePreview();
    
    // Reset date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;
    
    updatePreview();
    alert('✅ Form cleared!');
}

// ============================================
// EXPORT & IMPORT JSON
// ============================================
function exportJSON() {
    const data = collectFormData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-order-${data.invoiceNo || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importJSON() {
    document.getElementById('jsonImportInput').click();
}

function handleJSONImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            restoreFormData(data);
            alert('✅ JSON imported successfully!');
        } catch (error) {
            alert('❌ Error importing JSON: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

// ============================================
// PRINT FUNCTIONS
// ============================================
function printColor() {
    document.body.classList.remove('bw-print');
    window.print();
}

function printBW() {
    document.body.classList.add('bw-print');
    window.print();
    // Remove class after print dialog closes
    setTimeout(() => {
        document.body.classList.remove('bw-print');
    }, 1000);
}

// ============================================
// PDF GENERATION
// ============================================
function generatePDF() {
    const element = document.getElementById('jobOrderPreview');
    const opt = {
        margin: 10,
        filename: `job-order-${document.getElementById('invoiceNo').value || 'document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// ============================================
// AUTO-SAVE FUNCTIONALITY
// ============================================
function startAutoSave() {
    // Auto-save every 30 seconds
    autoSaveInterval = setInterval(() => {
        const data = collectFormData();
        localStorage.setItem('jobOrderAutoSave', JSON.stringify(data));
        console.log('✅ Auto-saved at ' + new Date().toLocaleTimeString());
    }, 30000);
}

// Load auto-save on page load
window.addEventListener('load', function() {
    const autoSaved = localStorage.getItem('jobOrderAutoSave');
    if (autoSaved && !localStorage.getItem('jobOrderDraft')) {
        if (confirm('🔄 Found auto-saved data. Would you like to restore it?')) {
            const data = JSON.parse(autoSaved);
            restoreFormData(data);
        }
    }
});
