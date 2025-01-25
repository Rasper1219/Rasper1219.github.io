// script.js

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const submitBtn = document.getElementById('submitBtn');
  
    // 1. Insert a <span class="rank-label"> into each card
    initializeRankLabels();
    
    // 2. Create a Sortable instance on our gridContainer
    new Sortable(gridContainer, {
      animation: 150,         // ms, animation speed moving items
      ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
      onEnd: function () {
        // After a drag-and-drop reordering is done, update rank labels
        updateRankLabels();
      }
    });
  
    // 3. Update rank labels initially
    updateRankLabels();
  
    // 4. Handle submit button
    submitBtn.addEventListener('click', () => handleSubmit(submitBtn));
  });
  
  function initializeRankLabels() {
    // Insert an empty rank-label span at the start of each .card
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const nameText = card.innerHTML;
      card.innerHTML = `<span class="rank-label"></span>${nameText}`;
    });
  }
  
  function updateRankLabels() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      const rankLabelSpan = card.querySelector('.rank-label');
      if (rankLabelSpan) {
        rankLabelSpan.textContent = (index + 1) + ". ";
      }
    });
  }
  
  /**
   * Asks for confirmation, then—if the user confirms—
   * gathers the order of cards, disables the button,
   * changes its text to "Submitting...", and sends data to Google Apps Script.
   */
  function handleSubmit(submitButton) {
    // 1. Confirm dialog
    const userConfirmed = confirm("Are you sure you want to submit your rankings?");
    if (!userConfirmed) return;
  
    // 2. Disable the submit button and show "Submitting..."
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
  
    // 3. Gather final order
    const finalCards = document.querySelectorAll('.card');
    const finalOrder = [];
    finalCards.forEach(card => {
      finalOrder.push(card.dataset.name);
    });
  
    // 4. Submit via fetch with text/plain to avoid preflight CORS
    fetch('https://script.google.com/macros/s/AKfycbx_7nxp87zFsfMCxmfuGQB80n4quIzHBXU4mrh1hiQxbuIJK9__uHOjixDEub5J1YEA/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      // We still send JSON in the body, but it's interpreted as raw text on the backend
      body: JSON.stringify({ rankings: finalOrder })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Submit successful!');
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('Submit failed. Check console for more info.');
    })
    .finally(() => {
      // 5. Re-enable the button and restore text
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    });
  }
  