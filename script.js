document.addEventListener('DOMContentLoaded', function() {
    // Add delete buttons to initial entries
    addDeleteButtons();
    
    // Initialize drag and drop functionality
    initializeDragAndDrop();

    // Handle photo upload
    document.getElementById('photoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImage').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('resumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generatePDF();
        generateWord();
    });

    document.getElementById('addWorkExperience').addEventListener('click', function() {
        addWorkExperience();
    });

    document.getElementById('addEducation').addEventListener('click', function() {
        addEducation();
    });

    // Add this to your existing event listeners
    document.getElementById('addCertification').addEventListener('click', function() {
        addCertification();
    });
});

// Drag and Drop Functionality
function initializeDragAndDrop() {
    const draggableSections = document.getElementById('draggableSections');
    const sections = draggableSections.querySelectorAll('.resume-section');
    
    sections.forEach(section => {
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragend', handleDragEnd);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('dragenter', handleDragEnter);
        section.addEventListener('dragleave', handleDragLeave);
        section.addEventListener('drop', handleDrop);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    // Clean up any remaining drag-over classes
    document.querySelectorAll('.resume-section').forEach(section => {
        section.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Allows us to drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting
    }
    
    if (draggedElement !== this) {
        const draggableSections = document.getElementById('draggableSections');
        const allSections = Array.from(draggableSections.children);
        const draggedIndex = allSections.indexOf(draggedElement);
        const targetIndex = allSections.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            // Insert after target
            draggableSections.insertBefore(draggedElement, this.nextSibling);
        } else {
            // Insert before target
            draggableSections.insertBefore(draggedElement, this);
        }
    }
    
    this.classList.remove('drag-over');
    return false;
}

function addDeleteButtons() {
    document.querySelectorAll('.work-experience, .education-entry, .certification-entry').forEach(entry => {
        if (!entry.querySelector('.delete-entry')) {
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'delete-entry';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', deleteEntry);
            entry.appendChild(deleteButton);
        }
    });
}

function addWorkExperience() {
    const workExperiences = document.getElementById('workExperiences');
    const newExperience = document.createElement('div');
    newExperience.className = 'work-experience';
    newExperience.innerHTML = `
        <input type="text" class="company" placeholder="Company (e.g., Tech Innovations Inc.)" required>
        <input type="text" class="title" placeholder="Job Title (e.g., Senior Software Engineer)" required>
        <input type="text" class="period" placeholder="Time Period (e.g., January 2020 - Present)" required>
        <textarea class="description" placeholder="Job Description (e.g., Led a team of 5 developers in creating a new mobile app...)" required></textarea>
        <button type="button" class="delete-entry">Delete</button>
    `;
    workExperiences.appendChild(newExperience);
    newExperience.querySelector('.delete-entry').addEventListener('click', deleteEntry);
}

function addEducation() {
    const educationEntries = document.getElementById('educationEntries');
    const newEducation = document.createElement('div');
    newEducation.className = 'education-entry';
    newEducation.innerHTML = `
        <input type="text" class="degree" placeholder="Degree (e.g., Bachelor of Science in Computer Science)" required>
        <input type="text" class="university" placeholder="University (e.g., University of California, Berkeley)" required>
        <input type="text" class="year" placeholder="Year (e.g., 2015-2019)" required>
        <button type="button" class="delete-entry">Delete</button>
    `;
    educationEntries.appendChild(newEducation);
    newEducation.querySelector('.delete-entry').addEventListener('click', deleteEntry);
}

function addCertification() {
    const certificationEntries = document.getElementById('certificationEntries');
    const newCertification = document.createElement('div');
    newCertification.className = 'certification-entry';
    newCertification.innerHTML = `
        <input type="text" class="certification-name" placeholder="Certification Name (e.g., AWS Certified Solutions Architect)" required>
        <input type="text" class="certification-org" placeholder="Issuing Organization (e.g., Amazon Web Services)" required>
        <input type="text" class="certification-date" placeholder="Date Obtained (e.g., May 2021)" required>
        <button type="button" class="delete-entry">Delete</button>
    `;
    certificationEntries.appendChild(newCertification);
    newCertification.querySelector('.delete-entry').addEventListener('click', deleteEntry);
}

function deleteEntry(e) {
    e.target.closest('.work-experience, .education-entry, .certification-entry').remove();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add photo if uploaded
    const photoImg = document.getElementById('previewImage');
    if (photoImg.src !== 'placeholder-avatar.png') {
        try {
            doc.addImage(photoImg.src, 'JPEG', 20, 15, 30, 30, undefined, 'FAST');
        } catch (e) {
            console.error('Failed to add photo to PDF:', e);
        }
    }

    const name = document.getElementById('name').value.toUpperCase();
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Set font
    doc.setFont('helvetica', 'normal');

    // Name
    doc.setFontSize(24);
    doc.text(name, 60, 25, { align: 'left' });

    // Contact info
    doc.setFontSize(10);
    doc.text(`${phone} | ${email}`, 60, 35, { align: 'left' });

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    let yPosition = 55;

    // Get sections in their current order
    const sectionsContainer = document.getElementById('draggableSections');
    const orderedSections = Array.from(sectionsContainer.children);
    
    // Process each section in the order they appear
    orderedSections.forEach(sectionElement => {
        const sectionType = sectionElement.getAttribute('data-section');
        
        switch(sectionType) {
            case 'summary':
                yPosition = addSummarySection(doc, yPosition);
                break;
            case 'skills':
                yPosition = addSkillsSection(doc, yPosition);
                break;
            case 'education':
                yPosition = addEducationSection(doc, yPosition);
                break;
            case 'certifications':
                yPosition = addCertificationsSection(doc, yPosition);
                break;
            case 'experience':
                yPosition = addExperienceSection(doc, yPosition);
                break;
            case 'accomplishments':
                yPosition = addAccomplishmentsSection(doc, yPosition);
                break;
        }
        yPosition += 10; // Add spacing between sections
    });

    doc.save('resume.pdf');
}

// Helper function to add a section
function addSection(doc, title, content, y) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, y);
    doc.setLineWidth(0.5);
    doc.line(20, y + 1, 190, y + 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, y + 8);
    return y + 8 + (lines.length * 5);
}

// Individual section generators
function addSummarySection(doc, yPosition) {
    const summary = document.getElementById('summary').value;
    return addSection(doc, 'Professional Summary', summary, yPosition);
}

function addSkillsSection(doc, yPosition) {
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', 20, yPosition);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 1, 190, yPosition + 1);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const middleIndex = Math.ceil(skills.length / 2);
    const leftColumnSkills = skills.slice(0, middleIndex);
    const rightColumnSkills = skills.slice(middleIndex);

    leftColumnSkills.forEach((skill, index) => {
        doc.text(`• ${skill}`, 25, yPosition + (index * 5));
    });

    rightColumnSkills.forEach((skill, index) => {
        doc.text(`• ${skill}`, 105, yPosition + (index * 5));
    });

    return yPosition + Math.max(leftColumnSkills.length, rightColumnSkills.length) * 5;
}

function addEducationSection(doc, yPosition) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 20, yPosition);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 1, 190, yPosition + 1);
    yPosition += 8;

    const educationEntries = document.querySelectorAll('.education-entry');
    educationEntries.forEach((entry, index) => {
        if (index > 0) yPosition += 5;
        const degree = entry.querySelector('.degree').value;
        const university = entry.querySelector('.university').value;
        const year = entry.querySelector('.year').value;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${degree}`, 20, yPosition);
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${university}, ${year}`, 20, yPosition);
        yPosition += 5;
    });

    return yPosition;
}

function addCertificationsSection(doc, yPosition) {
    const certificationEntries = document.querySelectorAll('.certification-entry');
    if (certificationEntries.length === 0) return yPosition;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', 20, yPosition);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 1, 190, yPosition + 1);
    yPosition += 8;

    const middleIndex = Math.ceil(certificationEntries.length / 2);
    const leftColumnCerts = Array.from(certificationEntries).slice(0, middleIndex);
    const rightColumnCerts = Array.from(certificationEntries).slice(middleIndex);
    
    let leftYPosition = yPosition;
    let rightYPosition = yPosition;

    // Left column
    leftColumnCerts.forEach((entry) => {
        const certName = entry.querySelector('.certification-name').value;
        const certOrg = entry.querySelector('.certification-org').value;
        const certDate = entry.querySelector('.certification-date').value;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${certName}`, 20, leftYPosition);
        leftYPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${certOrg} | ${certDate}`, 20, leftYPosition);
        leftYPosition += 10;
    });

    // Right column
    rightColumnCerts.forEach((entry) => {
        const certName = entry.querySelector('.certification-name').value;
        const certOrg = entry.querySelector('.certification-org').value;
        const certDate = entry.querySelector('.certification-date').value;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${certName}`, 105, rightYPosition);
        rightYPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${certOrg} | ${certDate}`, 105, rightYPosition);
        rightYPosition += 10;
    });

    return Math.max(leftYPosition, rightYPosition) + 5;
}

function addExperienceSection(doc, yPosition) {
    // Add new page if needed
    if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK EXPERIENCE', 20, yPosition);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 1, 190, yPosition + 1);
    yPosition += 8;

    const workExperiences = document.querySelectorAll('.work-experience');
    workExperiences.forEach((exp, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        if (index > 0) yPosition += 3;
        const company = exp.querySelector('.company').value;
        const title = exp.querySelector('.title').value;
        const period = exp.querySelector('.period').value;
        const description = exp.querySelector('.description').value;

        // Job Title - Bold and slightly larger
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, yPosition);
        yPosition += 4.5;
        
        // Company name - Regular weight
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(company, 20, yPosition);
        yPosition += 4;
        
        // Time period - Italic
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(period, 20, yPosition);
        yPosition += 4;

        // Description - Normal
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(description, 170);
        doc.text(descLines, 20, yPosition);
        yPosition += (descLines.length * 4) + 3;
    });

    return yPosition + 3;
}

function addAccomplishmentsSection(doc, yPosition) {
    const accomplishments = document.getElementById('accomplishments').value.split('\n').map(acc => acc.trim()).filter(acc => acc !== '');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ACCOMPLISHMENTS', 20, yPosition);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 1, 190, yPosition + 1);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    accomplishments.forEach((accomplishment, index) => {
        const accLines = doc.splitTextToSize(`• ${accomplishment}`, 165);
        doc.text(accLines, 25, yPosition);
        yPosition += accLines.length * 5 + 2;
    });

    return yPosition;
}

async function generateWord() {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun } = docx;

    // Get form data
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Create sections based on the draggable order
    const sectionsContainer = document.getElementById('draggableSections');
    const orderedSections = Array.from(sectionsContainer.children);
    
    const documentSections = [];

    // Header section with photo and contact info (mimicking PDF layout)
    const headerChildren = [];
    
    // Check if photo is uploaded
    const photoImg = document.getElementById('previewImage');
    if (photoImg.src && !photoImg.src.includes('placeholder-avatar.png')) {
        try {
            // Convert image to base64 for Word document
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 120;  // 30 * 4 (scaling for Word)
            canvas.height = 120;
            
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 120, 120);
            };
            img.src = photoImg.src;
            
            // Create table for header layout (photo + name/contact)
            const headerTable = new Table({
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "[Photo]",
                                                size: 16,
                                                color: "888888"
                                            })
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    })
                                ],
                                width: { size: 20, type: WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                }
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: name.toUpperCase(),
                                                bold: true,
                                                size: 48,
                                            }),
                                        ],
                                        spacing: { after: 100 },
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `${phone} | ${email}`,
                                                size: 20,
                                            }),
                                        ],
                                    })
                                ],
                                width: { size: 80, type: WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                }
                            })
                        ]
                    })
                ],
                width: { size: 100, type: WidthType.PERCENTAGE },
            });
            
            documentSections.push(headerTable);
        } catch (e) {
            console.error('Failed to add photo to Word document:', e);
            // Fallback without photo
            documentSections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: name.toUpperCase(),
                            bold: true,
                            size: 48,
                        }),
                    ],
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${phone} | ${email}`,
                            size: 20,
                        }),
                    ],
                    spacing: { after: 200 },
                })
            );
        }
    } else {
        // No photo - just name and contact info
        documentSections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: name.toUpperCase(),
                        bold: true,
                        size: 48,
                    }),
                ],
                spacing: { after: 100 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: `${phone} | ${email}`,
                        size: 20,
                    }),
                ],
                spacing: { after: 200 },
            })
        );
    }

    // Add horizontal line (mimicking PDF)
    documentSections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 20,
                    color: "666666"
                })
            ],
            spacing: { after: 300 },
        })
    );

    // Process each section in the draggable order
    orderedSections.forEach(sectionElement => {
        const sectionType = sectionElement.getAttribute('data-section');
        
        switch(sectionType) {
            case 'summary':
                documentSections.push(...generateWordSummarySection());
                break;
            case 'skills':
                documentSections.push(...generateWordSkillsSection());
                break;
            case 'education':
                documentSections.push(...generateWordEducationSection());
                break;
            case 'certifications':
                documentSections.push(...generateWordCertificationsSection());
                break;
            case 'experience':
                documentSections.push(...generateWordExperienceSection());
                break;
            case 'accomplishments':
                documentSections.push(...generateWordAccomplishmentsSection());
                break;
        }
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: documentSections,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
}

function generateWordSummarySection() {
    const { Paragraph, TextRun } = docx;
    const summary = document.getElementById('summary').value;
    
    return [
        new Paragraph({
            children: [
                new TextRun({
                    text: "PROFESSIONAL SUMMARY",
                    bold: true,
                    size: 28, // Matching PDF font size
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: summary,
                    size: 20,
                }),
            ],
            spacing: { after: 200 },
        }),
    ];
}

function generateWordSkillsSection() {
    const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    
    const skillsParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "SKILLS",
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
    ];

    // Create two-column layout for skills (matching PDF)
    const middleIndex = Math.ceil(skills.length / 2);
    const leftColumnSkills = skills.slice(0, middleIndex);
    const rightColumnSkills = skills.slice(middleIndex);

    // Create table for two-column layout
    const maxRows = Math.max(leftColumnSkills.length, rightColumnSkills.length);
    const tableRows = [];

    for (let i = 0; i < maxRows; i++) {
        const leftSkill = leftColumnSkills[i] || '';
        const rightSkill = rightColumnSkills[i] || '';

        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: leftSkill ? `• ${leftSkill}` : '',
                                        size: 20,
                                    }),
                                ],
                            })
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: rightSkill ? `• ${rightSkill}` : '',
                                        size: 20,
                                    }),
                                ],
                            })
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        }
                    })
                ]
            })
        );
    }

    const skillsTable = new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
    });

    skillsParagraphs.push(skillsTable);
    skillsParagraphs.push(
        new Paragraph({
            children: [],
            spacing: { after: 200 },
        })
    );

    return skillsParagraphs;
}

function generateWordEducationSection() {
    const { Paragraph, TextRun } = docx;
    const educationEntries = document.querySelectorAll('.education-entry');
    
    const educationParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "EDUCATION",
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
    ];

    educationEntries.forEach((entry, index) => {
        const degree = entry.querySelector('.degree').value;
        const university = entry.querySelector('.university').value;
        const year = entry.querySelector('.year').value;

        if (index > 0) {
            educationParagraphs.push(
                new Paragraph({
                    children: [],
                    spacing: { after: 100 },
                })
            );
        }

        educationParagraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: degree,
                        bold: true,
                        size: 24,
                    }),
                ],
                spacing: { after: 100 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: `${university}, ${year}`,
                        size: 20,
                    }),
                ],
                spacing: { after: 100 },
            })
        );
    });

    educationParagraphs.push(
        new Paragraph({
            children: [],
            spacing: { after: 200 },
        })
    );

    return educationParagraphs;
}

function generateWordCertificationsSection() {
    const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;
    const certificationEntries = document.querySelectorAll('.certification-entry');
    
    if (certificationEntries.length === 0) return [];
    
    const certificationParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "CERTIFICATIONS",
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
    ];

    // Create two-column layout for certifications (matching PDF)
    const middleIndex = Math.ceil(certificationEntries.length / 2);
    const leftColumnCerts = Array.from(certificationEntries).slice(0, middleIndex);
    const rightColumnCerts = Array.from(certificationEntries).slice(middleIndex);
    
    const maxRows = Math.max(leftColumnCerts.length, rightColumnCerts.length);
    const tableRows = [];

    for (let i = 0; i < maxRows; i++) {
        const leftCert = leftColumnCerts[i];
        const rightCert = rightColumnCerts[i];

        const leftContent = [];
        const rightContent = [];

        if (leftCert) {
            const certName = leftCert.querySelector('.certification-name').value;
            const certOrg = leftCert.querySelector('.certification-org').value;
            const certDate = leftCert.querySelector('.certification-date').value;
            
            leftContent.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: certName,
                            bold: true,
                            size: 24,
                        }),
                    ],
                    spacing: { after: 50 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${certOrg} | ${certDate}`,
                            size: 20,
                        }),
                    ],
                    spacing: { after: 100 },
                })
            );
        }

        if (rightCert) {
            const certName = rightCert.querySelector('.certification-name').value;
            const certOrg = rightCert.querySelector('.certification-org').value;
            const certDate = rightCert.querySelector('.certification-date').value;
            
            rightContent.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: certName,
                            bold: true,
                            size: 24,
                        }),
                    ],
                    spacing: { after: 50 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${certOrg} | ${certDate}`,
                            size: 20,
                        }),
                    ],
                    spacing: { after: 100 },
                })
            );
        }

        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: leftContent,
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        }
                    }),
                    new TableCell({
                        children: rightContent,
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        }
                    })
                ]
            })
        );
    }

    const certTable = new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
    });

    certificationParagraphs.push(certTable);
    certificationParagraphs.push(
        new Paragraph({
            children: [],
            spacing: { after: 200 },
        })
    );

    return certificationParagraphs;
}

function generateWordExperienceSection() {
    const { Paragraph, TextRun } = docx;
    const workExperiences = document.querySelectorAll('.work-experience');
    
    const experienceParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "WORK EXPERIENCE",
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
    ];

    workExperiences.forEach((exp, index) => {
        const company = exp.querySelector('.company').value;
        const title = exp.querySelector('.title').value;
        const period = exp.querySelector('.period').value;
        const description = exp.querySelector('.description').value;

        if (index > 0) {
            experienceParagraphs.push(
                new Paragraph({
                    children: [],
                    spacing: { after: 100 },
                })
            );
        }

        experienceParagraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: title,
                        bold: true,
                        size: 24,
                    }),
                ],
                spacing: { after: 90 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: company,
                        size: 22,
                    }),
                ],
                spacing: { after: 80 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: period,
                        italics: true,
                        size: 20,
                    }),
                ],
                spacing: { after: 80 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: description,
                        size: 20,
                    }),
                ],
                spacing: { after: 60 },
            })
        );
    });

    experienceParagraphs.push(
        new Paragraph({
            children: [],
            spacing: { after: 200 },
        })
    );

    return experienceParagraphs;
}

function generateWordAccomplishmentsSection() {
    const { Paragraph, TextRun } = docx;
    const accomplishments = document.getElementById('accomplishments').value.split('\n').map(acc => acc.trim()).filter(acc => acc !== '');
    
    const accomplishmentsParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "ACCOMPLISHMENTS",
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "________________________________________________________________",
                    size: 16,
                    color: "666666"
                })
            ],
            spacing: { after: 150 },
        }),
    ];

    accomplishments.forEach(accomplishment => {
        accomplishmentsParagraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `• ${accomplishment}`,
                        size: 20,
                    }),
                ],
                spacing: { after: 100 },
                indent: { left: 200 }, // Add indent for bullet points
            })
        );
    });

    accomplishmentsParagraphs.push(
        new Paragraph({
            children: [],
            spacing: { after: 200 },
        })
    );

    return accomplishmentsParagraphs;
}