document.addEventListener('DOMContentLoaded', function() {
    // Add delete buttons to initial entries
    addDeleteButtons();

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
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    const accomplishments = document.getElementById('accomplishments').value.split('\n').map(acc => acc.trim()).filter(acc => acc !== '');

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

    // Function to add a section
    function addSection(title, content, y) {
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

    let yPosition = 55;
    yPosition = addSection('Professional Summary', summary, yPosition);
    yPosition += 10;

    // Skills (two columns with bullet points)
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

    yPosition += Math.max(leftColumnSkills.length, rightColumnSkills.length) * 5 + 10;

    // Education
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

    yPosition += 10;

    // Certifications (Optional) - Two columns
    const certificationEntries = document.querySelectorAll('.certification-entry');
    if (certificationEntries.length > 0) {
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

        yPosition = Math.max(leftYPosition, rightYPosition) + 5;
    }

    // Work Experience - Add new page if needed
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

        if (index > 0) yPosition += 2;
        const company = exp.querySelector('.company').value;
        const title = exp.querySelector('.title').value;
        const period = exp.querySelector('.period').value;
        const description = exp.querySelector('.description').value;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${company} - ${title}`, 20, yPosition);
        yPosition += 4;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(period, 20, yPosition);
        yPosition += 4;

        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(description, 170);
        doc.text(descLines, 20, yPosition);
        yPosition += (descLines.length * 4) + 3;
    });

    yPosition += 3;

    
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

    doc.save('resume.pdf');
}