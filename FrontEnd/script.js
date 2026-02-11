const dropdowns = ['Country', 'cloudStack', 'Welldefined', 'involvesML', 'unstructuredData'];
    const checkmarks = ['check1', 'check2', 'check3', 'check4', 'check5', 'check6'];
    const progressFill = document.getElementById('progressFill');
    const matrixContainer = document.getElementById('matrixContainer');
    const jsonContainer = document.getElementById('jsonContainer');
    const header = document.getElementById('header');
    const matrixBody = document.getElementById('matrixBody');
    const jsonCode = document.getElementById('jsonCode');

    // Tech Stack variables
    let selectedStack = [];

    // Global array to store added source combinations
    let allSourceCombinations = [];

    // Reset all form fields on page load
    selectedStack = [];

    // Business Rules for Source Details
    const SOURCE_RULES = {
        'File': {
            modes: ['Batch', 'Realtime'],
            varieties: ['Semi-Structured', 'Un-Structured']
        },
        'Database': {
            modes: ['Batch', 'Realtime'],
            varieties: ['Semi-Structured', 'Structured']
        },
        'API Call': {
            modes: ['Batch'],
            varieties: ['Semi-Structured']
        },
        'API Publisher': {
            modes: ['Realtime'],
            varieties: ['Semi-Structured']
        },
        'IOT': {
            modes: ['Realtime'],
            varieties: ['Semi-Structured', 'Un-Structured']
        }
    };

    // Helper function to disable/enable options
    function filterDropdownOptions(dropdownId, allowedValues) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        Array.from(dropdown.options).forEach(option => {
            if (option.value === "") return; // Skip placeholder
            
            const isAllowed = allowedValues.includes(option.value);
            option.disabled = !isAllowed;
            
            // Visual styling: Gray out disabled items
            option.style.color = isAllowed ? "" : "#ccc";
            
            // Auto-deselect if the user had it selected but it's now forbidden
            if (!isAllowed && option.selected) {
                option.selected = false;
            }
        });
    }

    // Function triggered on Source Type change
    function applySourceRules() {
        console.log('🔧 Applying source rules...');
        
        const sourceDropdown = document.getElementById('sourceTypeDropdown');
        if (!sourceDropdown) {
            console.error('❌ sourceTypeDropdown not found');
            return;
        }
        
        const selectedSourceTypes = Array.from(sourceDropdown.selectedOptions).map(opt => opt.value);
        console.log('Selected source types:', selectedSourceTypes);

        // If nothing selected, enable all (default state)
        if (selectedSourceTypes.length === 0) {
            console.log('No source types selected - enabling all options');
            enableAllOptions('modeDropdown');
            enableAllOptions('varietyDropdown');
            return;
        }

        let allowedModes = [];
        let allowedVarieties = [];

        // Combine rules for all selected source types
        selectedSourceTypes.forEach(source => {
            if (SOURCE_RULES[source]) {
                allowedModes = [...new Set([...allowedModes, ...SOURCE_RULES[source].modes])];
                allowedVarieties = [...new Set([...allowedVarieties, ...SOURCE_RULES[source].varieties])];
                console.log(`✓ Applied rules for ${source}:`, SOURCE_RULES[source]);
            } else {
                console.warn(`⚠️ No rules found for source type: ${source}`);
            }
        });

        console.log('Allowed modes:', allowedModes);
        console.log('Allowed varieties:', allowedVarieties);

        filterDropdownOptions('modeDropdown', allowedModes);
        filterDropdownOptions('varietyDropdown', allowedVarieties);

        // Auto-select Mode and Variety if API Call or API Publisher is selected
        const autoSelectTypes = ['API Call', 'API Publisher'];
        autoSelectTypes.forEach(type => {
            if (selectedSourceTypes.includes(type)) {
                const modeDropdown = document.getElementById('modeDropdown');
                const varietyDropdown = document.getElementById('varietyDropdown');
                const allowedModes = SOURCE_RULES[type]?.modes || [];
                const allowedVarieties = SOURCE_RULES[type]?.varieties || [];
                if (modeDropdown && allowedModes.length > 0) {
                    Array.from(modeDropdown.options).forEach(opt => {
                        opt.selected = allowedModes.includes(opt.value);
                    });
                }
                if (varietyDropdown && allowedVarieties.length > 0) {
                    Array.from(varietyDropdown.options).forEach(opt => {
                        opt.selected = allowedVarieties.includes(opt.value);
                    });
                }
            }
        });

         
         
    }

    function enableAllOptions(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        Array.from(dropdown.options).forEach(opt => {
            opt.disabled = false;
            opt.style.color = "";
        });
    }

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
    // Update progress bar and storage dropdown logic
    function updateProgress() {
        let completed = 0;
        dropdowns.forEach(id => {
            if (document.getElementById(id).value) {
                completed++;
            }
        });

        const percentage = (completed / dropdowns.length) * 100;
        progressFill.style.width = percentage + '%';

        // Storage Solution dropdown logic
        const wellDefined = document.getElementById('Welldefined');
        const involvesML = document.getElementById('involvesML');
        const unstructuredData = document.getElementById('unstructuredData');
        const storageDropdown = document.getElementById('storagesolution');

        if (
            wellDefined && wellDefined.value === 'Yes' &&
            involvesML && involvesML.value === 'No' &&
            unstructuredData && unstructuredData.value === 'No'
        ) {
            storageDropdown && (storageDropdown.disabled = false);
        } else {
            storageDropdown && (storageDropdown.disabled = true);
            if (storageDropdown) storageDropdown.value = '';
        }

        // Add visual feedback when complete
        if (completed === dropdowns.length) {
            progressFill.style.background = 'linear-gradient(90deg, #00ff88 0%, #4CAF50 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        }
    }

    // Add event listeners to all dropdowns
    dropdowns.forEach((id, index) => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.addEventListener('change', function () {
                const checkmark = document.getElementById(checkmarks[index]);
                if (this.value) {
                    checkmark.classList.add('show');
                } else {
                    checkmark.classList.remove('show');
                }
                
                updateProgress();
            });
        }
    });

    // Populate matrix table with data
//     function populateMatrix(data) {
//         matrixBody.innerHTML = '';
        
//         if (!data || data.length === 0) {
//             console.error('No data to populate matrix');
//             return;
//         }
        
//       data.forEach((row, index) => {
//     const tr = document.createElement('tr');
//     tr.dataset.rowIndex = index;

//     const reorderedRow = [
//         row[0],  // Rank
//         row[2],  // Cloud
//         row[3],  // Source Type
//         row[4],  // Mode
//         row[6],  // Data Ingestion
//         row[8],  // Workflow Orchestration
//         row[7],  // Data Transformation
//         row[5],  // Data Lake/Warehouse
//     ];

//     // ✅ Add normal cells
//     reorderedRow.forEach(cell => {
//         const td = document.createElement('td');
//         td.textContent = cell;
//         tr.appendChild(td);
//     });

//     // ✅ Add Expand Button
//     const expandTd = document.createElement('td');
//     expandTd.innerHTML = `<button class="expand-btn">▶ Expand</button>`;
//     tr.appendChild(expandTd);

//     // Expand click
//     expandTd.querySelector("button").addEventListener("click", function (e) {
//         e.stopPropagation();
//         handleRowSelection(tr, row);
//     });

//     matrixBody.appendChild(tr);
// });

// // ✅ Add Expand Button Column
// const expandTd = document.createElement('td');
// expandTd.innerHTML = `<button class="expand-btn">▶ Expand</button>`;
// tr.appendChild(expandTd);

// // Store row data in dataset
// tr.dataset.rowData = JSON.stringify(row);

// // Expand button click
// expandTd.querySelector("button").addEventListener("click", function (e) {
//     e.stopPropagation(); // prevent row click
//     handleRowSelection(tr, row);
// });

//             matrixBody.appendChild(tr);
//         });

//             }      

function populateMatrix(data) {
    matrixBody.innerHTML = '';

    if (!data || data.length === 0) {
        console.error('No data to populate matrix');
        return;
    }

    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.dataset.rowIndex = index;

        const reorderedRow = [
            row[0],  // Rank
            row[2],  // Cloud
            row[3],  // Source Type
            row[4],  // Mode
            row[6],  // Data Ingestion
            row[8],  // Workflow Orchestration
            row[7],  // Data Transformation
            row[5],  // Data Lake/Warehouse
        ];

        // Add normal cells
        reorderedRow.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        // Add Expand button cell (ONLY ONCE)
        const expandTd = document.createElement('td');
        expandTd.innerHTML = `<button class="expand-btn">▶ Expand</button>`;
        tr.appendChild(expandTd);

        // Store row data
        tr.dataset.rowData = JSON.stringify(row);

        // Expand click event
        expandTd.querySelector("button").addEventListener("click", function (e) {
            e.stopPropagation();
            handleRowSelection(tr, row);
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
    // function handleRowSelection(rowElement, rowData) {
    //     // Remove previous selection
    //     const previousSelected = matrixBody.querySelector('tr.selected');
    //     if (previousSelected) {
    //         previousSelected.classList.remove('selected');
    //     }
        
    //     // Add selection to clicked row
    //     rowElement.classList.add('selected');
        
    //     // Create JSON object matching your backend structure
    //     // rowData: [rank, score, cloud, sourcetype, mode, datalake, dataingestion, tools, workflow, involvesml, welldefined]
    //     const jsonData = {
    //         rank: rowData[0],
    //         cloud: rowData[2],
    //         source_type: rowData[3],
    //         mode: rowData[4],
    //         data_ingestion: rowData[6],
    //         workflow_orchestration: rowData[8],
    //         data_transformation: rowData[7],
    //         datalake_warehouse: rowData[5],
    //         score: rowData[1],
    //         involves_ml: rowData[9],
    //         well_defined: rowData[10]
    //     };
        
    //     // Show loading state while fetching from Gemini - USE innerHTML
    //     jsonCode.innerHTML = '<p style="text-align: center; color: #4CAF50;"><strong>⏳ Generating architecture details...</strong></p><p>Please wait while we create a comprehensive architecture explanation for your selected configuration.</p>';
    //     jsonContainer.classList.add('show');
        
    //     // Scroll to JSON container
    //     setTimeout(() => {
    //         jsonContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }, 100);
        
    //     console.log('Selected architecture:', jsonData);
        
    //     // Call Gemini to get detailed architecture explanation
    //     fetch('http://127.0.0.1:5000/api/expand_architecture', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(jsonData)
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log('Gemini API response:', data);
            
    //         // Display the Gemini-generated architecture explanation
    //         if (data.architecture_explanation) {
    //             // Parse Markdown and render as HTML - USE innerHTML
    //             const htmlContent = parseMarkdown(data.architecture_explanation);
    //             jsonCode.innerHTML = htmlContent;
    //             console.log('Architecture Details:', data.architecture_explanation);
    //         } else {
    //             jsonCode.innerHTML = '<p style="color: #ff9800;">No architecture details received from the server.</p>';
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Gemini API error:', error);
    //         jsonCode.innerHTML = `<p style="color: #f44336;"><strong>❌ Error generating architecture details:</strong></p><p>${error.message}</p><p>Please try again or check the console for more details.</p>`;
    //     });
    // }



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

    // --------------------------------First Section start here--------------------
    async function loadCountries() {
        try {
            console.log('📡 Fetching countries from database...');
            
            const response = await fetch('http://127.0.0.1:5000/api/config?key=COUNTRIES&split=true');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const countries = await response.json();
            const countryDropdown = document.getElementById('Country');
            
            if (!countryDropdown) {
                console.error('❌ Country dropdown not found');
                return;
            }
            
            // Clear and populate
            countryDropdown.innerHTML = '<option value="">Select Country</option>';
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countryDropdown.appendChild(option);
            });
            
            console.log(`✅ Loaded ${countries.length} countries:`, countries);
            
        } catch (error) {
            console.error('❌ Error loading countries:', error);
            console.warn('⚠️ Using fallback country list');
        }
    }


    // ===== LOAD CLOUD PROVIDERS FROM DATABASE =====

    // ===== LOAD CLOUD PROVIDERS FROM DATABASE =====
    async function loadCloudProviders() {
        try {
            console.log('📡 Fetching cloud providers from app_config table...');
            
            // We call the generic config endpoint with split=true to get ["AWS", "Azure", "GCP"]
            const response = await fetch('http://127.0.0.1:5000/api/config?key=CLOUD&split=true');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const cloudProviders = await response.json();
            const cloudDropdown = document.getElementById('cloudStack');
            
            if (!cloudDropdown) {
                console.error('❌ Cloud dropdown (id="cloudStack") not found in HTML');
                return;
            }
            
            // Clear existing and add placeholder
            cloudDropdown.innerHTML = '<option value="">Select Cloud Stack</option>';
            
            // Populate with database values
            cloudProviders.forEach(cloud => {
                const option = document.createElement('option');
                option.value = cloud;
                option.textContent = cloud;
                cloudDropdown.appendChild(option);
            });
            
            console.log(`✅ Successfully loaded ${cloudProviders.length} cloud providers from DB`);
            
        } catch (error) {
            console.error('❌ Error loading cloud providers:', error);
        }
    }

    // ===== TECH STACK SELECTION FUNCTIONALITY =====

    // Available technologies for autocomplete - LOADED FROM DATABASE
    let availableTechs = [];
    let technologiesLoaded = false;

    async function loadAvailableTechnologies() {
        if (technologiesLoaded) {
            return availableTechs;
        }
        
        try {
            console.log('📡 Fetching available technologies from database...');
            
            // Pointing to the specific technology endpoint
            const response = await fetch('http://127.0.0.1:5000/api/technologies');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Data is expected to be ["Airflow", "Spark", "Python", ...]
            availableTechs = data;
            technologiesLoaded = true;
            
            console.log(`✅ Loaded ${availableTechs.length} technologies from database`);
            return availableTechs;
            
        } catch (error) {
            console.error('❌ Error loading technologies:', error);
            
            // Fallback list in case the API is down
            availableTechs = ['Apache Spark', 'Apache Kafka', 'Apache Airflow', 'Python', 'Docker'];
            technologiesLoaded = true;
            return availableTechs;
        }
    }

    window.addEventListener('DOMContentLoaded', async function() {
        // Load technologies from database on page load
        await loadAvailableTechnologies();
    });

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
    document.querySelectorAll('.tech-input-group').forEach((group, idx) => {
        const input = group.querySelector('.tech-input');
        if (input) {
            attachInputListeners(input);
        }
    });

    // ===== SOURCE DETAILS SECTION FUNCTIONALITY =====

    function populateDropdown(elementId, data, placeholder, isMultiple = false) {
        const el = document.getElementById(elementId);
        if (!el) {
            console.error(`Element ${elementId} not found`);
            return;
        }
        
        // Clear existing
        el.innerHTML = '';
        
        // Add placeholder only for single select
        if (!isMultiple) {
            const entry = document.createElement('option');
            entry.value = "";
            entry.textContent = placeholder;
            el.appendChild(entry);
        }

        data.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            el.appendChild(opt);
        });
        console.log(`✅ Populated ${elementId} with ${data.length} items`);
    }

    async function loadSourceTypes() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/config?key=SOURCE_TYPE&split=true');
            const data = await response.json();
            // Passing 'true' because your HTML uses 'multiple'
            populateDropdown('sourceTypeDropdown', data, 'Select Source Type', true);
            
            // ✅ CRITICAL FIX: Attach event listener AFTER dropdown is populated
            console.log('✅ Source types loaded, attaching change listener...');
            const sourceDropdown = document.getElementById('sourceTypeDropdown');
            if (sourceDropdown) {
                sourceDropdown.addEventListener('change', applySourceRules);
                console.log('✅ Source type change listener attached');
            }
            
        } catch (e) { 
            console.error("Error loading Source Types", e); 
        }
    }

    async function loadSourceModes() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/config?key=SOURCE_MODE&split=true');
            const data = await response.json();
            populateDropdown('modeDropdown', data, 'Select Mode', true);
        } catch (e) { console.error("Error loading Source Modes", e); }
    }

    async function loadSourceVarieties() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/config?key=SOURCE_VARIETY&split=true');
            const data = await response.json();
            populateDropdown('varietyDropdown', data, 'Select Variety', true);
        } catch (e) { console.error("Error loading Source Varieties", e); }
    }

    // ===== SOURCE DETAILS TABLE UPDATE FUNCTION =====
    function updateSourceDetailsTable() {
        const tableBody = document.getElementById('sourceDetailsTableBody');
        
        if (!tableBody) {
            console.error('❌ sourceDetailsTableBody not found in HTML');
            return;
        }
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        if (allSourceCombinations.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #888;">No source details added yet</td></tr>';
            return;
        }
        
        // Add each combination as a row
        allSourceCombinations.forEach((combo, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${combo.source_types.join(', ')}</td>
                <td>${combo.modes.join(', ')}</td>
                <td>${combo.varieties.join(', ')}</td>
            `;
            tableBody.appendChild(tr);
        });
        
        console.log(`✅ Updated source details table with ${allSourceCombinations.length} rows`);
    }

    // ===== SETUP SOURCE ADD BUTTON =====
    function setupSourceAddButton() {
        const addButton = document.getElementById('addSourceButton');
        
        if (!addButton) {
            console.error('❌ addSourceButton not found in HTML');
            return;
        }
        
        console.log('✅ Setting up Add Source button...');
        
        addButton.addEventListener('click', function() {
            console.log('🔘 Add Source button clicked');
            
            // Helper to capture values from multi-select boxes
            const getSelections = (id) => {
                const el = document.getElementById(id);
                if (!el) {
                    console.error(`❌ Element ${id} not found`);
                    return [];
                }
                return Array.from(el.selectedOptions).map(opt => opt.value).filter(v => v !== "");
            };

            const currentCombo = {
                source_types: getSelections('sourceTypeDropdown'),
                modes: getSelections('modeDropdown'),
                varieties: getSelections('varietyDropdown'),
                added_at: new Date().toLocaleTimeString()
            };

            console.log('Current selection:', currentCombo);

            // Validation
            if (currentCombo.source_types.length === 0) {
                alert("⚠️ Please select at least one Source Type!");
                console.warn('No source types selected');
                return;
            }

            if (currentCombo.modes.length === 0) {
                alert("⚠️ Please select at least one Mode!");
                console.warn('No modes selected');
                return;
            }

            if (currentCombo.varieties.length === 0) {
                alert("⚠️ Please select at least one Variety!");
                console.warn('No varieties selected');
                return;
            }

            // Add to global array
            allSourceCombinations.push(currentCombo);
            console.log("✅ Combination Added. Total:", allSourceCombinations.length);
            console.log("All combinations:", allSourceCombinations);
            
            // Update the table display
            updateSourceDetailsTable();
            
            // Clear selections for next entry
            document.getElementById('sourceTypeDropdown').value = '';
            document.getElementById('modeDropdown').value = '';
            document.getElementById('varietyDropdown').value = '';
            
            // Visual feedback
            addButton.textContent = '✓ Added!';
            addButton.style.background = '#4CAF50';
            setTimeout(() => {
                addButton.textContent = 'Add Source';
                addButton.style.background = '';
            }, 1500);
        });
        
        console.log('✅ Add Source button event listener attached');
    }

    // ✅ UPDATED: DOMContentLoaded with proper initialization order
    document.addEventListener('DOMContentLoaded', async function() {
        console.log("🚀 Initializing Application...");
        
        // 1. Parallel load for efficiency on initial startup
        await Promise.all([
            loadCountries(),
            loadCloudProviders(),
            loadAvailableTechnologies(),
            loadSourceTypes(),      // This now includes attaching the event listener
            loadSourceModes(),
            loadSourceVarieties(),
        ]);

        // 2. Setup Add Source button AFTER dropdowns are loaded
        setupSourceAddButton();

        // ✅ CRITICAL FIX: Apply source rules AFTER dropdowns are loaded
        console.log('✅ All dropdowns loaded, applying initial source rules...');
        applySourceRules();

        // 3. Setup Cloud Selection Listener to Filter Technologies
        const cloudDropdown = document.getElementById('cloudStack');
        
        if (cloudDropdown) {
            cloudDropdown.addEventListener('change', async function() {
                const selectedCloud = this.value;
                
                if (selectedCloud) {
                    console.log(`☁️ Cloud changed to ${selectedCloud}. Updating tech list...`);
                    await updateAvailableTechsByCloud(selectedCloud);
                } else {
                    // If cloud is deselected, you might want to show only NULL/agnostic tools
                    await updateAvailableTechsByCloud(null);
                }
            });
        }

        // 4. Setup Storage Decision Logic
        const wellDefined = document.getElementById('Welldefined');
        const involvesML = document.getElementById('involvesML');
        const unstructuredData = document.getElementById('unstructuredData');
        const storageSolution = document.getElementById('storagesolution');
        const storageCheckmark = document.getElementById('check6');

        // Default Values
        if(wellDefined) wellDefined.value = 'Yes';
        if(involvesML) involvesML.value = 'No';
        if(unstructuredData) unstructuredData.value = 'No';

      let storageAutoSet = false;

function updateStorageDecision() {
    const allowBoth = wellDefined.value === 'Yes' &&
                      involvesML.value === 'No' &&
                      unstructuredData.value === 'No';

    const lakeOption = storageSolution.querySelector("option[value='Data Lake']");
    const warehouseOption = storageSolution.querySelector("option[value='Data Warehouse']");

    if (allowBoth) {
        lakeOption.disabled = false;
        warehouseOption.disabled = false;
    } else {
        warehouseOption.disabled = true;
        storageSolution.value = 'Data Lake';
    }
}



        // Attach Storage listeners
        [wellDefined, involvesML, unstructuredData].forEach(el => {
            if(el) el.addEventListener('change', updateStorageDecision);
        });
        const closeApiArchitecture = document.getElementById('closeApiArchitecture');
    if (closeApiArchitecture) {
        closeApiArchitecture.addEventListener('click', function() {
            const container = document.getElementById('apiArchitectureContainer');
            if (container) {
                container.style.display = 'none';
            }
        });
    }

        // 5. Final Initializations
        updateStorageDecision(); 
    });


    /**
     * Fetches tools from the backend that match the selected cloud 
     * OR are cloud-agnostic (NULL in DB).
     */
    async function updateAvailableTechsByCloud(cloud) {
        try {
            // Construct URL with cloud parameter
            const url = `http://127.0.0.1:5000/api/technologies/filter?cloud=${encodeURIComponent(cloud || '')}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch filtered techs');
            
            const data = await response.json();
            
            // CRITICAL: Overwrite the global variable your autocomplete script uses
            availableTechs = data; 
            
            console.log(`✅ Loaded ${availableTechs.length} tools for ${cloud || 'Agnostic'}`);
        } catch (error) {
            console.error('❌ Error filtering technologies:', error);
        }
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
            allSourceCombinations = [];
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


    // ===== POPULATE API RESULTS TABLE (FIRST 10 ROWS) =====
    // function populateAPIResultsTable(data) {
    //     const apiResultsBody = document.getElementById('apiResultsBody');
    //     const apiResultsContainer = document.getElementById('apiResultsContainer');
        
    //     if (!apiResultsBody) {
    //         console.error('❌ apiResultsBody element not found');
    //         return;
    //     }
        
    //     // Clear existing rows
    //     apiResultsBody.innerHTML = '';

    //     console.log('📊 Populating table with data:', data);
    //     console.log('📊 Total rows received:', data.length);

    //     if (!data || data.length === 0) {
    //         const tr = document.createElement('tr');
    //         tr.innerHTML = '<td colspan="7" style="text-align: center; padding: 20px; color: #888;">No results found</td>';
    //         apiResultsBody.appendChild(tr);
    //         return;
    //     }

    //     // ✅ LIMIT TO FIRST 10 ROWS
    //     const limitedData = data.slice(0, 10);
    //     console.log(`📊 Displaying first ${limitedData.length} rows out of ${data.length} total`);

    //     // Populate each row
    //     limitedData.forEach((item, index) => {
    //         const tr = document.createElement('tr');
    //         tr.style.animation = `slideInScale 0.3s ease ${index * 0.05}s both`;
            
    //         // Extract fields from the API response
    //         const cloud = item.cloud || 'N/A';
    //         const sourceType = item.source_type || 'N/A';
    //         const mode = item.mode || 'N/A';
    //         const ingestionTool = item.ingestion_tool || 'N/A';
    //         const orchestrationTool = item.orchestration_tool || 'N/A';
    //         const transformationTool = item.transformation_tool || 'N/A';
    //         const dataStorage = item.data_storage || 'N/A';
            
    //         tr.innerHTML = `
    //             <td>${cloud}</td>
    //             <td>${sourceType}</td>
    //             <td>${mode}</td>
    //             <td>${ingestionTool}</td>
    //             <td>${orchestrationTool}</td>
    //             <td>${transformationTool}</td>
    //             <td>${dataStorage}</td>
    //         `;
            
    //         apiResultsBody.appendChild(tr);
            
    //         console.log(`✓ Row ${index + 1} added:`, {cloud, sourceType, mode, ingestionTool, orchestrationTool, transformationTool, dataStorage});
    //     });
        
    //     // Show message if more rows exist
    //     if (data.length > 10) {
    //         const infoTr = document.createElement('tr');
    //         infoTr.innerHTML = `<td colspan="7" style="text-align: center; padding: 15px; background: #f0f0f0; color: #666; font-style: italic;">Showing first 10 of ${data.length} total results</td>`;
    //         apiResultsBody.appendChild(infoTr);
    //     }
        
    //     // Ensure container is visible
    //     if (apiResultsContainer) {
    //         apiResultsContainer.style.display = 'block';
    //         apiResultsContainer.classList.add('show');
    //         console.log('✓ API Results container made visible');
    //     }
        
    //     console.log(`✅ Successfully populated ${limitedData.length} rows`);
    // }
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
    console.log('📊 Total rows received:', data.length);

    if (!data || data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="8" style="text-align: center; padding: 20px; color: #888;">No results found</td>';
        apiResultsBody.appendChild(tr);
        return;
    }

    // ✅ LIMIT TO FIRST 10 ROWS
    const limitedData = data.slice(0, 10);
    console.log(`📊 Displaying first ${limitedData.length} rows out of ${data.length} total`);

    // Populate each row
    limitedData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.style.animation = `slideInScale 0.3s ease ${index * 0.05}s both`;
        
        // Extract fields from the API response
        const cloud = item.cloud || 'N/A';
        const sourceType = item.source_type || 'N/A';
        const mode = item.mode || 'N/A';
        const ingestionTool = item.ingestion_tool || 'N/A';
        const orchestrationTool = item.orchestration_tool || 'N/A';
        const transformationTool = item.transformation_tool || 'N/A';
        const dataStorage = item.data_storage || 'N/A';
        
        tr.innerHTML = `
            <td>${cloud}</td>
            <td>${sourceType}</td>
            <td>${mode}</td>
            <td>${ingestionTool}</td>
            <td>${orchestrationTool}</td>
            <td>${transformationTool}</td>
            <td>${dataStorage}</td>
            <td><button class="expand-btn">▶ Expand</button></td>
        `;
        
        // Add expand button click handler
        const expandBtn = tr.querySelector('.expand-btn');
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleRowExpand(item, index);
        });
        
        apiResultsBody.appendChild(tr);
        
        console.log(`✓ Row ${index + 1} added:`, {cloud, sourceType, mode, ingestionTool, orchestrationTool, transformationTool, dataStorage});
    });
    
    // Show message if more rows exist
    if (data.length > 10) {
        const infoTr = document.createElement('tr');
        infoTr.innerHTML = `<td colspan="8" style="text-align: center; padding: 15px; background: #f0f0f0; color: #666; font-style: italic;">Showing first 10 of ${data.length} total results</td>`;
        apiResultsBody.appendChild(infoTr);
    }
    
    // Ensure container is visible
    if (apiResultsContainer) {
        apiResultsContainer.style.display = 'block';
        apiResultsContainer.classList.add('show');
        console.log('✓ API Results container made visible');
    }
    
    console.log(`✅ Successfully populated ${limitedData.length} rows`);
}


// Handle expand button clicks for API results
function handleRowExpand(rowData, rowIndex) {
    console.log('🔍 Expanding row:', rowIndex + 1, rowData);
    
    const architectureContainer = document.getElementById('apiArchitectureContainer');
    const architectureCode = document.getElementById('apiArchitectureCode');
    
    if (!architectureContainer || !architectureCode) {
        console.error('❌ Architecture container elements not found');
        alert('Error: Architecture display elements not found. Please check the HTML.');
        return;
    }
    
    // Prepare data for Gemini API
    const jsonData = {
        cloud: rowData.cloud,
        source_type: rowData.source_type,
        mode: rowData.mode,
        data_ingestion: rowData.ingestion_tool,
        workflow_orchestration: rowData.orchestration_tool,
        data_transformation: rowData.transformation_tool,
        datalake_warehouse: rowData.data_storage,
        involves_ml: document.getElementById('involvesML')?.value || 'N/A',
        well_defined: document.getElementById('Welldefined')?.value || 'N/A',
        rank: rowIndex + 1,
        score: 0  // You can add scoring logic if needed
    };
    
    // Show loading state
    architectureCode.innerHTML = '<p style="text-align: center; color: #4CAF50;"><strong>⏳ Generating architecture details...</strong></p><p>Please wait while we create a comprehensive architecture explanation for your selected configuration.</p>';
    architectureContainer.style.display = 'block';
    
    // Scroll to architecture container
    setTimeout(() => {
        architectureContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    console.log('📤 Sending to Gemini API:', jsonData);
    
    // Call Gemini API
    fetch('http://127.0.0.1:5000/api/expand_architecture', {
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
        console.log('✅ Gemini API response received:', data);
        
        if (data.architecture_explanation) {
            const htmlContent = parseMarkdown(data.architecture_explanation);
            architectureCode.innerHTML = htmlContent;
            console.log('✅ Architecture details displayed');
        } else {
            architectureCode.innerHTML = '<p style="color: #ff9800;">⚠️ No architecture details received from the server.</p>';
        }
    })
    .catch(error => {
        console.error('❌ Gemini API error:', error);
        architectureCode.innerHTML = `
            <p style="color: #f44336;"><strong>❌ Error generating architecture details:</strong></p>
            <p>${error.message}</p>
            <p>Please try again or check the console for more details.</p>
        `;
    });
}

    // ===== FINAL SUBMIT BUTTON =====
    const finalGoButton = document.getElementById('finalGoButton');

    if (finalGoButton) {
        finalGoButton.addEventListener('click', async function() {
            console.log('🔘 Final Submit button clicked');
            
            const cloudValue = document.getElementById("cloudStack").value;

            if (!cloudValue) {
                alert("⚠️ Please select a Cloud Stack first!");
                console.warn('No cloud selected');
                return;
            }
            


            // 1. Construct the Final JSON object for the console
            const finalSubmissionJSON = {
                country: document.getElementById('Country').value,
                cloud_context: cloudValue,
                storage_solution: document.getElementById('storagesolution').value,
                well_defined: document.getElementById('Welldefined').value,
                involves_ml: document.getElementById('involvesML').value,
                unstructured_data: document.getElementById('unstructuredData').value,
                source_details_history: allSourceCombinations,
                selected_technologies: selectedStack 
            };

            console.log("%c 🚀 FINAL CONFIGURATION JSON", "color: #00ff88; font-weight: bold; font-size: 14px;");
            console.log(JSON.stringify(finalSubmissionJSON, null, 2));

            // 2. Fetch Tech Stack from API and Display First 10 Rows
            try {
                finalGoButton.textContent = '⏳ Fetching Results...';
                finalGoButton.disabled = true;
                finalGoButton.style.opacity = '0.7';
                
                // const response = await fetch(`http://127.0.0.1:5000/api/techstack?cloud=${encodeURIComponent(cloudValue)}`);
                
                const response = await fetch("http://127.0.0.1:5000/api/techstack", 
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(finalSubmissionJSON)
                    });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();

                console.log(`%c 📊 Tech Stack API Response:`, 'color: #00ff88; font-weight: bold;');
                console.log('Total rows:', data.length);
                console.table(data);

                // ✅ Populate the table with first 10 rows
                populateAPIResultsTable(data);
                
                // Scroll to results
                const apiResultsContainer = document.getElementById('apiResultsContainer');
                if (apiResultsContainer) {
                    setTimeout(() => {
                        apiResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }


                finalGoButton.textContent = '✓ Results Loaded';
                finalGoButton.style.background = 'linear-gradient(135deg, #00c896 0%, #00a86b 100%)';
                
            } catch (error) {
                console.error("❌ Error fetching data:", error);
                alert(`Error: ${error.message}\n\nPlease check:\n1. Backend is running on http://127.0.0.1:5000\n2. CORS is enabled\n3. Database connection is working`);
                
                finalGoButton.textContent = '❌ Error - Try Again';
                finalGoButton.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
                
            } finally {
                setTimeout(() => {
                    finalGoButton.textContent = 'Go';
                    finalGoButton.style.background = '';
                    finalGoButton.style.opacity = '1';
                    finalGoButton.disabled = false;
                }, 2000);
            }
        });
        
        console.log('✅ Final Submit button event listener attached');
    } else {
        console.error('❌ finalGoButton not found in HTML');
    }

    // ===== DEBUGGING HELPER FUNCTION =====
    function debugAPIResultsSetup() {
        console.log('=== API Results Debug ===');
        console.log('finalGoButton:', document.getElementById('finalGoButton'));
        console.log('apiResultsContainer:', document.getElementById('apiResultsContainer'));
        console.log('apiResultsTable:', document.getElementById('apiResultsTable'));
        console.log('apiResultsBody:', document.getElementById('apiResultsBody'));
        console.log('cloudStack dropdown:', document.getElementById('cloudStack'));
        console.log('addSourceButton:', document.getElementById('addSourceButton'));
        console.log('sourceDetailsTableBody:', document.getElementById('sourceDetailsTableBody'));
        
        const container = document.getElementById('apiResultsContainer');
        if (container) {
            console.log('Container display:', window.getComputedStyle(container).display);
            console.log('Container visibility:', window.getComputedStyle(container).visibility);
        }
    }

    // Make it globally available
    window.debugAPIResultsSetup = debugAPIResultsSetup;

    console.log('✅ Complete script loaded with Add button and API table display (first 10 rows)');
    console.log('Run debugAPIResultsSetup() in console to check setup.');