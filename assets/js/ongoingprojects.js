/* ==========================================================
   ONGOING PROJECTS - Page Specific JS
   Stage Tracking, Upload, Tabs, Resource Forms
========================================================== */
document.addEventListener('DOMContentLoaded', function() {

    const stages = [
        {
            id: 1,
            name: 'Title',
            status: 'completed',
            deadline: '2026-05-12',
            deadlineLabel: 'May 12, 2026',
            description: 'Submit your approved project title with a brief one-line description of the proposed system.',
            uploadDescription: 'Submit the project title document for mentor approval.',
            feedback: 'Great topic! Approved to proceed.'
        },
        {
            id: 2,
            name: 'Abstract',
            status: 'completed',
            deadline: '2026-05-18',
            deadlineLabel: 'May 18, 2026',
            description: 'Provide a concise abstract covering problem statement, objectives, methodology, and expected outcomes.',
            uploadDescription: 'Submit the abstract document for review.',
            feedback: 'Methodology section is well detailed. Approved to proceed to Problem Statement.'
        },
        {
            id: 3,
            name: 'Problem Statement',
            status: 'current',
            deadline: '2026-07-08',
            deadlineLabel: 'Jul 08, 2026',
            description: 'Submit a detailed problem statement document outlining the inventory management challenges and proposed solution scope.',
            uploadDescription: 'Submit the problem statement document for review.',
            feedback: null
        },
        {
            id: 4,
            name: 'Literature Survey',
            status: 'upcoming',
            deadline: '2026-07-15',
            deadlineLabel: 'Jul 15, 2026',
            description: 'Review existing inventory management systems and document relevant research papers and technologies.',
            uploadDescription: 'Submit the literature survey document for review.',
            feedback: null
        },
        {
            id: 5,
            name: 'System Design',
            status: 'upcoming',
            deadline: '2026-07-22',
            deadlineLabel: 'Jul 22, 2026',
            description: 'Present system architecture, database schema, API design, and UI wireframes.',
            uploadDescription: 'Submit the system design document for review.',
            feedback: null
        },
        {
            id: 6,
            name: 'Modules',
            status: 'upcoming',
            deadline: '2026-08-05',
            deadlineLabel: 'Aug 05, 2026',
            description: 'Define and document individual modules: stock tracking, alerts, reporting, and user management.',
            uploadDescription: 'Submit the module specification document for review.',
            feedback: null
        },
        {
            id: 7,
            name: 'Coding',
            status: 'upcoming',
            deadline: '2026-08-20',
            deadlineLabel: 'Aug 20, 2026',
            description: 'Implement the application with working backend APIs and frontend interface.',
            uploadDescription: 'Submit coding progress report and repository link.',
            feedback: null
        },
        {
            id: 8,
            name: 'Testing',
            status: 'upcoming',
            deadline: '2026-09-05',
            deadlineLabel: 'Sep 05, 2026',
            description: 'Perform unit, integration, and user acceptance testing with documented test cases.',
            uploadDescription: 'Submit the testing report and test case documentation.',
            feedback: null
        },
        {
            id: 9,
            name: 'Report',
            status: 'upcoming',
            deadline: '2026-09-20',
            deadlineLabel: 'Sep 20, 2026',
            description: 'Compile the final project report following the ILP documentation guidelines.',
            uploadDescription: 'Submit the final project report for review.',
            feedback: null
        },
        {
            id: 10,
            name: 'Presentation',
            status: 'upcoming',
            deadline: '2026-10-05',
            deadlineLabel: 'Oct 05, 2026',
            description: 'Prepare and deliver the final project presentation to faculty evaluators.',
            uploadDescription: 'Submit presentation slides (PPTX) for review.',
            feedback: null
        }
    ];

    const submissions = [
        {
            stageId: 1,
            stageLabel: 'Project Title',
            document: 'title.pdf',
            icon: 'fa-file-pdf',
            iconColor: 'var(--danger)',
            submitted: '12 May 2026',
            status: 'Approved',
            statusClass: 'success',
            feedback: 'Great topic! Approved to proceed.'
        },
        {
            stageId: 2,
            stageLabel: 'Abstract',
            document: 'abstract_v1.docx',
            icon: 'fa-file-word',
            iconColor: 'var(--primary)',
            submitted: '18 May 2026',
            status: 'Revision Needed',
            statusClass: 'danger',
            feedback: 'Please expand on the methodology section.'
        },
        {
            stageId: 2,
            stageLabel: 'Abstract (Resubmission)',
            document: 'abstract_v2.docx',
            icon: 'fa-file-word',
            iconColor: 'var(--primary)',
            submitted: '20 May 2026',
            status: 'Approved',
            statusClass: 'success',
            feedback: 'Methodology section is well detailed. Approved to proceed to Problem Statement.'
        }
    ];

    const statusLabels = {
        completed: { text: 'Completed', class: 'success' },
        current: { text: 'In Progress', class: 'warning' },
        upcoming: { text: 'Upcoming', class: '' }
    };

    let selectedStageId = stages.find(s => s.status === 'current')?.id || 1;

    // 1. TAB SWITCHING
    const projectTabs = document.querySelectorAll('.project-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    projectTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            projectTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // 2. STAGE STEPPER INTERACTIVITY
    const stepperSteps = document.querySelectorAll('.stepper-step[data-stage-id]');
    const stageDetailTitle = document.getElementById('stageDetailTitle');
    const stageDetailStatus = document.getElementById('stageDetailStatus');
    const stageDetailDeadline = document.getElementById('stageDetailDeadline');
    const stageDetailDescription = document.getElementById('stageDetailDescription');
    const stageDetailFeedbackWrap = document.getElementById('stageDetailFeedbackWrap');
    const stageDetailFeedback = document.getElementById('stageDetailFeedback');
    const uploadPanel = document.getElementById('uploadPanel');
    const uploadTitle = document.getElementById('uploadTitle');
    const uploadDescription = document.getElementById('uploadDescription');
    const countdownBadge = document.getElementById('countdownBadge');
    const submissionHistoryBody = document.getElementById('submissionHistoryBody');

    function getStage(id) {
        return stages.find(s => s.id === id);
    }

    function renderStageDetail(stage) {
        if (!stage) return;

        if (stageDetailTitle) {
            stageDetailTitle.textContent = 'Stage ' + stage.id + ': ' + stage.name;
        }

        if (stageDetailStatus) {
            const label = statusLabels[stage.status] || statusLabels.upcoming;
            stageDetailStatus.textContent = label.text;
            stageDetailStatus.className = 'status-pill ' + label.class;
            if (!label.class) {
                stageDetailStatus.style.background = 'var(--border)';
                stageDetailStatus.style.color = 'var(--text-light)';
            } else {
                stageDetailStatus.style.background = '';
                stageDetailStatus.style.color = '';
            }
        }

        if (stageDetailDeadline) {
            stageDetailDeadline.textContent = stage.deadlineLabel;
        }

        if (stageDetailDescription) {
            stageDetailDescription.textContent = stage.description;
        }

        if (stageDetailFeedbackWrap && stageDetailFeedback) {
            if (stage.feedback) {
                stageDetailFeedbackWrap.style.display = '';
                stageDetailFeedback.textContent = stage.feedback;
            } else {
                stageDetailFeedbackWrap.style.display = 'none';
                stageDetailFeedback.textContent = '';
            }
        }

        syncUploadPanel(stage);
        renderSubmissionHistory(stage.id);
    }

    function renderSubmissionHistory(stageId) {
        if (!submissionHistoryBody) return;

        const stageSubmissions = submissions.filter(s => s.stageId === stageId);
        submissionHistoryBody.innerHTML = '';

        if (stageSubmissions.length === 0) {
            const stage = getStage(stageId);
            const stageName = stage ? stage.name : 'this stage';
            submissionHistoryBody.innerHTML =
                '<tr class="submission-empty"><td colspan="6">No submissions yet for Stage ' +
                stageId + ': ' + stageName + '.</td></tr>';
            return;
        }

        stageSubmissions.forEach(function(sub, index) {
            const row = document.createElement('tr');
            row.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + sub.stageLabel + '</td>' +
                '<td><i class="fa-solid ' + sub.icon + '" style="color:' + sub.iconColor + ';"></i> ' + sub.document + '</td>' +
                '<td>' + sub.submitted + '</td>' +
                '<td><span class="status-pill ' + sub.statusClass + '">' + sub.status + '</span></td>' +
                '<td>' + (sub.feedback
                    ? '<button type="button" class="btn-text view-feedback-btn">View</button>'
                    : '<span style="color:var(--text-light);">—</span>') +
                '</td>';

            submissionHistoryBody.appendChild(row);

            if (sub.feedback) {
                const feedbackRow = document.createElement('tr');
                feedbackRow.className = 'feedback-row';
                const feedbackClass = sub.statusClass === 'danger' ? ' style="color:var(--danger);"' : '';
                feedbackRow.innerHTML =
                    '<td colspan="6"><div class="feedback-content"' + feedbackClass + '>' +
                    '<strong>Mentor:</strong> ' + sub.feedback + '</div></td>';
                submissionHistoryBody.appendChild(feedbackRow);
            }
        });
    }

    if (submissionHistoryBody) {
        submissionHistoryBody.addEventListener('click', function(e) {
            const btn = e.target.closest('.view-feedback-btn');
            if (!btn) return;
            const feedbackRow = btn.closest('tr').nextElementSibling;
            if (feedbackRow && feedbackRow.classList.contains('feedback-row')) {
                feedbackRow.classList.toggle('show');
            }
        });
    }

    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'pdf') return { icon: 'fa-file-pdf', color: 'var(--danger)' };
        if (ext === 'doc' || ext === 'docx') return { icon: 'fa-file-word', color: 'var(--primary)' };
        if (ext === 'ppt' || ext === 'pptx') return { icon: 'fa-file-powerpoint', color: 'var(--warning)' };
        return { icon: 'fa-file-image', color: 'var(--success)' };
    }

    function formatSubmittedDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    function syncUploadPanel(stage) {
        const isUploadStage = stage.status === 'current' || stage.status === 'revision';

        if (uploadPanel) {
            uploadPanel.style.display = isUploadStage ? '' : 'none';
        }

        if (!isUploadStage) return;

        if (uploadTitle) {
            uploadTitle.textContent = 'Stage ' + stage.id + ': ' + stage.name;
        }
        if (uploadDescription) {
            uploadDescription.textContent = stage.uploadDescription;
        }
        if (countdownBadge) {
            countdownBadge.style.display = stage.status === 'current' ? '' : 'none';
        }
    }

    function selectStage(id) {
        selectedStageId = id;
        stepperSteps.forEach(step => {
            step.classList.toggle('selected', parseInt(step.dataset.stageId, 10) === id);
        });
        renderStageDetail(getStage(id));
    }

    stepperSteps.forEach(step => {
        step.addEventListener('click', function() {
            selectStage(parseInt(this.dataset.stageId, 10));
        });
    });

    selectStage(selectedStageId);

    // 3. FILE UPLOAD
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('documentUpload');
    const fileNameEl = document.getElementById('fileName');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = '#E0E7FF';
            this.style.borderColor = 'var(--primary-dark)';
        });

        uploadArea.addEventListener('dragleave', function() {
            this.style.background = '';
            this.style.borderColor = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.style.borderColor = '';
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                fileNameEl.textContent = e.dataTransfer.files[0].name;
                fileNameEl.style.color = 'var(--primary)';
                fileNameEl.style.fontWeight = '600';
            }
        });

        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                fileNameEl.textContent = this.files[0].name;
                fileNameEl.style.color = 'var(--primary)';
                fileNameEl.style.fontWeight = '600';
            }
        });
    }

    function resetFileUpload() {
        if (fileInput) fileInput.value = '';
        if (fileNameEl) {
            fileNameEl.textContent = 'PDF, DOC, DOCX, PPT, PPTX, JPG or PNG (Max 10MB)';
            fileNameEl.style.color = '';
            fileNameEl.style.fontWeight = '';
        }
    }

    // 4. SUBMIT DOCUMENT
    const submitBtn = document.getElementById('submitDocumentBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (!fileInput || !fileInput.files.length) {
                showToast('Please select a file to upload', 'error');
                return;
            }

            const stage = getStage(selectedStageId);
            if (stage && stage.status === 'current') {
                const file = fileInput.files[0];
                const fileMeta = getFileIcon(file.name);
                submissions.push({
                    stageId: stage.id,
                    stageLabel: stage.name,
                    document: file.name,
                    icon: fileMeta.icon,
                    iconColor: fileMeta.color,
                    submitted: formatSubmittedDate(new Date()),
                    status: 'Approval Pending',
                    statusClass: 'warning',
                    feedback: null
                });
                renderSubmissionHistory(selectedStageId);
            }

            showToast('Document submitted successfully!', 'success');
            resetFileUpload();
        });
    }

    // 5. RESET BUTTON
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFileUpload);
    }

    // 6. RESOURCE FORMS
    const componentBookingForm = document.getElementById('componentBookingForm');
    if (componentBookingForm) {
        componentBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm(this)) return;
            const qty = this.querySelector('[name="quantity"]');
            if (qty && parseInt(qty.value, 10) < 1) {
                showToast('Quantity must be at least 1', 'error');
                return;
            }
            showToast('Component request submitted!', 'warning');
            this.reset();
            if (qty) qty.value = '1';
        });
    }

    const componentReturnForm = document.getElementById('componentReturnForm');
    if (componentReturnForm) {
        componentReturnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm(this)) return;
            const qty = this.querySelector('[name="quantity"]');
            if (qty && parseInt(qty.value, 10) < 1) {
                showToast('Quantity must be at least 1', 'error');
                return;
            }
            showToast('Return request submitted!', 'warning');
            this.reset();
            if (qty) qty.value = '1';
        });
    }

    const equipmentBookingForm = document.getElementById('equipmentBookingForm');
    const equipBookingEquipment = document.getElementById('equipBookingEquipment');
    const equipBookingDate = document.getElementById('equipBookingDate');
    const equipSelectedSlot = document.getElementById('equipSelectedSlot');
    const slotPicker = document.getElementById('slotPicker');

    const LAB_SLOTS = [
        { id: '09-10', label: '09:00 - 10:00 AM' },
        { id: '10-11', label: '10:00 - 11:00 AM' },
        { id: '11-12', label: '11:00 AM - 12:00 PM' },
        { id: '14-15', label: '02:00 - 03:00 PM' },
        { id: '15-16', label: '03:00 - 04:00 PM' },
        { id: '16-17', label: '04:00 - 05:00 PM' }
    ];

    const EQUIPMENT_BOOKINGS = {
        '3D Printer': ['09-10', '14-15'],
        'Laser Cutter': ['10-11', '15-16'],
        'CNC Router': ['11-12', '16-17'],
        'PCB Mill': ['09-10', '10-11', '14-15']
    };

    if (equipBookingDate) {
        const today = new Date();
        equipBookingDate.min = today.toISOString().split('T')[0];
    }

    function resetSlotPicker(message) {
        if (equipSelectedSlot) equipSelectedSlot.value = '';
        if (!slotPicker) return;
        slotPicker.innerHTML = '<p class="slot-picker-hint"><i class="fa-regular fa-calendar"></i> ' +
            (message || 'Select equipment and date to view slots') + '</p>';
    }

    function isWeekend(dateStr) {
        const day = new Date(dateStr + 'T12:00:00').getDay();
        return day === 0 || day === 6;
    }

    function getBookedSlots(equipment, dateStr) {
        const base = EQUIPMENT_BOOKINGS[equipment] || [];
        const dayIndex = new Date(dateStr + 'T12:00:00').getDate() % 3;
        if (dayIndex === 0) return base;
        if (dayIndex === 1) return base.slice(0, 1);
        return base.concat(['15-16'].filter(id => !base.includes(id)));
    }

    function renderSlotPicker() {
        if (!slotPicker || !equipBookingEquipment || !equipBookingDate) return;

        const equipment = equipBookingEquipment.value;
        const date = equipBookingDate.value;
        equipSelectedSlot.value = '';

        if (!equipment || !date) {
            resetSlotPicker();
            return;
        }

        if (isWeekend(date)) {
            resetSlotPicker('Lab is closed on weekends. Please choose a weekday.');
            return;
        }

        const booked = getBookedSlots(equipment, date);
        slotPicker.innerHTML = '';

        LAB_SLOTS.forEach(function(slot) {
            const isBooked = booked.includes(slot.id);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'slot-btn ' + (isBooked ? 'booked' : 'available');
            btn.dataset.slotId = slot.id;
            btn.dataset.slotLabel = slot.label;
            btn.disabled = isBooked;
            btn.innerHTML =
                '<span class="slot-time">' + slot.label + '</span>' +
                '<span class="slot-status">' + (isBooked ? 'Booked' : 'Available') + '</span>';

            if (!isBooked) {
                btn.addEventListener('click', function() {
                    slotPicker.querySelectorAll('.slot-btn.available').forEach(function(b) {
                        b.classList.remove('selected');
                        b.querySelector('.slot-status').textContent = 'Available';
                    });
                    btn.classList.add('selected');
                    btn.querySelector('.slot-status').textContent = 'Selected';
                    equipSelectedSlot.value = slot.label;
                });
            }

            slotPicker.appendChild(btn);
        });
    }

    function formatBookingDate(dateStr) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const d = new Date(dateStr + 'T12:00:00');
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function parseSlotTimes(slotLabel) {
        const parts = slotLabel.split(' - ');
        return { start: parts[0].trim(), end: parts[1].trim() };
    }

    if (equipBookingEquipment) {
        equipBookingEquipment.addEventListener('change', renderSlotPicker);
    }
    if (equipBookingDate) {
        equipBookingDate.addEventListener('change', renderSlotPicker);
    }

    if (equipmentBookingForm) {
        equipmentBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!equipBookingEquipment.value || !equipBookingDate.value) {
                showToast('Please select equipment and date', 'error');
                return;
            }
            if (isWeekend(equipBookingDate.value)) {
                showToast('Lab is closed on weekends', 'error');
                return;
            }
            if (!equipSelectedSlot.value) {
                showToast('Please select an available slot', 'error');
                return;
            }
            const times = parseSlotTimes(equipSelectedSlot.value);
            const bookingDate = formatBookingDate(equipBookingDate.value);
            showToast(
                'Equipment slot booking request on ' + bookingDate +
                ' from ' + times.start + ' to ' + times.end +
                ' has forwarded to lab-in-charge',
                'warning'
            );
            this.reset();
            resetSlotPicker();
        });
    }
});
