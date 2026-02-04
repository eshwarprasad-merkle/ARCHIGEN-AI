
const dropdowns = ['Country', 'cloudStack', 'Welldefined', 'involvesML', 'unstructuredData', 'storagesolution'];
const checkmarks = ['check1', 'check2', 'check3', 'check4', 'check5', 'check6'];
const progressFill = document.getElementById('progressFill');
const matrixContainer = document.getElementById('matrixContainer');
const jsonContainer = document.getElementById('jsonContainer');
const header = document.getElementById('header');
const matrixBody = document.getElementById('matrixBody');
const jsonCode = document.getElementById('jsonCode');

// Tech Stack variables
let selectedStack = [];

// Reset all form fields on page load
selectedStack = [];

if (progressFill) {
    progressFill.style.width = '0%';
    progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
}
if (matrixContainer) {
    matrixContainer.classList.remove('show');
}
if (jsonContainer) {
    jsonContainer.classList.remove('show');
}

// Reset tech input
const techInput = document.querySelector('.tech-input');
if (techInput) {
    techInput.value = '';
}

// Reset tech summary
const techSummary = document.getElementById('techSummary');
if (techSummary) {
    techSummary.textContent = '0 technologies';
}

// Update progress bar based on completed dropdowns
function updateProgress() {
    let completed = 0;
    dropdowns.forEach(id => {
        if (document.getElementById(id).value) {
            completed++;
        }
    });

    const percentage = (completed / dropdowns.length) * 100;
    progressFill.style.width = percentage + '%';
    
    // Add visual feedback when complete
    if (completed === dropdowns.length) {
        progressFill.style.background = 'linear-gradient(90deg, #00ff88 0%, #4CAF50 100%)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
    }
}

// Add event listeners to all dropdowns
dropdowns.forEach((id, index) => {
    document.getElementById(id).addEventListener('change', function () {
        const checkmark = document.getElementById(checkmarks[index]);
        if (this.value) {
            checkmark.classList.add('show');
        } else {
            checkmark.classList.remove('show');
        }
        
        updateProgress();
    });
});

// Populate matrix table with data
function populateMatrix(data) {
    matrixBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        console.error('No data to populate matrix');
        return;
    }
    
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.dataset.rowIndex = index;
        
        // Backend structure: [rank, score, cloud, sourcetype, mode, datalake, dataingestion, tools, workflow, involvesml, welldefined]
        // Desired order: Rank, Cloud, Source Type, Mode, Data Ingestion, Workflow Orchestration, Data Transformation (tools), Data Lake/Warehouse
        
        // Reorder columns to match your requirements
        const reorderedRow = [
            row[0],  // Rank
            row[2],  // Cloud
            row[3],  // Source Type
            row[4],  // Mode
            row[6],  // Data Ingestion
            row[8],  // Workflow Orchestration
            row[7],  // Data Transformation (tools)
            row[5],  // Data Lake/Warehouse
        ];
        
        // Add cells in the new order
        reorderedRow.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        
        // Add click handler for row selection - pass original row data
        tr.addEventListener('click', function() {
            handleRowSelection(this, row);
        });
        
        matrixBody.appendChild(tr);
    });
}

// Helper function to convert basic Markdown to HTML
function parseMarkdown(text) {
    if (!text) return '';
    
    // Convert **bold** to <strong>bold</strong> (handle multi-line and special chars)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>italic</em> (only single asterisks not part of **)
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert #### Headers
    text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert numbered lists (1. item)
    text = text.replace(/^\d+\.\s+(.*)$/gim, '<li>$1</li>');
    
    // Convert bullet lists (- item or * item)
    text = text.replace(/^[\-\*]\s+(.*)$/gim, '<li>$1</li>');
    
    // Wrap consecutive <li> tags in <ul>
    text = text.replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');
    
    // Convert double line breaks to paragraphs
    text = text.split('\n\n').map(para => {
        if (para.trim() && !para.startsWith('<h') && !para.startsWith('<ul') && !para.startsWith('<li')) {
            return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
        }
        return para;
    }).join('\n');
    
    return text;
}

// Handle row selection and JSON display
function handleRowSelection(rowElement, rowData) {
    // Remove previous selection
    const previousSelected = matrixBody.querySelector('tr.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Add selection to clicked row
    rowElement.classList.add('selected');
    
    // Create JSON object matching your backend structure
    // rowData: [rank, score, cloud, sourcetype, mode, datalake, dataingestion, tools, workflow, involvesml, welldefined]
    const jsonData = {
        rank: rowData[0],
        cloud: rowData[2],
        source_type: rowData[3],
        mode: rowData[4],
        data_ingestion: rowData[6],
        workflow_orchestration: rowData[8],
        data_transformation: rowData[7],
        datalake_warehouse: rowData[5],
        score: rowData[1],
        involves_ml: rowData[9],
        well_defined: rowData[10]
    };
    
    // Show loading state while fetching from Gemini - USE innerHTML
    jsonCode.innerHTML = '<p style="text-align: center; color: #4CAF50;"><strong>⏳ Generating architecture details...</strong></p><p>Please wait while we create a comprehensive architecture explanation for your selected configuration.</p>';
    jsonContainer.classList.add('show');
    
    // Scroll to JSON container
    setTimeout(() => {
        jsonContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    console.log('Selected architecture:', jsonData);
    
    // Call Gemini to get detailed architecture explanation
    fetch('http://localhost:8000/gemini-conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Gemini API response:', data);
        
        // Display the Gemini-generated architecture explanation
        if (data.response) {
            // Parse Markdown and render as HTML - USE innerHTML
            const htmlContent = parseMarkdown(data.response);
            jsonCode.innerHTML = htmlContent;
            console.log('Architecture Details:', data.response);
        } else {
            jsonCode.innerHTML = '<p style="color: #ff9800;">No architecture details received from the server.</p>';
        }
    })
    .catch(error => {
        console.error('Gemini API error:', error);
        jsonCode.innerHTML = `<p style="color: #f44336;"><strong>❌ Error generating architecture details:</strong></p><p>${error.message}</p><p>Please try again or check the console for more details.</p>`;
    });
}


// Handle Go button click - ONLY API CALLS
// Note: Go button was removed from UI, but keeping code for reference
const goButton = document.getElementById('goButton');
if (goButton) {
    goButton.addEventListener('click', function () {
    const selections = {
        country: document.getElementById('Country').value,
        cloud: document.getElementById('cloudStack').value,
        well_defined_use_case: document.getElementById('Welldefined').value,
        involves_ml: document.getElementById('involvesML').value,
        source_type: document.getElementById('sourceType').value,
        mode: document.getElementById('dataIngestion').value,
        confirmed_tools: document.getElementById('etlTool').value,
    };

    console.log('Submitting selections:', selections);

    goButton.disabled = true;
    const originalText = goButton.textContent;
    goButton.textContent = '⏳ Processing...';

    // Minimize header
    header.classList.add('minimized');
    
    // Show matrix container
    matrixContainer.classList.add('show');
    
    // Scroll to Tech Stack Selection section
    const techstackContainer = document.querySelector('.techstack-container');
    setTimeout(() => {
        techstackContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Reset button after delay
    setTimeout(() => {
        goButton.disabled = false;
        goButton.textContent = originalText;
    }, 1500);
    });
}

// ===== TECH STACK SELECTION FUNCTIONALITY =====

// Available technologies for autocomplete
const availableTechs = [
    'Apache Spark',
    'Apache Kafka',
    'Apache Airflow',
    'Hadoop',
    'Python',
    'Scala',
    'SQL',
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Databricks',
    'Glue',
    'EMR',
    'AWS Batch',
    'AWS Data Pipeline',
    'Lake Formation',
    'Athena ETL',
    'Flink on Kinesis',
    'Data Factory',
    'Synapse Dataflow',
    'SSIS',
    'Azure Stream Analytics',
    'Fabric Pipelines',
    'Dataproc',
    'Dataflow',
    'Cloud Composer Operators',
    'Vertex AI Pipelines',
    'Flink on Dataflow',
    'Databricks Delta Lake',
    'Apache NiFi',
    'Apache Beam',
    'Talend',
    'Informatica',
    'KNIME',
    'RapidMiner',
    'TensorFlow',
    'PyTorch',
    'Scikit-learn',
    'Java',
    'JavaScript',
    'Node.js',
    'Spring Boot',
    'FastAPI',
    'GraphQL',
    'REST',
    'gRPC'
];

const techInputsContainer = document.getElementById('techInputs');
let inputIndex = 0;

// Function to show suggestions dropdown
function showSuggestions(inputElement, suggestions) {
    const wrapper = inputElement.closest('.tech-input-wrapper');
    const suggestionsDiv = wrapper.querySelector('.tech-suggestions');
    const suggestionsList = suggestionsDiv.querySelector('.suggestions-list');
    
    if (!suggestions || suggestions.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsList.innerHTML = suggestions.map((tech, index) => `
        <li class="suggestion-item" data-tech="${tech}" data-index="${index}">${tech}</li>
    `).join('');
    
    suggestionsDiv.style.display = 'block';
    
    let highlightedIndex = -1;
    
    // Add click handlers to suggestions
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach((item, idx) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const selectedTech = this.dataset.tech;
            addTechToStack(selectedTech, inputElement);
            suggestionsDiv.style.display = 'none';
        }, true);
    });
    
    // Add keyboard navigation
    const keydownHandler = function(e) {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        const itemCount = items.length;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = (highlightedIndex + 1) % itemCount;
            updateHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = highlightedIndex <= 0 ? itemCount - 1 : highlightedIndex - 1;
            updateHighlight();
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            const selectedItem = items[highlightedIndex];
            const selectedTech = selectedItem.dataset.tech;
            addTechToStack(selectedTech, inputElement);
            suggestionsDiv.style.display = 'none';
            inputElement.removeEventListener('keydown', keydownHandler);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            suggestionsDiv.style.display = 'none';
            inputElement.removeEventListener('keydown', keydownHandler);
        }
    };
    
    function updateHighlight() {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        items.forEach((item, idx) => {
            if (idx === highlightedIndex) {
                item.classList.add('highlighted');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('highlighted');
            }
        });
    }
    
    inputElement.addEventListener('keydown', keydownHandler);
}

// Hide all suggestion dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.closest('.suggestion-item')) {
        return;
    }
    
    if (!e.target.closest('.tech-input-wrapper')) {
        document.querySelectorAll('.tech-suggestions').forEach(div => {
            div.style.display = 'none';
        });
    }
}, false);

// Function to add technology to the selected stack
function addTechToStack(tech, inputElement) {
    const trimmedTech = tech.trim();
    
    if (!trimmedTech) {
        return;
    }
    
    // Check if tech is in the available list
    const validTech = availableTechs.find(t => t.toLowerCase() === trimmedTech.toLowerCase());
    
    if (!validTech) {
        return;
    }
    
    // Check if already added
    if (selectedStack.some(t => t.toLowerCase() === validTech.toLowerCase())) {
        return;
    }
    
    selectedStack.push(validTech);
    inputElement.value = '';
    updateTechSummary();
    
    // Hide suggestions
    const wrapper = inputElement.closest('.tech-input-wrapper');
    const suggestionsDiv = wrapper.querySelector('.tech-suggestions');
    suggestionsDiv.style.display = 'none';
}

// Function to update the tech summary display
function updateTechSummary() {
    const techSummary = document.getElementById('techSummary');
    const count = selectedStack.length;
    
    if (count === 0) {
        techSummary.textContent = '0 technologies';
    } else {
        techSummary.textContent = selectedStack.join(', ');
    }
}

// Function to filter suggestions based on input
function getFilteredSuggestions(query) {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return availableTechs.filter(tech => 
        tech.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 suggestions
}

// Function to attach input listeners
function attachInputListeners(inputElement) {
    inputElement.addEventListener('input', function(e) {
        const query = this.value;
        const suggestions = getFilteredSuggestions(query);
        showSuggestions(this, suggestions);
    });
    
    inputElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const suggestions = getFilteredSuggestions(this.value);
            if (suggestions.length > 0) {
                addTechToStack(suggestions[0], this);
                const wrapper = this.closest('.tech-input-wrapper');
                const suggestionsDiv = wrapper.querySelector('.tech-suggestions');
                suggestionsDiv.style.display = 'none';
            }
        }
    });
    
    inputElement.addEventListener('blur', function(e) {
        const wrapper = this.closest('.tech-input-wrapper');
        const suggestionsDiv = wrapper.querySelector('.tech-suggestions');
        suggestionsDiv.style.display = 'none';
    });
}

// Attach listeners to initial input
const techInputElements = document.querySelectorAll('.tech-input-group');

document.querySelectorAll('.tech-input-group').forEach((group, idx) => {
    const input = group.querySelector('.tech-input');
    if (input) {
        attachInputListeners(input);
    }
});

// ===== SOURCE DETAILS SECTION FUNCTIONALITY =====

const sourceTypeDropdown = document.getElementById('sourceTypeDropdown');
const modeDropdown = document.getElementById('modeDropdown');
const varietyDropdown = document.getElementById('varietyDropdown');
const addRowBtn = document.getElementById('addRowBtn');
const sourceTableBody = document.getElementById('sourceTableBody');
const sourceDetailsContainer = document.getElementById('sourceDetailsContainer');
let sourceDetailsData = [];

// Auto-select Mode based on Source Type
sourceTypeDropdown.addEventListener('change', function() {
    const selectedSourceTypes = Array.from(this.selectedOptions).map(opt => opt.value);
    
    // Get mode options
    const batchOption = Array.from(modeDropdown.options).find(opt => opt.value === 'Batch');
    const realtimeOption = Array.from(modeDropdown.options).find(opt => opt.value === 'Real-Time');
    
    // Reset mode first
    modeDropdown.selectedIndex = -1;
    
    // Auto-select and disable based on source type
    if (selectedSourceTypes.includes('API Call')) {
        // For API Call: Select Batch, disable Real-Time
        if (batchOption) {
            batchOption.selected = true;
            batchOption.disabled = false;
        }
        if (realtimeOption) {
            realtimeOption.selected = false;
            realtimeOption.disabled = true;
        }
    } else if (selectedSourceTypes.includes('API Publisher') || selectedSourceTypes.includes('IOT')) {
        // For API Publisher or IOT: Select Real-Time, disable Batch
        if (realtimeOption) {
            realtimeOption.selected = true;
            realtimeOption.disabled = false;
        }
        if (batchOption) {
            batchOption.selected = false;
            batchOption.disabled = true;
        }
    } else {
        // For other source types: Enable both modes
        if (batchOption) {
            batchOption.disabled = false;
        }
        if (realtimeOption) {
            realtimeOption.disabled = false;
        }
    }
    
    updateAddButtonState();
});

// Enable/disable Add button when selections are made
function updateAddButtonState() {
    const hasSourceType = sourceTypeDropdown.selectedOptions.length > 0;
    const hasMode = modeDropdown.selectedOptions.length > 0;
    const hasVariety = varietyDropdown.selectedOptions.length > 0;
    addRowBtn.disabled = !(hasSourceType && hasMode && hasVariety);
}

sourceTypeDropdown.addEventListener('change', updateAddButtonState);
modeDropdown.addEventListener('change', updateAddButtonState);
varietyDropdown.addEventListener('change', updateAddButtonState);

// Get selected values from multi-select dropdowns
function getSelectedValues(selectElement) {
    return Array.from(selectElement.selectedOptions).map(option => option.value);
}

// Add row to source details table
addRowBtn.addEventListener('click', function() {
    const sourceTypes = getSelectedValues(sourceTypeDropdown);
    const modes = getSelectedValues(modeDropdown);
    const varieties = getSelectedValues(varietyDropdown);

    // Create combinations of all selected options
    const combinations = [];
    for (let sourceType of sourceTypes) {
        for (let mode of modes) {
            for (let variety of varieties) {
                combinations.push({
                    sourceType: sourceType,
                    mode: mode,
                    variety: variety
                });
            }
        }
    }

    // Add combinations to data array
    combinations.forEach(combo => {
        sourceDetailsData.push(combo);
    });

    // Update table display
    updateSourceDetailsTable();

    // Show success feedback
    const originalBtn = addRowBtn.textContent;
    addRowBtn.textContent = '✓ Added!';
    addRowBtn.style.background = 'rgba(0, 255, 136, 0.15)';
    addRowBtn.style.color = '#00ff88';
    
    setTimeout(() => {
        addRowBtn.textContent = originalBtn;
        addRowBtn.style.background = 'rgba(102, 126, 234, 0.15)';
        addRowBtn.style.color = '#667eea';
    }, 1000);

    // Reset selections
    sourceTypeDropdown.selectedIndex = -1;
    modeDropdown.selectedIndex = -1;
    varietyDropdown.selectedIndex = -1;
    updateAddButtonState();

    // Auto-show matrix when data is added
    if (sourceDetailsData.length > 0) {
        setTimeout(() => {
            matrixContainer.classList.add('show');
            matrixContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }
});

// Update source details table display
function updateSourceDetailsTable() {
    sourceTableBody.innerHTML = sourceDetailsData.map((item, index) => `
        <tr data-index="${index}" style="animation: slideInScale 0.3s ease;">
            <td>${item.sourceType}</td>
            <td>${item.mode}</td>
            <td>${item.variety}</td>
            <td>
                <button class="remove-source-row-btn" data-index="${index}" title="Remove this row">×</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-source-row-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const row = this.closest('tr');
            
            // Fade out animation before removing
            row.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                sourceDetailsData.splice(index, 1);
                updateSourceDetailsTable();
            }, 300);
        });
    });
}

// ===== COMPREHENSIVE DEBUGGING & TESTING FUNCTIONS =====

/**
 * Run comprehensive tests to verify all script functionality
 * Used by both the integrated debug panel in index.html and console diagnostics
 */
function runComprehensiveTests() {
    console.clear();
    console.log('========================================');
    console.log('ArchiGenAI - Comprehensive Script Test');
    console.log('========================================\n');

    // TEST 1: Verify script loaded
    console.log('TEST 1: Script Loading');
    console.log('---------------------');
    if (typeof availableTechs !== 'undefined') {
        console.log('✓ availableTechs loaded:', availableTechs.length, 'technologies');
        console.log('  Sample:', availableTechs.slice(0, 3).join(', '), '...');
    } else {
        console.log('✗ FAILED: availableTechs not found');
    }

    // TEST 2: Verify functions exist
    console.log('\nTEST 2: Function Definitions');
    console.log('----------------------------');
    console.log(typeof showSuggestions === 'function' ? '✓ showSuggestions' : '✗ showSuggestions missing');
    console.log(typeof attachInputListeners === 'function' ? '✓ attachInputListeners' : '✗ attachInputListeners missing');
    console.log(typeof getFilteredSuggestions === 'function' ? '✓ getFilteredSuggestions' : '✗ getFilteredSuggestions missing');
    console.log(typeof updateTechSummary === 'function' ? '✓ updateTechSummary' : '✗ updateTechSummary missing');
    console.log(typeof addTechToStack === 'function' ? '✓ addTechToStack' : '✗ addTechToStack missing');

    // TEST 3: Test autocomplete filtering
    console.log('\nTEST 3: Autocomplete Filtering');
    console.log('-----------------------------');
    const testQueries = [
        { query: 'air', expected: 'Apache Airflow' },
        { query: 'spark', expected: 'Apache Spark' },
        { query: 'kafka', expected: 'Apache Kafka' }
    ];

    testQueries.forEach(test => {
        const results = getFilteredSuggestions(test.query);
        const found = results.includes(test.expected);
        console.log(`${found ? '✓' : '✗'} "${test.query}" -> ${results.join(', ')}`);
    });

    // TEST 4: Verify DOM elements
    console.log('\nTEST 4: DOM Elements');
    console.log('-------------------');
    const elements = {
        'involvesML dropdown': document.getElementById('involvesML'),
        'storagesolution dropdown': document.getElementById('storagesolution'),
        'tech input': document.querySelector('.tech-input'),
        'tech suggestions': document.querySelector('.tech-suggestions'),
        'progress bar': document.getElementById('progressFill'),
        'tech summary': document.getElementById('techSummary')
    };

    Object.entries(elements).forEach(([name, el]) => {
        console.log(`${el ? '✓' : '✗'} ${name}`);
    });

    console.log('\n========================================');
    console.log('Test Summary: Check console above');
    console.log('========================================');
}

// ===== FINAL ACTION BUTTONS =====

// Reset Button - Clear everything
const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', function() {
        // Clear all dropdowns
        dropdowns.forEach((id, index) => {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.value = '';
                dropdown.selectedIndex = 0;
            }
            const checkmark = document.getElementById(checkmarks[index]);
            if (checkmark) {
                checkmark.classList.remove('show');
            }
        });

        // Clear tech stack
        selectedStack = [];
        const techInput = document.querySelector('.tech-input');
        if (techInput) {
            techInput.value = '';
        }
        const techSummary = document.getElementById('techSummary');
        if (techSummary) {
            techSummary.textContent = '0 technologies';
        }
        
        // Clear source details
        sourceDetailsData = [];
        updateSourceDetailsTable();
        
        // Clear matrix and JSON
        if (matrixBody) {
            matrixBody.innerHTML = '';
        }
        if (jsonCode) {
            jsonCode.textContent = '';
        }
        
        // Reset progress bar
        if (progressFill) {
            progressFill.style.width = '0%';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Final Go Button - Submit configuration

// const finalGoButton = document.getElementById('finalGoButton');
// if (finalGoButton) {
//     finalGoButton.addEventListener('click', function() {
//         // Collect all form data
//         const formData = {
//             country: document.getElementById('Country').value,
//             cloudStack: document.getElementById('cloudStack').value,
//             wellDefined: document.getElementById('Welldefined').value,
//             involvesML: document.getElementById('involvesML').value,
//             unstructuredData: document.getElementById('unstructuredData').value,
//             storageSolution: document.getElementById('storagesolution').value,
//             technologies: selectedStack,
//             sourceDetails: sourceDetailsData
//         };

//         // Log the submission (in a real app, this would send to backend)
//         console.log('Configuration Submitted:', formData);


// const finalGoButton = document.getElementById('finalGoButton');
// if (finalGoButton) {
//     finalGoButton.addEventListener('click', function() {
//         // Collect all form data
//         const formData = {
//             country: document.getElementById('Country').value,
//             cloudStack: document.getElementById('cloudStack').value,
//             wellDefined: document.getElementById('Welldefined').value,
//             involvesML: document.getElementById('involvesML').value,
//             unstructuredData: document.getElementById('unstructuredData').value,
//             storageSolution: document.getElementById('storagesolution').value,
//             technologies: selectedStack,
//             sourceDetails: sourceDetailsData
//         };

//         // Log the submission (in a real app, this would send to backend)
//         console.log('Configuration Submitted:', formData);
//         console.log('Cloud Stack:', formData.cloudStack);
//         console.log('Storage Solution:', formData.storageSolution);
//     })};

// const finalGoButton = document.getElementById('finalGoButton');
// if (finalGoButton) {
//     finalGoButton.addEventListener('click', function() {
//         // Collect all form data
//         const formData = {
//             country: document.getElementById('Country').value,
//             cloudStack: document.getElementById('cloudStack').value,
//             wellDefined: document.getElementById('Welldefined').value,
//             involvesML: document.getElementById('involvesML').value,
//             unstructuredData: document.getElementById('unstructuredData').value,
//             storageSolution: document.getElementById('storagesolution').value,
//             technologies: selectedStack,
//             sourceDetails: sourceDetailsData
//         };

//         // Log to console
//         console.log('===================');
//         console.log('Configuration Submitted:', formData);
//         console.log('Cloud Stack:', formData.cloudStack);
//         console.log('Storage Solution:', formData.storageSolution);
//         console.log('===================');

//         // Provide visual feedback
//         const originalText = finalGoButton.textContent;
//         finalGoButton.textContent = '✓ Submitted';
//         finalGoButton.style.background = 'linear-gradient(135deg, #00c896 0%, #00a86b 100%)';
        
//         setTimeout(() => {
//             finalGoButton.textContent = originalText;
//             finalGoButton.style.background = '';
//         }, 2000);
//     });
// }

//Final API populating results
// function populateAPIResultsTable(data) {
//     const apiResultsBody = document.getElementById('apiResultsBody');
//     apiResultsBody.innerHTML = '';

//     if (!data || data.length === 0) {
//         const tr = document.createElement('tr');
//         tr.innerHTML = '<td colspan="6" style="text-align: center; padding: 20px;">No results found</td>';
//         apiResultsBody.appendChild(tr);
//         return;
//     }

//     data.forEach((item, index) => {
//         const tr = document.createElement('tr');
//         tr.style.animation = `slideInScale 0.3s ease ${index * 0.05}s both`;
        
//         tr.innerHTML = `
//             <td>${item.cloud || 'N/A'}</td>
//             <td>${item.service || 'N/A'}</td>
//             <td>${item.tool || 'N/A'}</td>
//             <td>${item.description || 'N/A'}</td>
//             <td>${item.mode || 'N/A'}</td>
//             <td>${item.source_type || 'N/A'}</td>
//         `;
        
//         apiResultsBody.appendChild(tr);
//     });
// }

// const finalGoButton = document.getElementById('finalGoButton');
// if (finalGoButton) {
//     finalGoButton.addEventListener('click', async function() {
//         // Collect all form data
//         const formData = {
//             country: document.getElementById('Country').value,
//             cloudStack: document.getElementById('cloudStack').value,
//             wellDefined: document.getElementById('Welldefined').value,
//             involvesML: document.getElementById('involvesML').value,
//             unstructuredData: document.getElementById('unstructuredData').value,
//             storageSolution: document.getElementById('storagesolution').value,
//             technologies: selectedStack,
//             sourceDetails: sourceDetailsData
//         };

//         // Get selected cloud from dropdown
//         const cloudValue = document.getElementById("cloudStack").value;

//         if (!cloudValue) {
//             alert("Please select a Cloud Stack first!");
//             return;
//         }

//         // Log to console
//         console.log('===================');
//         console.log('Configuration Submitted:', formData);
//         console.log('Cloud Stack:', formData.cloudStack);
//         console.log('Storage Solution:', formData.storageSolution);
//         console.log('===================');

//         // Provide visual feedback
//         const originalText = finalGoButton.textContent;
//         finalGoButton.textContent = '⏳ Fetching Results...';
//         finalGoButton.disabled = true;

//         try {
//             // Call Flask API with cloud input
//             const response = await fetch(
//                 `http://127.0.0.1:5000/api/techstack?cloud=${cloudValue}`
//             );

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             console.log("Tech Stack Results:", data);

//             // Populate the table with results
//             populateAPIResultsTable(data);

//             // Show the results container
//             const apiResultsContainer = document.getElementById('apiResultsContainer');
//             apiResultsContainer.classList.add('show');

//             // Scroll to results
//             setTimeout(() => {
//                 apiResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }, 300);

//             // Success feedback
//             finalGoButton.textContent = '✓ Results Loaded';
//             finalGoButton.style.background = 'linear-gradient(135deg, #00c896 0%, #00a86b 100%)';
            
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             alert("Backend error. Please check console and make sure the server is running.");
            
//             finalGoButton.textContent = originalText;
//             finalGoButton.style.background = '';
//         } finally {
//             setTimeout(() => {
//                 finalGoButton.textContent = originalText;
//                 finalGoButton.style.background = '';
//                 finalGoButton.disabled = false;
//             }, 2000);
//         }
//     });
// }



// ===== FIX FOR API RESULTS TABLE =====

/**
 * CORRECTED: Populate API results table with proper null handling
 */
function populateAPIResultsTable(data) {
    const apiResultsBody = document.getElementById('apiResultsBody');
    const apiResultsContainer = document.getElementById('apiResultsContainer');
    
    if (!apiResultsBody) {
        console.error('❌ apiResultsBody element not found');
        return;
    }
    
    // Clear existing rows
    apiResultsBody.innerHTML = '';

    console.log('📊 Populating table with data:', data);
    console.log('📊 Data length:', data.length);

    if (!data || data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align: center; padding: 20px; color: #888;">No results found</td>';
        apiResultsBody.appendChild(tr);
        return;
    }

    // Populate each row
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.style.animation = `slideInScale 0.3s ease ${index * 0.05}s both`;
        
        // Handle null values properly
        const cloud = item.cloud || 'null';
        const service = item.service || 'null';
        const tool = item.tool || item.description || 'null'; // Use description as fallback
        const description = item.description || 'null';
        const mode = item.mode || 'null';
        const sourceType = item.source_type || 'null';
        
        tr.innerHTML = `
            <td>${cloud}</td>
            <td>${service}</td>
            <td>${sourceType}</td>
            <td>${mode}</td>
            <td>${tool}</td>
            <td>${description}</td>
           
            
        `;
        
        apiResultsBody.appendChild(tr);
        
        console.log(`✓ Row ${index + 1} added:`, {cloud, service, sourceType, mode ,tool, description });
    });
    
    // Ensure container is visible
    if (apiResultsContainer) {
        apiResultsContainer.style.display = 'block';
        apiResultsContainer.classList.add('show');
        console.log('✓ API Results container made visible');
    }
    
    console.log(`✅ Successfully populated ${data.length} rows`);
}

// ===== UPDATED FINAL GO BUTTON WITH BETTER ERROR HANDLING =====

const finalGoButton = document.getElementById('finalGoButton');
if (finalGoButton) {
    finalGoButton.addEventListener('click', async function() {
        console.log('🔘 Submit button clicked');
        
        // Collect all form data
        const formData = {
            country: document.getElementById('Country').value,
            cloudStack: document.getElementById('cloudStack').value,
            wellDefined: document.getElementById('Welldefined').value,
            involvesML: document.getElementById('involvesML').value,
            unstructuredData: document.getElementById('unstructuredData').value,
            storageSolution: document.getElementById('storagesolution').value,
            technologies: selectedStack,
            sourceDetails: sourceDetailsData
        };

        // Get selected cloud from dropdown
        const cloudValue = document.getElementById("cloudStack").value;

        if (!cloudValue) {
            alert("Please select a Cloud Stack first!");
            console.error('❌ No cloud selected');
            return;
        }

        console.log('===================');
        console.log('Configuration Submitted:', formData);
        console.log('Cloud Stack:', formData.cloudStack);
        console.log('Storage Solution:', formData.storageSolution);
        console.log('===================');

        // Provide visual feedback
        const originalText = finalGoButton.textContent;
        finalGoButton.textContent = '⏳ Fetching Results...';
        finalGoButton.disabled = true;
        finalGoButton.style.opacity = '0.7';

        try {
            console.log(`📡 Fetching from: http://127.0.0.1:5000/api/techstack?cloud=${cloudValue}`);
            
            // Call Flask API with cloud input
            const response = await fetch(
                `http://127.0.0.1:5000/api/techstack?cloud=${cloudValue}`
            );

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log('📊 API Response Data:', data);
            console.log('📊 Data type:', typeof data);
            console.log('📊 Is array:', Array.isArray(data));
            console.log('📊 Data length:', data.length);

            // Populate the table with results
            populateAPIResultsTable(data);

            // Show the results container
            const apiResultsContainer = document.getElementById('apiResultsContainer');
            if (apiResultsContainer) {
                apiResultsContainer.style.display = 'block';
                apiResultsContainer.classList.add('show');
                console.log('✓ Container visibility set');
                
                // Scroll to results
                setTimeout(() => {
                    apiResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    console.log('✓ Scrolled to results');
                }, 300);
            } else {
                console.error('❌ apiResultsContainer not found in DOM');
            }

            // Success feedback
            finalGoButton.textContent = '✓ Results Loaded';
            finalGoButton.style.background = 'linear-gradient(135deg, #00c896 0%, #00a86b 100%)';
            console.log('✅ Success! Table populated with', data.length, 'rows');
            
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            alert(`Backend error: ${error.message}\n\nPlease check:\n1. Backend server is running on http://127.0.0.1:5000\n2. CORS is enabled\n3. API endpoint is correct\n\nCheck console for details.`);
            
            finalGoButton.textContent = '❌ Error - Try Again';
            finalGoButton.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
        } finally {
            setTimeout(() => {
                finalGoButton.textContent = originalText;
                finalGoButton.style.background = '';
                finalGoButton.style.opacity = '1';
                finalGoButton.disabled = false;
            }, 2000);
        }
    });
} else {
    console.error('❌ finalGoButton not found in DOM');
}

// ===== DEBUGGING HELPER FUNCTION =====

/**
 * Call this function in console to check if elements exist
 */
function debugAPIResultsSetup() {
    console.log('=== API Results Debug ===');
    console.log('finalGoButton:', document.getElementById('finalGoButton'));
    console.log('apiResultsContainer:', document.getElementById('apiResultsContainer'));
    console.log('apiResultsTable:', document.getElementById('apiResultsTable'));
    console.log('apiResultsBody:', document.getElementById('apiResultsBody'));
    console.log('cloudStack dropdown:', document.getElementById('cloudStack'));
    
    const container = document.getElementById('apiResultsContainer');
    if (container) {
        console.log('Container display:', window.getComputedStyle(container).display);
        console.log('Container visibility:', window.getComputedStyle(container).visibility);
    }
}

// Make it globally available
window.debugAPIResultsSetup = debugAPIResultsSetup;

console.log('✅ Fixed script loaded. Run debugAPIResultsSetup() in console to check setup.');

// Function to populate API results table

// ===== ML FILTER FUNCTIONALITY =====

/**
 * Fetch tech stacks filtered for ML involvement
 * When "Involves ML" = Yes, retrieves Data Lake configurations only
 */
async function fetchMLFilteredTechStacks() {
    const mlResultsContainer = document.getElementById('mlResultsContainer');
    const mlConsoleOutput = document.getElementById('mlConsoleOutput');
    
    try {
        // Show container while loading
        mlResultsContainer.style.display = 'block';
        mlConsoleOutput.textContent = '⏳ Fetching ML-optimized tech stacks...\n\n';
        
        // Scroll to results
        setTimeout(() => {
            mlResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Call the API endpoint
        const response = await fetch('/api/tech-stacks/ml-filter?involves_ml=Yes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Populate the results table
        populateMLResultsTable(data);
        
        // Display in console output
        displayMLConsoleOutput(data);
        
        console.log('ML-Filtered Tech Stacks:', data);
        
    } catch (error) {
        console.error('Error fetching ML-filtered tech stacks:', error);
        mlConsoleOutput.textContent = `❌ Error fetching tech stacks:\n\n${error.message}\n\nMake sure the backend server is running at http://localhost:8000`;
        mlResultsContainer.style.display = 'block';
    }
}

/**
 * Populate ML results table with fetched data
 */
function populateMLResultsTable(data) {
    const mlResultsBody = document.getElementById('mlResultsBody');
    mlResultsBody.innerHTML = '';
    
    if (!data.tech_stacks || data.tech_stacks.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align: center; padding: 20px;">No tech stacks found for ML projects</td>';
        mlResultsBody.appendChild(tr);
        return;
    }
    
    data.tech_stacks.forEach((stack, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${stack.id}</td>
            <td>${stack.cloud || 'N/A'}</td>
            <td>${stack.service || 'N/A'}</td>
            <td>${stack.source_type || 'N/A'}</td>
            <td>${stack.mode || 'N/A'}</td>
            <td>${stack.tool || 'N/A'}</td>
            <td>${stack.description || 'N/A'}</td>
        `;
        tr.style.cursor = 'pointer';
        tr.addEventListener('mouseover', () => tr.style.backgroundColor = '#f0f0f0');
        tr.addEventListener('mouseout', () => tr.style.backgroundColor = '');
        mlResultsBody.appendChild(tr);
    });
}

/**
 * Display ML results in console output format
 */
function displayMLConsoleOutput(data) {
    const mlConsoleOutput = document.getElementById('mlConsoleOutput');
    
    let output = '✓ ML Tech Stack Query Results\n';
    output += '═'.repeat(60) + '\n\n';
    output += `Involves ML: ${data.involves_ml}\n`;
    output += `Service: ${data.service}\n`;
    output += `Total Results: ${data.count}\n`;
    output += `Message: ${data.message}\n`;
    output += '\n' + '─'.repeat(60) + '\n\n';
    
    if (data.tech_stacks && data.tech_stacks.length > 0) {
        output += 'TECH STACK CONFIGURATIONS:\n\n';
        
        data.tech_stacks.forEach((stack, index) => {
            output += `[${index + 1}] ${stack.cloud} - ${stack.service}\n`;
            output += `    Cloud Provider: ${stack.cloud}\n`;
            output += `    Service: ${stack.service}\n`;
            output += `    Source Type: ${stack.source_type || 'N/A'}\n`;
            output += `    Mode: ${stack.mode || 'N/A'}\n`;
            output += `    Tool: ${stack.tool}\n`;
            output += `    Description: ${stack.description}\n`;
            output += '\n';
        });
    } else {
        output += 'No tech stacks found for ML involvement.\n';
    }
    
    output += '═'.repeat(60) + '\n';
    output += 'Query executed successfully at ' + new Date().toLocaleTimeString();
    
    mlConsoleOutput.textContent = output;
}

/**
 * Close ML results container
 */
const closeMlResultsBtn = document.getElementById('closeMlResults');
if (closeMlResultsBtn) {
    closeMlResultsBtn.addEventListener('click', function() {
        const mlResultsContainer = document.getElementById('mlResultsContainer');
        mlResultsContainer.style.display = 'none';
    });
}

// ================================
// STORAGE SOLUTION AUTO-SELECTION (CORRECTED & FINAL)
// ================================
document.addEventListener('DOMContentLoaded', function() {
    
    const wellDefined = document.getElementById('Welldefined');
    const involvesML = document.getElementById('involvesML');
    const unstructuredData = document.getElementById('unstructuredData');
    const storageSolution = document.getElementById('storagesolution');
    const storageCheckmark = document.getElementById('check6');

    if (!wellDefined || !involvesML || !unstructuredData || !storageSolution) {
        console.warn('Storage rule dropdowns not found');
        return;
    }

    // Set default values
    wellDefined.value = 'Yes';
    involvesML.value = 'No';
    unstructuredData.value = 'No';

    function updateStorageDecision() {
        console.log('Storage Decision Inputs:', {
            wellDefined: wellDefined.value,
            involvesML: involvesML.value,
            unstructuredData: unstructuredData.value
        });

        // RULE: Well Defined = Yes AND Involves ML = No AND Unstructured Data = No → Data Warehouse
        // Everything else → Data Lake
        if (
            wellDefined.value === 'Yes' &&
            involvesML.value === 'No' &&
            unstructuredData.value === 'No'
        ) {
            storageSolution.value = 'Data Warehouse';
            // const storageSolution = document.getElementById('storagesolution').value;
            console.log('✓ Storage Decision: Data Warehouse');
        } else {
            storageSolution.value = 'Data Lake';
            console.log('✓ Storage Decision: Data Lake');
        }
        
        // Show checkmark
        if (storageCheckmark) {
            storageCheckmark.classList.add('show');
        }
        
        // Trigger checkmarks for default values
        if (wellDefined.value) {
            document.getElementById('check3')?.classList.add('show');
        }
        if (involvesML.value) {
            document.getElementById('check4')?.classList.add('show');
        }
        
        // Update progress
        updateProgress();
    }

    // Initial update
    updateStorageDecision();

    // Listen to dependency changes
    wellDefined.addEventListener('change', updateStorageDecision);
    involvesML.addEventListener('change', updateStorageDecision);
    unstructuredData.addEventListener('change', updateStorageDecision);

});

// finalGoButton.addEventListener("click", async function () {

//     // ✅ Get selected cloud from dropdown
//     const cloudValue = document.getElementById("cloudStack").value;

//     if (!cloudValue) {
//         alert("Please select a Cloud Stack first!");
//         return;
//     }

//     console.log("Selected Cloud:", cloudValue);

//     try {
//         // ✅ Call Flask API with cloud input
//         const response = await fetch(
//             `http://127.0.0.1:5000/api/techstack?cloud=${cloudValue}`
//         );

//         const data = await response.json();

//         console.log("Tech Stack Results:", data);

//         // ✅ Display results in browser (simple testing)
//         alert("Rows returned: " + data.length);

//     } catch (error) {
//         console.error("Error fetching data:", error);
//         alert("Backend error. Check console.");
//     }
// });
